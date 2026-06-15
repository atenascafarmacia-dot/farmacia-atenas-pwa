import { LogoutButton } from "@/components/molecules/LogoutButton";

interface UserChipProps {
  userName: string;
}

/** Compact user chip: avatar initial + first name + sign-out option. */
export function UserChip({ userName }: UserChipProps) {
  const trimmed = userName.trim();
  const initial = trimmed.charAt(0).toUpperCase() || "?";
  const firstName = trimmed.split(/\s+/)[0] ?? trimmed;

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card py-0.5 pl-0.5 pr-1 shadow-soft">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white"
      >
        {initial}
      </span>
      <span className="max-w-[5rem] truncate text-sm font-medium text-ink">
        {firstName}
      </span>
      <LogoutButton />
    </div>
  );
}
