import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BackButton } from "@/components/molecules/BackButton";
import { CheckoutForm } from "@/components/organisms/CheckoutForm";
import { strings } from "@/lib/strings";
import { getUserAddresses } from "@/services/address.service";
import { getCurrentUser } from "@/services/session.service";

export const metadata: Metadata = {
  title: `${strings.checkout.title} — ${strings.brand.name}`,
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const addresses = await getUserAddresses(user.id);

  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-xl font-bold text-ink">{strings.checkout.title}</h1>
          <p className="mt-0.5 text-sm text-muted">{strings.checkout.subtitle}</p>
        </div>
      </header>

      <CheckoutForm addresses={addresses} />
    </section>
  );
}
