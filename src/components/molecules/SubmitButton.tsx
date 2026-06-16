"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/atoms/Button";

interface SubmitButtonProps {
  label: string;
  pendingLabel: string;
  className?: string;
}

/** Solid submit button wired to the parent form's pending state. */
export function SubmitButton({ label, pendingLabel, className = "" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" loading={pending} className={className}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
