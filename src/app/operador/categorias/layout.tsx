import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUser, isOperator } from "@/services/session.service";

/**
 * Gates the whole category-management area to operators — the same lightweight
 * gate as /operador and the product-management area (see README: production
 * must replace this with real authentication/authorization).
 */
export default async function CategoriesManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || !isOperator(user)) notFound();
  return <>{children}</>;
}
