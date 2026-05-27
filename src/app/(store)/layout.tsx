import { Navbar } from "@/components/store/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--cream)" }}
    >
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <CartDrawer />

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--ink)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p
              className="font-display text-2xl font-black tracking-tight"
              style={{ color: "var(--cream)" }}
            >
              situl meu
            </p>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Îmbrăcăminte de calitate.
              <br />
              Răsfoiește și comandă online.
            </p>
          </div>

          {/* Links */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "var(--muted)" }}
            >
              Magazine
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "#9E9590" }}>
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Catalog
                </a>
              </li>
              <li>
                <a
                  href="/checkout"
                  className="hover:text-white transition-colors"
                >
                  Comandă
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "var(--muted)" }}
            >
              Contact
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "#9E9590" }}>
              <li>comenzi@magazinulmeu.ro</li>
            </ul>
          </div>
        </div>

        <div
          style={{ borderTop: "1px solid #2E2B28" }}
          className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2"
        >
          <p className="text-xs" style={{ color: "#5A5450" }}>
            © {new Date().getFullYear()} Magazinul Meu — Toate drepturile
            rezervate.
          </p>
        </div>
      </footer>
    </div>
  );
}
