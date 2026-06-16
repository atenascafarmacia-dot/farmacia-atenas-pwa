"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { strings } from "@/lib/strings";

interface QrScannerProps {
  /** Called with the parsed order code once a valid QR is detected. */
  onResult: (code: string) => void;
  onClose: () => void;
}

type ScanState = "starting" | "scanning" | "unsupported" | "denied" | "error";

/**
 * Pulls the order code out of a scanned QR. The QR encodes the operator URL
 * (`/operador?code=FARM-XXXXX`), but we also accept a bare code as a fallback.
 */
function extractCode(raw: string): string | null {
  const value = raw.trim();

  // Absolute URL → read ?code=
  try {
    const fromUrl = new URL(value).searchParams.get("code");
    if (fromUrl) return fromUrl.toUpperCase();
  } catch {
    // not an absolute URL — fall through
  }

  // Relative URL or raw query string with code=
  const match = value.match(/[?&]code=([^&]+)/i);
  if (match?.[1]) return decodeURIComponent(match[1]).toUpperCase();

  // The QR is the code itself, e.g. "FARM-7K9Q2"
  if (/^FARM-[0-9A-Z]+$/i.test(value)) return value.toUpperCase();

  return null;
}

const ERROR_MESSAGE: Partial<Record<ScanState, string>> = {
  unsupported: strings.operator.scanUnsupported,
  denied: strings.operator.scanPermissionDenied,
  error: strings.operator.scanError,
};

/**
 * Full-screen QR scanner overlay for the operator. Uses the native
 * BarcodeDetector API + the device camera; degrades to a clear message when the
 * browser lacks support or camera permission is denied (manual entry still works).
 */
export function QrScanner({ onResult, onClose }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<ScanState>("starting");

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;
    let timer: number | undefined;

    function stop() {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    }

    async function start() {
      const Detector = window.BarcodeDetector;
      if (!Detector || !navigator.mediaDevices?.getUserMedia) {
        setState("unsupported");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      } catch (error) {
        const denied = error instanceof DOMException && error.name === "NotAllowedError";
        setState(denied ? "denied" : "error");
        return;
      }

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const video = videoRef.current;
      const detector = new Detector({ formats: ["qr_code"] });
      if (video) {
        video.srcObject = stream;
        await video.play().catch(() => {});
      }
      setState("scanning");

      const loop = async () => {
        if (cancelled || !video) return;
        try {
          const codes = await detector.detect(video);
          for (const barcode of codes) {
            const code = extractCode(barcode.rawValue);
            if (code) {
              stop();
              onResult(code);
              return;
            }
          }
        } catch {
          // Transient per-frame decode errors are expected; keep scanning.
        }
        if (!cancelled) timer = window.setTimeout(loop, 250);
      };
      timer = window.setTimeout(loop, 250);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    void start();

    return () => {
      stop();
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onResult]);

  const errorMessage = ERROR_MESSAGE[state];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={strings.operator.scanTitle}
      className="fixed inset-0 z-[70] flex flex-col bg-ink"
    >
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Top bar: title + close */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-4 pt-4">
        <h2 className="text-base font-semibold text-white drop-shadow">
          {strings.operator.scanTitle}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={strings.common.close}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink/50 text-white backdrop-blur transition-colors hover:bg-ink/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={22} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      {/* Scanning viewfinder + instruction */}
      {state === "scanning" && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6">
          <div className="aspect-square w-3/4 max-w-[260px] rounded-3xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(22,32,28,0.45)]" />
          <p className="text-center text-sm font-medium text-white drop-shadow">
            {strings.operator.scanInstruction}
          </p>
        </div>
      )}

      {/* Error / unsupported states */}
      {errorMessage && (
        <div className="relative z-10 flex flex-1 items-center justify-center px-6">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-card p-6 text-center shadow-2xl">
            <p role="alert" className="text-sm leading-relaxed text-ink">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {strings.common.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
