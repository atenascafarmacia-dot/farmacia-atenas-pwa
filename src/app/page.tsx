import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { IdentifyForm } from "@/components/organisms/IdentifyForm";
import { getCurrentUser } from "@/services/session.service";

export const metadata: Metadata = {
  title: "Farmacia — Bienvenido",
};

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/catalogo");

  return (
    <div className="flex min-h-[calc(100svh-56px)] flex-col items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <div
            aria-hidden="true"
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-600 shadow-lg"
          >
            <span className="text-4xl">💊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              Bienvenido a Farmacia
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Ingresa tu nombre y teléfono para continuar.
            </p>
          </div>
        </header>

        <IdentifyForm />
      </div>
    </div>
  );
}
