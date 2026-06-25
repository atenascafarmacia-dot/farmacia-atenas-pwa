import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { updateAddressAction } from "@/app/_actions/address.action";
import { BackButton } from "@/components/molecules/BackButton";
import { AddressForm } from "@/components/organisms/AddressForm";
import { strings } from "@/lib/strings";
import { getUserAddress } from "@/services/address.service";
import { getCurrentUser } from "@/services/session.service";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: `${strings.addresses.form.editTitle} — ${strings.brand.name}`,
};

export default async function EditAddressPage({ params }: { params: Params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const { id } = await params;
  const address = await getUserAddress(id, user.id);
  if (!address) notFound();

  // Bind the address id so the form action keeps the (prev, formData) shape.
  const action = updateAddressAction.bind(null, id);

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-bold text-ink">{strings.addresses.form.editTitle}</h1>
      </header>

      <AddressForm action={action} address={address} />
    </section>
  );
}
