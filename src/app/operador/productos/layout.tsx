import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUser, isOperator } from "@/services/session.service";

/**
 * Gates the whole product-management area to the configured operator.
 * NOTE: this is the same lightweight gate as /operador; see README — in
 * production this must be protected by real authentication/authorization.
 */
export default async function ProductsManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || !isOperator(user)) notFound();
  return <>{children}</>;
}
