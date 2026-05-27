import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type { CreateOrderPayload } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderPayload = await req.json();
    const { customer_name, customer_email, customer_phone, shipping_address, items } = body;

    if (!customer_name?.trim() || !customer_email?.trim() || !customer_phone?.trim() || !shipping_address?.trim()) {
      return NextResponse.json({ message: 'Toate câmpurile sunt obligatorii.' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Coșul de cumpărături este gol.' }, { status: 400 });
    }
    for (const item of items) {
      if (!item.product?.id || item.quantity < 1) {
        return NextResponse.json({ message: 'Date comandă invalide.' }, { status: 400 });
      }
    }

    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

    // Build metadata: customer fields + one key per item (avoids 500-char limit per value)
    const itemsMetadata: Record<string, string> = {};
    items.forEach((item, i) => {
      itemsMetadata[`item_${i}`] = JSON.stringify({
        product_id:     item.product.id,
        product_name:   item.product.name,
        product_price:  item.product.price,
        quantity:       item.quantity,
        selected_size:  item.selected_size ?? null,
        selected_color: item.selected_color ?? null,
      });
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer_email.trim().toLowerCase(),
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(item.product.price * 100), // EUR → centesimi
          product_data: {
            name: item.product.name,
            ...(item.product.image_url ? { images: [item.product.image_url] } : {}),
          },
        },
        quantity: item.quantity,
      })),
      metadata: {
        customer_name:    customer_name.trim(),
        customer_phone:   customer_phone.trim(),
        shipping_address: shipping_address.trim(),
        item_count:       String(items.length),
        ...itemsMetadata,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/checkout`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ message: 'Eroare internă de server.' }, { status: 500 });
  }
}
