"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { IconName } from "@/components/atoms/Icon";
import { Icon } from "@/components/atoms/Icon";
import { StoreHydrator } from "@/components/atoms/StoreHydrator";
import { Wordmark } from "@/components/atoms/Wordmark";
import { UserChip } from "@/components/molecules/UserChip";
import { strings } from "@/lib/strings";
import { selectCartCount, useCartStore } from "@/store/cart";

type NavItem = { href: string; label: string; icon: IconName; operatorOnly?: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: "/catalogo", label: strings.nav.catalog, icon: "catalog" },
  { href: "/carrito", label: strings.nav.cart, icon: "cart" },
  { href: "/operador", label: strings.nav.operator, icon: "operator", operatorOnly: true },
];

function CartBadge() {
  const count = useCartStore(selectCartCount);

  if (count === 0) return null;

  return (
    <span
      aria-label={`${count} productos en el carrito`}
      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function BottomNav({ isOperator }: { isOperator: boolean }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.operatorOnly || isOperator);

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-zinc-200 bg-white"
    >
      <ul className="flex" role="list">
        {items.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                  isActive ? "text-green-600" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <span className="relative">
                  <Icon name={icon} size={22} />
                  {icon === "cart" && <CartBadge />}
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
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col">
        {userName && <TopBar userName={userName} />}
        <main className="flex-1 pb-[56px]">{children}</main>
      </div>
      <BottomNav isOperator={isOperator} />
      <StoreHydrator />
    </div>
  );
}
