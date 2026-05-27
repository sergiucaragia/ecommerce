import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import { sendOrderNotification } from '@/lib/telegram';
import { sendOrderConfirmationEmail } from '@/lib/email';
import type { Order } from '@/types';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const adminSupabase = createAdminClient();

  try {
    // Idempotency: skip if this session was already processed
    const { data: existing } = await adminSupabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ received: true });
    }

    const meta = session.metadata ?? {};
    const itemCount = parseInt(meta.item_count ?? '0', 10);

    const items = Array.from({ length: itemCount }, (_, i) => {
      return JSON.parse(meta[`item_${i}`]) as {
        product_id: string;
        product_name: string;
        product_price: number;
        quantity: number;
        selected_size: string | null;
        selected_color: string | null;
      };
    });

    const total_amount = items.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );

    const { data: result, error: rpcError } = await adminSupabase.rpc('place_order', {
      p_customer_name:    meta.customer_name ?? '',
      p_customer_email:   session.customer_email ?? '',
      p_customer_phone:   meta.customer_phone ?? '',
      p_shipping_address: meta.shipping_address ?? '',
      p_total_amount:     total_amount,
      p_items: items.map((item) => ({
        product_id:     item.product_id,
        product_name:   item.product_name,
        product_price:  item.product_price,
        quantity:       item.quantity,
        selected_size:  item.selected_size,
        selected_color: item.selected_color,
      })),
    });

    if (rpcError || !result?.success) {
      console.error('place_order failed:', rpcError ?? result);
      return NextResponse.json({ received: true });
    }

    const orderId: string = result.order_id;

    // Attach the Stripe session ID for idempotency and traceability
    await adminSupabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', orderId);

    // Fetch full order for notifications
    const { data: order } = await adminSupabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (order) {
      await Promise.all([
        sendOrderNotification(order as Order),
        sendOrderConfirmationEmail(order as Order),
      ]);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    // Always return 200 to avoid Stripe retrying indefinitely
  }

  return NextResponse.json({ received: true });
}
