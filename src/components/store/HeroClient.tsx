"use client";

import { useT } from "@/lib/i18n/useT";

export function HeroClient() {
  const { t } = useT();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#F5F3F0",
        minHeight: "420px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Griglia decorativa di sfondo */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1B1917 0px, #1B1917 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #1B1917 0px, #1B1917 1px, transparent 1px, transparent 60px)",
        }}
      />

      {/* Frame decorativi "foto girate" */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute hidden lg:block"
          style={{
            right: "6%",
            top: "-10%",
            width: "260px",
            height: "340px",
            border: "1px solid rgba(27,25,23,0.08)",
            transform: "rotate(4deg)",
          }}
        />
        <div
          className="absolute hidden lg:block"
          style={{
            right: "18%",
            top: "15%",
            width: "180px",
            height: "240px",
            border: "1px solid rgba(27,25,23,0.05)",
            transform: "rotate(-2.5deg)",
          }}
        />
        <div
          className="absolute hidden lg:block"
          style={{
            right: "10%",
            bottom: "-5%",
            width: "120px",
            height: "160px",
            border: "1px solid rgba(184,149,106,0.25)",
            transform: "rotate(1.5deg)",
          }}
        />
      </div>

      {/* Contenuto */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center lg:items-end gap-10">
        {/* Testo */}
        <div className="flex-1">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-5 animate-fade-up"
            style={{ color: "var(--gold)" }}
          >
            {t.newCollectionLabel}
          </p>
          <h1
            className="font-display text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tight animate-fade-up-delay-1"
            style={{ color: "var(--ink)" }}
          >
            {t.heroTitle}
          </h1>
          <p
            className="mt-6 text-base font-light max-w-sm leading-relaxed animate-fade-up-delay-2"
            style={{ color: "var(--muted)" }}
          >
            {t.heroSubtitle}
          </p>
          <a
            href="#catalog"
            className="inline-flex items-center gap-3 mt-8 group animate-fade-up-delay-2"
          >
            <span
              className="text-sm font-semibold tracking-widest uppercase transition-opacity group-hover:opacity-50"
              style={{ color: "var(--ink)" }}
            >
              {t.discoverCollection}
            </span>
            <span
              className="w-12 h-px transition-all duration-300 group-hover:w-20"
              style={{ background: "var(--gold)" }}
            />
          </a>
        </div>

        {/* Etichetta decorativa */}
        <div
          className="hidden lg:flex flex-col items-end gap-1 pb-2 animate-fade-in"
          style={{ color: "#C5BDB5" }}
        >
          <p className="text-xs tracking-widest uppercase font-medium">
            situl meu
          </p>
          <div className="w-px h-16" style={{ background: "#C5BDB5" }} />
        </div>
      </div>
    </section>
  );
}
