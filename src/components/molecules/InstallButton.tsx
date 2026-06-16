"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import { strings } from "@/lib/strings";

/** The `beforeinstallprompt` event isn't in the TS DOM lib yet. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Floating "Install app" button.
 *
 * Renders nothing until the browser fires `beforeinstallprompt` (i.e. the PWA is
 * installable and not yet installed). Tapping it shows the native install prompt.
 * Hidden once the app is installed or running in standalone mode.
 */
export function InstallButton() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Already installed / launched from the home screen → never show.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari exposes this non-standard flag.
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    function onBeforeInstallPrompt(event: Event) {
      // Stop Chrome's default mini-infobar so we can trigger the prompt on demand.
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    }

    function onInstalled() {
      setPromptEvent(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!promptEvent) return null;

  async function handleInstall() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    // The prompt can only be used once; drop it either way.
    setPromptEvent(null);
  }

  return (
    // Aligned to the right edge of the mobile column, floating above the bottom nav.
    <div className="pointer-events-none fixed bottom-[68px] left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleInstall}
          aria-label={strings.pwa.installAria}
          className="pointer-events-auto inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary-600 px-4 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <Download size={18} strokeWidth={2} aria-hidden="true" />
          {strings.pwa.install}
        </button>
      </div>
    </div>
  );
}
