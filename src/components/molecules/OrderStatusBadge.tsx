import { Badge } from "@/components/atoms/Badge";
import { strings } from "@/lib/strings";
import type { OrderStatus } from "@/repositories/order.repo";

// Maps each order status to its semantic badge color.
const STATUS_VARIANT: Record<OrderStatus, "warning" | "info" | "success" | "danger"> = {
  PENDIENTE: "warning",
  PROCESANDO: "info",
  COMPLETADA: "success",
  CANCELADA: "danger",
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

/** Colored pill for an order status, with its Spanish label. */
export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT[status]}>{strings.orders.statusLabel[status]}</Badge>;
}
