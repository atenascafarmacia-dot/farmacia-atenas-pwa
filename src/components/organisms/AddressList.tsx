import Link from "next/link";

import { DeleteAddressButton } from "@/components/molecules/DeleteAddressButton";
import { strings } from "@/lib/strings";
import type { AddressDto } from "@/services/address.service";

interface AddressListProps {
  addresses: AddressDto[];
}

/** User's address book: each row links to edit and offers delete. */
export function AddressList({ addresses }: AddressListProps) {
  return (
    <ul className="flex flex-col gap-2" aria-label={strings.addresses.title}>
      {addresses.map((address) => (
        <li
          key={address.id}
          className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft"
        >
          <div className="min-w-0 flex-1">
            {address.label && (
              <h2 className="truncate text-sm font-semibold text-ink">{address.label}</h2>
            )}
            <p className="mt-0.5 text-xs text-muted">
              {address.address}, {address.city}, {address.state}
              {address.zipCode ? ` (${address.zipCode})` : ""}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/direcciones/${address.id}/editar`}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {strings.addresses.edit}
            </Link>
            <DeleteAddressButton id={address.id} name={address.label ?? address.address} />
          </div>
        </li>
      ))}
    </ul>
  );
}
