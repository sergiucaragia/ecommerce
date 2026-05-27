'use client';

import Link from 'next/link';
import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';
import { useT } from '@/lib/i18n/useT';

export function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { t } = useT();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 animate-fade-in"
          style={{ background: 'rgba(27,25,23,0.35)' }}
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          width: 'min(420px, 100vw)',
          background: '#fff',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.08)',
        }}
        aria-label={t.cart}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2.5">
            <h2
              className="font-display text-xl font-bold tracking-tight"
              style={{ color: 'var(--ink)' }}
            >
              {t.cart}
            </h2>
            {items.length > 0 && (
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--ink)', color: '#fff' }}
              >
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" style={{ color: 'var(--ink)' }} />
          </button>
        </div>

        {/* ── Vuoto ── */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: '#F5F5F5' }}
            >
              <ShoppingBag className="w-7 h-7" style={{ color: '#CBCBCB' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
              {t.cartEmpty}
            </p>
            <button
              onClick={closeCart}
              className="mt-2 text-xs font-semibold tracking-widest uppercase underline underline-offset-4 transition-opacity hover:opacity-50"
              style={{ color: 'var(--ink)' }}
            >
              {t.continueShopping}
            </button>
          </div>
        ) : (
          <>
            {/* ── Lista prodotti ── */}
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.selected_size}-${item.selected_color}`}
                  className="flex gap-4 py-5"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  {/* Immagine grande */}
                  <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{ width: '80px', height: '100px', background: '#F5F5F5', flexShrink: 0 }}
                  >
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <p
                        className="text-sm font-medium leading-snug"
                        style={{ color: 'var(--ink)' }}
                      >
                        {item.product.name}
                      </p>
                      {(item.selected_size || item.selected_color) && (
                        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                          {[item.selected_size, item.selected_color].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>

                    {/* Quantità + prezzo */}
                    <div className="flex items-center justify-between mt-3">
                      <div
                        className="inline-flex items-center"
                        style={{ border: '1px solid var(--border)' }}
                      >
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selected_size, item.selected_color, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-50"
                          aria-label="Rimuovi uno"
                        >
                          <Minus className="w-3 h-3" style={{ color: 'var(--ink)' }} />
                        </button>
                        <span
                          className="w-8 text-center text-sm font-medium"
                          style={{ color: 'var(--ink)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selected_size, item.selected_color, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-50"
                          aria-label="Aggiungi uno"
                        >
                          <Plus className="w-3 h-3" style={{ color: 'var(--ink)' }} />
                        </button>
                      </div>

                      <p
                        className="text-sm font-semibold"
                        style={{ color: 'var(--ink)' }}
                      >
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Elimina */}
                  <button
                    onClick={() => removeItem(item.product.id, item.selected_size, item.selected_color)}
                    className="self-start mt-0.5 p-1 transition-opacity hover:opacity-40 flex-shrink-0"
                    aria-label={t.remove}
                  >
                    <X className="w-3.5 h-3.5" style={{ color: '#CBCBCB' }} />
                  </button>
                </li>
              ))}
            </ul>

            {/* ── Footer ── */}
            <div
              className="px-6 py-6 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border)', background: '#fff' }}
            >
              {/* Totale */}
              <div className="flex justify-between items-baseline mb-5">
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--muted)' }}
                >
                  {t.total}
                </span>
                <span
                  className="font-display text-3xl font-bold tracking-tight"
                  style={{ color: 'var(--ink)' }}
                >
                  €{totalPrice().toFixed(2)}
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full text-center py-4 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-75"
                style={{ background: 'var(--ink)', color: '#fff' }}
              >
                {t.checkout}
              </Link>

              <button
                onClick={closeCart}
                className="block w-full text-center mt-3 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-50"
                style={{ color: 'var(--muted)' }}
              >
                {t.continueShopping}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
