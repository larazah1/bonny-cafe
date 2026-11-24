"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { formatSAR } from "@/lib/currency";
import { useStaffAuth } from "@/context/StaffAuthContext";
import { useOrders } from "@/context/OrdersContext";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Order, OrderStatus } from "@/lib/types";

type Bucket = "preparing" | "ready" | "completed" | "cancelled" | "all";

const BUCKET_STATUSES: Record<Bucket, OrderStatus[]> = {
  preparing: ["preparing"],
  ready: ["ready"],
  completed: ["completed"],
  cancelled: ["cancelled"],
  all: ["preparing", "ready", "completed", "cancelled"],
};

// Orders are auto-accepted straight into "preparing" — staff only ever
// hand off preparing → ready and ready → completed.
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  preparing: "ready",
  ready: "completed",
};

export default function StaffDashboardPage() {
  const { locale, dict } = useLocale();
  const { staff } = useStaffAuth();
  const { ordersForBranch, updateStatus } = useOrders();
  const router = useRouter();

  const [bucket, setBucket] = useState<Bucket>("preparing");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!staff) router.replace("/staff");
  }, [staff, router]);

  const orders = useMemo(() => {
    if (!staff) return [];
    const list = ordersForBranch(staff.branchId).filter((o) =>
      BUCKET_STATUSES[bucket].includes(o.status)
    );
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter(
      (o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
    );
  }, [staff, ordersForBranch, bucket, query]);

  if (!staff) return null;

  const tabs: { id: Bucket; label: string }[] = [
    { id: "preparing", label: dict.staff.tabPreparing },
    { id: "ready", label: dict.staff.tabReady },
    { id: "completed", label: dict.staff.tabCompleted },
    { id: "cancelled", label: dict.staff.tabCancelled },
    { id: "all", label: dict.staff.tabAll },
  ];

  const actionFor = (o: Order) => {
    const next = NEXT_STATUS[o.status];
    if (!next) return null;
    const label = next === "ready" ? dict.staff.markReady : dict.staff.markCompleted;
    return (
      <button
        onClick={() => updateStatus(o.id, next)}
        className="focus-ring rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-strong"
      >
        {label}
      </button>
    );
  };

  return (
    <div className="container-page max-w-5xl py-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-heading sm:text-3xl">
            {dict.staff.dashboardTitle}
          </h1>
          <p className="mt-1 text-sm text-muted">{staff.name}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/staff/profile"
            className="focus-ring rounded-full border border-line px-4 py-2 text-xs font-semibold text-body hover:border-brown-400"
          >
            {dict.staff.profileLink}
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setBucket(t.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
                bucket === t.id
                  ? "border-primary bg-primary text-on-primary"
                  : "border-line text-body"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.staff.search}
          className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-sm sm:max-w-xs"
        />
      </div>

      {orders.length === 0 ? (
        <p className="mt-16 text-center text-subtle">{dict.staff.noOrders}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-line-soft bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-heading">#{o.id}</p>
                  <p className="text-xs text-subtle">
                    {new Date(o.createdAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                  </p>
                </div>
                <OrderStatusBadge status={o.status} dict={dict} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-brown-600 sm:grid-cols-4">
                <div>
                  <span className="block text-xs text-subtle">{dict.staff.customer}</span>
                  {o.customerName}
                </div>
                <div dir="ltr">
                  <span className="block text-xs text-subtle">{dict.staff.phone}</span>
                  {o.phone}
                </div>
                <div>
                  <span className="block text-xs text-subtle">{dict.staff.pickup}</span>
                  {o.pickupType === "drive-thru" ? dict.cart.driveThru : dict.cart.dineIn}
                </div>
                <div>
                  <span className="block text-xs text-subtle">{dict.orders.estMinutes}</span>
                  {o.estimatedMinutes} {dict.orders.minutes}
                </div>
              </div>

              <ul className="mt-3 space-y-1 border-t border-line-soft pt-3 text-sm text-brown-600">
                {o.lines.map((l) => (
                  <li key={l.slug} className="flex justify-between">
                    <span>
                      {l.quantity}× {l.name}
                      {l.note && <span className="text-subtle"> — {l.note}</span>}
                    </span>
                    <span>{formatSAR(l.price * l.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                <span className="text-sm font-semibold text-brown-800">
                  {dict.cart.total}: {formatSAR(o.total)}
                </span>
                <div className="flex gap-2">
                  {actionFor(o)}
                  {o.status !== "completed" && o.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(o.id, "cancelled")}
                      className="focus-ring rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:border-red-400"
                    >
                      {dict.staff.cancel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
