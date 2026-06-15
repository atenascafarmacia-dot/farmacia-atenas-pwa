"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { strings } from "@/lib/strings";

interface OperatorSearchProps {
  initialCode: string;
}

/** Lets the operator type an order code and look it up via the URL. */
export function OperatorSearch({ initialCode }: OperatorSearchProps) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();
    startTransition(() => {
      router.push(trimmed ? `/operador?code=${encodeURIComponent(trimmed)}` : "/operador");
    });
  }

  return (
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
      <Button type="submit" loading={isPending}>
        {strings.operator.searchButton}
      </Button>
    </form>
  );
}
