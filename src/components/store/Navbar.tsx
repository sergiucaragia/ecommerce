"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useT } from "@/lib/i18n/useT";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function DyaLogo() {
  return (
    <Link
      href="/"
      className="flex flex-col items-center leading-none select-none hover:opacity-70 transition-opacity"
      style={{ gap: "2px" }}
    >
      <span
        style={{
          fontFamily: "var(--font-display), Barlow, sans-serif",
          fontWeight: 900,
          fontSize: "1.75rem",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: "var(--ink)",
        }}
      >
        situl meu
      </span>
      <span
        style={{
          fontFamily: "var(--font-display), Barlow, sans-serif",
          fontWeight: 500,
          fontSize: "0.55rem",
          letterSpacing: "0.45em",
          lineHeight: 1,
          color: "var(--ink)",
          paddingLeft: "0.45em" /* compensa lo spacing dell'ultimo carattere */,
        }}
      >
        meu
      </span>
    </Link>
  );
}

export function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems)();
  const openCart = useUIStore((s) => s.openCart);
  const { t } = useT();

  return (
    <header
      className="sticky top-0 z-40"
      style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 grid grid-cols-3 items-center">
        {/* Sinistra — lingua */}
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>

        {/* Centro — logo */}
        <div className="flex justify-center">
          <DyaLogo />
        </div>

        {/* Destra — carrello */}
        <div className="flex justify-end">
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 group"
            aria-label={t.openCart}
          >
            <ShoppingBag
              className="w-5 h-5 transition-opacity group-hover:opacity-60"
              style={{ color: "var(--ink)" }}
            />
            {totalItems > 0 && (
              <span
                className="text-sm font-semibold tabular-nums"
                style={{
                  color: "var(--ink)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
