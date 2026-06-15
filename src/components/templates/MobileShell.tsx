"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { IconName } from "@/components/atoms/Icon";
import { Icon } from "@/components/atoms/Icon";
import { strings } from "@/lib/strings";

const NAV_ITEMS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/", label: strings.nav.catalog, icon: "catalog" },
  { href: "/carrito", label: strings.nav.cart, icon: "cart" },
  { href: "/operador", label: strings.nav.operator, icon: "operator" },
];

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-zinc-200 bg-white"
    >
      <ul className="flex" role="list">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                  isActive ? "text-green-600" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <Icon name={icon} size={22} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface MobileShellProps {
  children: ReactNode;
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col">
        <main className="flex-1 pb-[56px]">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
