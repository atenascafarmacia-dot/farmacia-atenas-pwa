import { MapPin, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/molecules/EmptyState";
import { AddressList } from "@/components/organisms/AddressList";
import { strings } from "@/lib/strings";
import { getUserAddresses } from "@/services/address.service";
import { getCurrentUser } from "@/services/session.service";

export const metadata: Metadata = {
  title: `${strings.addresses.title} — ${strings.brand.name}`,
};

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const addresses = await getUserAddresses(user.id);

  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">{strings.addresses.title}</h1>
          <p className="mt-0.5 text-sm text-muted">{strings.addresses.subtitle}</p>
        </div>
        <Link
          href="/direcciones/nueva"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          {strings.addresses.new}
        </Link>
      </header>

      {addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-7 w-7" strokeWidth={1.5} />}
          title={strings.addresses.empty}
          message={strings.addresses.emptyHint}
          action={
            <Link
              href="/direcciones/nueva"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border px-4 text-sm font-medium text-ink transition-colors hover:bg-primary-50"
            >
              {strings.addresses.new}
            </Link>
          }
        />
      ) : (
        <AddressList addresses={addresses} />
      )}
    </section>
  );
}
