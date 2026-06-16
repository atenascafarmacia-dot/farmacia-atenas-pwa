import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUser, isOperator } from "@/services/session.service";

/**
 * Gates the whole orders area to the configured operator — the same lightweight
 * gate as /operador and the product-management area (see README: production
 * must replace this with real authentication/authorization).
 */
export default async function OperatorOrdersLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user || !isOperator(user)) notFound();
  return <>{children}</>;
}
