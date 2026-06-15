"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Icon } from "@/components/atoms/Icon";
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
    <form onSubmit={handleSubmit} role="search" className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          <Icon name="search" size={18} />
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={strings.common.search}
          className="min-h-[44px] w-full rounded-xl border border-zinc-300 py-2.5 pl-10 pr-10 text-base placeholder:text-zinc-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={strings.common.close}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex min-h-[44px] items-center text-zinc-400 hover:text-zinc-600"
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        aria-label={strings.common.search}
        className="flex min-h-[44px] w-11 items-center justify-center rounded-xl bg-green-600 text-white transition-colors hover:bg-green-700 active:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        <Icon name="search" size={18} />
      </button>
    </form>
  );
}
