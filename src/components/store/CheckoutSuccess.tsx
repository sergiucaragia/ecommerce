'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useT } from '@/lib/i18n/useT';

export function CheckoutSuccess() {
  const { t } = useT();
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center animate-fade-up">
      <CheckCircle className="w-14 h-14 mx-auto mb-6" style={{ color: '#2D6A4F' }} />
      <h1
        className="font-display text-4xl font-extrabold tracking-tight"
        style={{ color: 'var(--ink)' }}
      >
        {t.orderSent}
      </h1>
      <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
        {t.thankYou}
      </p>
      <Link
        href="/"
        className="inline-block mt-8 px-8 py-3.5 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-70"
        style={{ background: 'var(--ink)', color: 'var(--cream)' }}
      >
        {t.continueShopping}
      </Link>
    </div>
  );
}
