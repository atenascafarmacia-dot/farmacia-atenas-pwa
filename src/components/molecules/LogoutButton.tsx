"use client";

import { useTransition } from "react";

import { logoutAction } from "@/app/_actions/session.action";
import { strings } from "@/lib/strings";
import { useCartStore } from "@/store/cart";

/** Ends the session and clears the cart so the next account starts clean. */
export function LogoutButton() {
  const clear = useCartStore((s) => s.clear);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    clear();
    startTransition(() => {
      void logoutAction();
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="min-h-[44px] rounded-full px-2.5 text-sm font-medium text-muted transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-50"
    >
      {strings.auth.signOut}
    </button>
  );
}
