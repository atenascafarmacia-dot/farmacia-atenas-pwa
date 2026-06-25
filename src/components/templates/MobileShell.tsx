"use client";

import {
  ClipboardList,
  LayoutGrid,
  type LucideIcon,
  MapPin,
  Package,
  ShoppingCart,
  Store,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { StoreHydrator } from "@/components/atoms/StoreHydrator";
import { Wordmark } from "@/components/atoms/Wordmark";
import { InstallButton } from "@/components/molecules/InstallButton";
import { UserChip } from "@/components/molecules/UserChip";
import { strings } from "@/lib/strings";
import { selectCartCount, useCartStore } from "@/store/cart";

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
  operatorOnly?: boolean;
  customerOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  // Customer menu.
  { href: "/catalogo", label: strings.nav.catalog, Icon: LayoutGrid, customerOnly: true },
  { href: "/carrito", label: strings.nav.cart, Icon: ShoppingCart, customerOnly: true },
  // Addresses are a customer (shipping) feature; operators don't need them.
  { href: "/direcciones", label: strings.nav.addresses, Icon: MapPin, customerOnly: true },
  // Operator menu.
  { href: "/operador", label: strings.nav.operator, Icon: Store, operatorOnly: true },
  { href: "/operador/ordenes", label: strings.nav.orders, Icon: ClipboardList, operatorOnly: true },
  { href: "/operador/productos", label: strings.nav.products, Icon: Package, operatorOnly: true },
  { href: "/operador/categorias", label: strings.nav.categories, Icon: Tags, operatorOnly: true },
];

function CartBadge() {
  const count = useCartStore(selectCartCount);

  if (count === 0) return null;

  return (
    <span
      aria-label={`${count} productos en el carrito`}
      className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white ring-2 ring-card"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function BottomNav({ isOperator }: { isOperator: boolean }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => {
    if (item.operatorOnly) return isOperator;
    if (item.customerOnly) return !isOperator;
    return true;
  });

  // Highlight the single best match: the longest href that prefixes the path,
  // so /operador/ordenes activates "Órdenes" rather than the "/operador" root.
  const activeHref = items
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card"
    >
      <ul className="flex" role="list">
        {items.map(({ href, label, Icon }) => {
          const isActive = href === activeHref;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                  isActive ? "text-primary-700" : "text-muted hover:text-ink"
                }`}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-primary-600"
                  />
                )}
                <span className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.25 : 2} />
                  {href === "/carrito" && <CartBadge />}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function TopBar({ userName }: { userName: string }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border bg-card/95 px-4 py-2 shadow-soft backdrop-blur">
      <Wordmark />
      <UserChip userName={userName} />
    </header>
  );
}

interface MobileShellProps {
  children: ReactNode;
  isOperator?: boolean;
  userName?: string | null;
}

export function MobileShell({
  children,
  isOperator = false,
  userName = null,
}: MobileShellProps) {
  // Unauthenticated users only see the login screen — no top bar or bottom nav.
  const isAuthenticated = Boolean(userName);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col">
        {isAuthenticated && <TopBar userName={userName!} />}
        <main className={`flex-1 ${isAuthenticated ? "pb-[56px]" : ""}`}>{children}</main>
      </div>
      {isAuthenticated && <BottomNav isOperator={isOperator} />}
      <InstallButton />
      <StoreHydrator />
    </div>
  );
}
