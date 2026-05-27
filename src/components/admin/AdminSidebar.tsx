"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/useT";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useT();

  const navItems = [
    { href: "/admin", label: t.dashboard, icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: t.products, icon: Package, exact: false },
    {
      href: "/admin/orders",
      label: t.orders,
      icon: ShoppingCart,
      exact: false,
    },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="w-56 shrink-0 bg-white border-r flex flex-col">
      <div className="px-4 py-5 border-b">
        <Link href="/admin" className="text-base font-bold text-gray-900">
          situl meu
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">{t.adminZone}</p>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t space-y-2">
        <LanguageSwitcher />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t.logout}
        </button>
      </div>
    </aside>
  );
}
