"use client";

import { ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { QrScanner } from "@/components/organisms/QrScanner";
import { strings } from "@/lib/strings";

interface OperatorSearchProps {
  initialCode: string;
}

/** Lets the operator type an order code or scan its QR, then look it up via the URL. */
export function OperatorSearch({ initialCode }: OperatorSearchProps) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function lookup(value: string) {
    const trimmed = value.trim().toUpperCase();
    startTransition(() => {
      router.push(trimmed ? `/operador?code=${encodeURIComponent(trimmed)}` : "/operador");
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    lookup(code);
  }

  function handleScan(scanned: string) {
    setScannerOpen(false);
    setCode(scanned);
    lookup(scanned);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={strings.operator.codeLabel}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={strings.operator.codePlaceholder}
            autoCapitalize="characters"
            autoComplete="off"
            className="font-mono uppercase tracking-widest"
          />
        </div>
        <Button
          type="button"
          variant="soft"
          onClick={() => setScannerOpen(true)}
          aria-label={strings.operator.scanButton}
        >
          <ScanLine size={20} strokeWidth={2} aria-hidden="true" />
        </Button>
        <Button type="submit" loading={isPending}>
          {strings.operator.searchButton}
        </Button>
      </form>

      {scannerOpen && (
        <QrScanner onResult={handleScan} onClose={() => setScannerOpen(false)} />
      )}
    </>
  );
}
