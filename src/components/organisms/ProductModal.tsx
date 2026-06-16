"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useRef } from "react";

import { PRODUCT_DETAIL_TITLE_ID } from "@/components/organisms/ProductDetail";
import { strings } from "@/lib/strings";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ProductModalProps {
  children: ReactNode;
}

/**
 * Dialog shell for the intercepted product route. Renders as a bottom-sheet,
 * closes via back navigation (Esc, backdrop), locks body scroll, and traps
 * focus while open — restoring it to the trigger on close.
 */
export function ProductModal({ children }: ProductModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Lock body scroll while the sheet is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog.
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      // Trap focus within the dialog.
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === root)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [close]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label={strings.common.close}
        onClick={close}
        className="animate-backdrop-in absolute inset-0 cursor-default bg-ink/40"
      />

      {/* Bottom sheet */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={strings.products.detail.dialogLabel}
        aria-labelledby={PRODUCT_DETAIL_TITLE_ID}
        tabIndex={-1}
        className="animate-sheet-up relative z-10 max-h-[92svh] w-full max-w-[430px] overflow-y-auto rounded-t-2xl bg-surface shadow-2xl focus:outline-none"
      >
        {/* Drag handle affordance */}
        <div className="sticky top-0 z-10 flex justify-center bg-surface pt-2 pb-1">
          <span aria-hidden="true" className="h-1.5 w-10 rounded-full bg-border" />
        </div>
        {children}
      </div>
    </div>
  );
}
