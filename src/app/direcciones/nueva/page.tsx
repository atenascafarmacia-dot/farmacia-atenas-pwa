import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createAddressAction } from "@/app/_actions/address.action";
import { BackButton } from "@/components/molecules/BackButton";
import { AddressForm } from "@/components/organisms/AddressForm";
import { strings } from "@/lib/strings";
import { getCurrentUser } from "@/services/session.service";

export const metadata: Metadata = {
  title: `${strings.addresses.form.newTitle} — ${strings.brand.name}`,
};

export default async function NewAddressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-bold text-ink">{strings.addresses.form.newTitle}</h1>
      </header>

      <AddressForm action={createAddressAction} />
    </section>
  );
}
