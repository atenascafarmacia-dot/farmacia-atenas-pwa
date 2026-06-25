import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Wordmark } from "@/components/atoms/Wordmark";
import { IdentifyForm } from "@/components/organisms/IdentifyForm";
import { strings } from "@/lib/strings";
import { getCurrentUser, isOperator } from "@/services/session.service";

export const metadata: Metadata = {
  title: `${strings.brand.name} — Bienvenido`,
};

export default async function HomePage() {
  const user = await getCurrentUser();
  // Operators land on their dashboard; customers on the catalog.
  if (user) redirect(isOperator(user) ? "/operador" : "/catalogo");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <Wordmark size={104} className="shadow-soft" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Bienvenido a {strings.brand.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Ingresa tu nombre y teléfono para continuar.
            </p>
          </div>
        </header>

        <IdentifyForm />
      </div>
    </div>
  );
}
