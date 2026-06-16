"use client";

import type { ButtonHTMLAttributes } from "react";

import { Spinner } from "@/components/atoms/Spinner";

type Variant = "primary" | "soft" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  // Solid fill — reserved for the primary screen CTA (checkout, complete order).
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-700 focus-visible:ring-primary-500",
  // Tonal fill — calmer alternative for repeated / secondary actions.
  soft:
    "border border-primary-100 bg-primary-50 text-primary-700 hover:bg-primary-100 active:scale-95 focus-visible:ring-primary-500",
  secondary:
    "bg-primary-50 text-primary-700 hover:bg-primary-100 active:bg-primary-100 focus-visible:ring-primary-500",
  outline:
    "border border-primary-600 text-primary-700 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500",
  ghost:
    "text-muted hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500",
  danger:
    "bg-danger text-white hover:bg-danger/90 active:bg-danger/90 focus-visible:ring-danger",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-sm min-h-[44px]",
  md: "px-4 py-2.5 text-base min-h-[44px]",
  lg: "px-6 py-3 text-lg min-h-[44px]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled ?? loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
