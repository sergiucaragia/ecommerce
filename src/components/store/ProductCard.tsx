'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/useT';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { t, tGender } = useT();

  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card group block"
    >
      {/* Immagine */}
      <div
        className="aspect-[3/4] overflow-hidden relative"
        style={{ background: '#F5F5F5' }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-display font-bold text-lg"
            style={{ color: '#C8BFB4' }}
          >
            {t.noImage}
          </div>
        )}

        {product.stock === 0 && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold tracking-widest uppercase px-2.5 py-1"
            style={{ background: 'var(--ink)', color: 'var(--cream)' }}
          >
            {t.outOfStock}
          </span>
        )}

        {/* Overlay hover sottile */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(27,25,23,0.04)' }}
        />
      </div>

      {/* Info */}
      <div className="pt-3 pb-1 px-0.5">
        <p
          className="text-[10px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: 'var(--muted)' }}
        >
          {tGender(product.gender)}
          {product.category ? ` · ${product.category.name}` : ''}
        </p>
        <h3
          className="mt-1 text-sm font-medium leading-snug"
          style={{ color: 'var(--ink)' }}
        >
          {product.name}
        </h3>
        <p
          className="mt-1.5 text-sm font-semibold"
          style={{ color: 'var(--gold)' }}
        >
          €{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
