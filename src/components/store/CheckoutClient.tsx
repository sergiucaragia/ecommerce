"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";
import type { CheckoutFormData } from "@/types";

const inputClass = `
  w-full px-4 py-3 text-sm bg-white
  focus:outline-none focus:ring-1 transition-shadow
`;
const inputStyle = {
  border: "1px solid var(--border)",
  color: "var(--ink)",
};

export function CheckoutClient() {
  const { t } = useT();
  const { items, totalPrice } = useCartStore();
  const [form, setForm] = useState<CheckoutFormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center">
        <p
          className="font-display text-3xl font-bold tracking-tight"
          style={{ color: "var(--muted)" }}
        >
          {t.cartIsEmpty}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-6 text-xs font-semibold tracking-widest uppercase hover:opacity-50 transition-opacity"
          style={{ color: "var(--ink)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t.backToCatalogLink}
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) throw new Error(t.stockError);
        throw new Error(data.message ?? t.orderError);
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message ?? t.genericError);
    } finally {
      setLoading(false);
    }
  };

  const total = totalPrice();

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    marginBottom: "8px",
    color: "var(--muted)",
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-10 transition-opacity hover:opacity-50"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t.continueShopping}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14">
        {/* Form */}
        <div>
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-1"
            style={{ color: "var(--gold)" }}
          >
            Checkout
          </p>
          <h1
            className="font-display text-4xl font-extrabold tracking-tight mb-8"
            style={{ color: "var(--ink)" }}
          >
            {t.yourData}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label style={labelStyle}>{t.fullName}</label>
              <input
                name="customer_name"
                type="text"
                required
                value={form.customer_name}
                onChange={handleChange}
                placeholder={t.namePlaceholder}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>{t.email}</label>
              <input
                name="customer_email"
                type="email"
                required
                value={form.customer_email}
                onChange={handleChange}
                placeholder={t.emailPlaceholder}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>{t.phone}</label>
              <input
                name="customer_phone"
                type="tel"
                required
                value={form.customer_phone}
                onChange={handleChange}
                placeholder={t.phonePlaceholder}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>{t.shippingAddress}</label>
              <textarea
                name="shipping_address"
                required
                value={form.shipping_address}
                onChange={handleChange}
                placeholder={t.addressPlaceholder}
                rows={3}
                className={inputClass + " resize-none"}
                style={inputStyle}
              />
            </div>

            {error && (
              <p
                className="text-xs px-4 py-3"
                style={{
                  background: "#FEF2F2",
                  color: "#991B1B",
                  border: "1px solid #FECACA",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-4 text-sm font-semibold tracking-widest uppercase transition-opacity disabled:opacity-50 mt-2 hover:opacity-80"
              style={{ background: "var(--ink)", color: "var(--cream)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {t.sending}
                </>
              ) : (
                `${t.sendOrder} — €${total.toFixed(2)}`
              )}
            </button>

            <p
              className="text-xs text-center"
              style={{ color: "var(--muted)" }}
            >
              🔒 Pagamento sicuro via Stripe
            </p>
          </form>
        </div>

        {/* Riepilogo ordine */}
        <div>
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{
              color: "var(--muted)",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "16px",
            }}
          >
            {t.selectedProducts}
          </p>

          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {items.map((item) => (
              <li
                key={`${item.product.id}-${item.selected_size}-${item.selected_color}`}
                className="flex gap-3 py-4"
              >
                <div
                  className="w-14 h-18 flex-shrink-0 overflow-hidden"
                  style={{
                    width: "56px",
                    height: "72px",
                    background: "#F5F5F5",
                  }}
                >
                  {item.product.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--ink)" }}
                  >
                    {item.product.name}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--muted)" }}
                  >
                    {[item.selected_size, item.selected_color]
                      .filter(Boolean)
                      .join(" · ")}{" "}
                    × {item.quantity}
                  </p>
                </div>
                <p
                  className="text-sm font-semibold whitespace-nowrap"
                  style={{ color: "var(--gold)" }}
                >
                  €{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div
            className="flex justify-between items-baseline pt-5"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "var(--muted)" }}
            >
              {t.total}
            </span>
            <span
              className="font-display text-2xl font-bold tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              €{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
