import { Dictionary } from "@/i18n/en";
import { OrderStatus } from "@/lib/types";

const COLORS: Record<OrderStatus, string> = {
  preparing: "bg-amber-100 text-amber-800",
  ready: "bg-green-100 text-green-700",
  completed: "bg-primary text-on-primary",
  cancelled: "bg-red-100 text-red-700",
};

export function statusLabel(dict: Dictionary, status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    preparing: dict.orders.statusPreparing,
    ready: dict.orders.statusReady,
    completed: dict.orders.statusCompleted,
    cancelled: dict.orders.statusCancelled,
  };
  return map[status];
}

export function OrderStatusBadge({ status, dict }: { status: OrderStatus; dict: Dictionary }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${COLORS[status]}`}>
      {statusLabel(dict, status)}
    </span>
  );
}
