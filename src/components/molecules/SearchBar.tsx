"use client";

import { Search, X } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import { strings } from "@/lib/strings";

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  defaultValue = "",
  placeholder = "Buscar productos...",
  className = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={`relative ${className}`}>
      {/* Search icon doubles as the submit button, inside the field. */}
      <button
        type="submit"
        aria-label={strings.common.search}
        className="absolute left-1 top-1/2 flex h-11 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <Search size={18} aria-hidden="true" />
      </button>

      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={strings.common.search}
        className="min-h-[44px] w-full rounded-xl border border-border bg-card pl-11 pr-11 text-base text-ink placeholder:text-muted/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 [&::-webkit-search-cancel-button]:hidden"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={strings.common.close}
          className="absolute right-1 top-1/2 flex h-11 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
