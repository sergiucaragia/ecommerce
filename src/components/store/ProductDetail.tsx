'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { useT } from '@/lib/i18n/useT';
import type { Product } from '@/types';

export function ProductDetail({ product }: { product: Product }) {
  const { t, tGender } = useT();

  const gallery = product.images?.length > 0
    ? product.images
    : product.image_url ? [product.image_url] : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors.length === 1 ? product.colors[0] : null
  );
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const canAdd =
    product.stock > 0 &&
    (product.sizes.length === 0 || selectedSize !== null) &&
    (product.colors.length === 0 || selectedColor !== null);

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const prev = () => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActiveIndex((i) => (i + 1) % gallery.length);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-10 transition-opacity hover:opacity-50"
        style={{ color: 'var(--muted)' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t.backToCatalog}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

        {/* Galleria */}
        <div className="space-y-3">
          <div
            className="aspect-[3/4] overflow-hidden relative"
            style={{ background: '#F5F5F5' }}
          >
            {gallery.length > 0 ? (
              <>
                <img
                  src={gallery[activeIndex]}
                  alt={`${product.name} — ${t.imageAlt} ${activeIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background: 'var(--cream)' }}
                      aria-label={t.prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" style={{ color: 'var(--ink)' }} />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background: 'var(--cream)' }}
                      aria-label={t.nextImage}
                    >
                      <ChevronRight className="w-4 h-4" style={{ color: 'var(--ink)' }} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {gallery.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          className="transition-all duration-300"
                          style={{
                            width: i === activeIndex ? '24px' : '6px',
                            height: '2px',
                            background: i === activeIndex ? 'var(--cream)' : 'rgba(247,243,237,0.4)',
                          }}
                          aria-label={`${t.goToImage} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-display font-bold text-xl"
                style={{ color: '#C8BFB4' }}
              >
                {t.noImage}
              </div>
            )}
          </div>

          {/* Miniature */}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="flex-shrink-0 w-14 h-18 overflow-hidden transition-all duration-200"
                  style={{
                    width: '56px',
                    height: '72px',
                    outline: i === activeIndex ? '2px solid var(--ink)' : '2px solid transparent',
                    opacity: i === activeIndex ? 1 : 0.5,
                  }}
                >
                  <img src={url} alt={`${t.thumbnail} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info prodotto */}
        <div className="flex flex-col lg:pt-4">
          {/* Categoria + genere */}
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: 'var(--gold)' }}
          >
            {[product.category?.name, tGender(product.gender)].filter(Boolean).join(' · ')}
          </p>

          {/* Nome */}
          <h1
            className="font-display text-4xl sm:text-5xl font-extrabold mt-3 leading-tight tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            {product.name}
          </h1>

          {/* Prezzo */}
          <p
            className="font-display text-3xl font-bold mt-4 tracking-tight"
            style={{ color: 'var(--gold)' }}
          >
            €{product.price.toFixed(2)}
          </p>

          {/* Descrizione */}
          {product.description && (
            <p
              className="text-sm leading-relaxed mt-6"
              style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '24px' }}
            >
              {product.description}
            </p>
          )}

          {/* Taglie */}
          {product.sizes.length > 0 && (
            <div className="mt-7">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: 'var(--muted)' }}
              >
                {t.size}
                {selectedSize && (
                  <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: 'var(--ink)' }}>
                    — {selectedSize}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="w-11 h-11 text-sm font-medium transition-all"
                    style={
                      selectedSize === size
                        ? { background: 'var(--ink)', color: 'var(--cream)', border: '1px solid var(--ink)' }
                        : { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border)' }
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colori */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: 'var(--muted)' }}
              >
                {t.color}
                {selectedColor && (
                  <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: 'var(--ink)' }}>
                    — {selectedColor}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="px-4 h-9 text-sm font-medium transition-all"
                    style={
                      selectedColor === color
                        ? { background: 'var(--ink)', color: 'var(--cream)', border: '1px solid var(--ink)' }
                        : { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border)' }
                    }
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.stock === 0 && (
            <p
              className="mt-5 text-xs font-semibold tracking-widest uppercase"
              style={{ color: '#C0392B' }}
            >
              {t.productOutOfStock}
            </p>
          )}

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className="mt-8 w-full flex items-center justify-center gap-2.5 py-4 text-sm font-semibold tracking-widest uppercase transition-all active:scale-[0.98]"
            style={
              added
                ? { background: '#2D6A4F', color: '#fff', border: 'none' }
                : canAdd
                ? { background: 'var(--ink)', color: 'var(--cream)', border: 'none' }
                : { background: 'var(--border)', color: 'var(--muted)', cursor: 'not-allowed', border: 'none' }
            }
          >
            {added ? (
              <><Check className="w-4 h-4" /> {t.addedToCart}</>
            ) : (
              <><ShoppingBag className="w-4 h-4" />{product.stock === 0 ? t.outOfStock : t.addToCart}</>
            )}
          </button>

          {!canAdd && product.stock > 0 && (
            <p
              className="text-xs text-center mt-2"
              style={{ color: 'var(--muted)' }}
            >
              {t.select}{' '}
              {!selectedSize && product.sizes.length > 0 ? t.selectSize : ''}
              {!selectedSize && product.sizes.length > 0 && !selectedColor && product.colors.length > 0 ? t.selectAnd : ''}
              {!selectedColor && product.colors.length > 0 ? t.selectColor : ''}{' '}
              {t.selectToContinue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
