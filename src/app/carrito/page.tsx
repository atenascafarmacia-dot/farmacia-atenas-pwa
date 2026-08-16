import type { Metadata } from "next";

import { CartList } from "@/components/organisms/CartList";
import { getStockMap } from "@/services/product.service";

export const metadata: Metadata = {
  title: "Farmacia — Carrito",
};

export default async function CarritoPage() {
  const stockById = await getStockMap();

  return (
    <section className="flex flex-col px-4 pb-6 pt-4">
      <h1 className="mb-4 text-xl font-bold text-ink">Carrito</h1>
      <CartList stockById={stockById} />
    </section>
  );
}
