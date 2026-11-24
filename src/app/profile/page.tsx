"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { formatSAR } from "@/lib/currency";
import { getBranch } from "@/lib/branches";
import { findProduct } from "@/lib/menu";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useCart } from "@/context/CartContext";
import { useBranch } from "@/context/BranchContext";
import { useToast } from "@/context/ToastContext";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Field, inputClass } from "@/components/FormField";
import { Order } from "@/lib/types";

export default function ProfilePage() {
  const { locale, dict } = useLocale();
  const { customer, updateProfile, logout } = useCustomerAuth();
  const { ordersForCustomer, cancelOrder } = useOrders();
  const { addItem } = useCart();
  const { branchId, setBranchId } = useBranch();
  const { show } = useToast();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(customer?.fullName ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");

  if (!customer) {
    return (
      <div className="container-page max-w-md py-spacious text-center">
        <h1 className="font-display text-2xl font-semibold text-heading">{dict.profile.title}</h1>
        <p className="mt-3 text-muted">{dict.profile.loginPrompt}</p>
        <Link
          href="/login?next=/profile"
          className="focus-ring mt-6 inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold text-on-primary hover:bg-primary-strong"
        >
          {dict.nav.login}
        </Link>
      </div>
    );
  }

  const orders = ordersForCustomer(customer.mobile);

  const handleSaveInfo = () => {
    updateProfile({ fullName: fullName.trim(), email: email.trim() });
    setEditing(false);
    show(dict.profile.savedInfo, "success");
  };

  const handleReorder = (order: Order) => {
    if (order.branchId !== branchId) setBranchId(order.branchId);
    order.lines.forEach((line) => {
      const product = findProduct(order.branchId, line.slug);
      if (!product) return;
      addItem(product, line.quantity, line.note);
    });
    show(dict.orders.reordered, "success");
  };

  const handleCancel = (id: string) => {
    if (!window.confirm(dict.orders.cancelConfirm)) return;
    const ok = cancelOrder(id);
    if (ok) show(dict.orders.cancelled, "success");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="container-page max-w-3xl py-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-heading">{dict.profile.title}</h1>
        <button
          onClick={handleLogout}
          className="focus-ring rounded-full border border-line px-4 py-2 text-xs font-semibold text-body hover:border-brown-400"
        >
          {dict.nav.logout}
        </button>
      </div>

      {/* Account info */}
      <div className="mt-8 rounded-2xl border border-line-soft bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-brown-900">{dict.profile.accountTitle}</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="focus-ring rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-body hover:border-brown-400"
            >
              {dict.profile.edit}
            </button>
          )}
        </div>

        {editing ? (
          <div className="mt-4 space-y-4">
            <Field label={dict.auth.fullNameLabel}>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
            </Field>
            <Field label={dict.auth.emailLabel}>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="flex gap-2">
              <button
                onClick={handleSaveInfo}
                className="focus-ring rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:bg-primary-strong"
              >
                {dict.profile.saveInfo}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFullName(customer.fullName);
                  setEmail(customer.email);
                }}
                className="focus-ring rounded-full border border-line px-5 py-2 text-sm font-semibold text-body"
              >
                {dict.common.cancel}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <span className="block text-xs text-subtle">{dict.auth.fullNameLabel}</span>
              <span className="text-brown-900">{customer.fullName}</span>
            </div>
            <div>
              <span className="block text-xs text-subtle">{dict.auth.phoneLabel}</span>
              <span className="text-brown-900" dir="ltr">
                {customer.mobile}
              </span>
            </div>
            <div>
              <span className="block text-xs text-subtle">{dict.auth.emailLabel}</span>
              <span className="text-brown-900" dir="ltr">
                {customer.email}
              </span>
            </div>
          </div>
        )}
        {!editing && <p className="mt-3 text-xs text-subtle">{dict.profile.mobileHint}</p>}
      </div>

      {/* Orders */}
      <h2 className="font-display mt-10 text-xl font-semibold text-heading">
        {dict.profile.ordersTitle}
      </h2>

      {orders.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-line-soft bg-white p-6 text-center">
          <p className="text-muted">{dict.orders.empty}</p>
          <Link
            href="/"
            className="focus-ring mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-strong"
          >
            {dict.cart.browseMenu}
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          {orders.map((o) => {
            const branch = getBranch(o.branchId);
            const canCancel = o.status === "preparing";
            return (
              <div key={o.id} className="rounded-2xl border border-line-soft bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-heading">
                      {dict.orders.orderNumber} #{o.id}
                    </p>
                    <p className="text-xs text-subtle">
                      {pick(locale, branch.name, branch.nameAr)} ·{" "}
                      {new Date(o.createdAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                    </p>
                  </div>
                  <OrderStatusBadge status={o.status} dict={dict} />
                </div>

                <ul className="mt-4 space-y-1 text-sm text-brown-600">
                  {o.lines.map((l) => (
                    <li key={l.slug} className="flex justify-between">
                      <span>
                        {l.quantity}× {l.name}
                      </span>
                      <span>{formatSAR(l.price * l.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                  <span className="text-sm font-semibold text-brown-800">
                    {dict.cart.total}: {formatSAR(o.total)}
                  </span>
                  {o.status === "preparing" && o.estimatedMinutes && (
                    <span className="text-xs text-subtle">
                      {dict.orders.estMinutes}: {o.estimatedMinutes} {dict.orders.minutes}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleReorder(o)}
                    className="focus-ring rounded-full border border-line px-4 py-2 text-xs font-semibold text-body hover:border-brown-400"
                  >
                    {dict.orders.reorder}
                  </button>
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(o.id)}
                      className="focus-ring rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:border-red-400"
                    >
                      {dict.orders.cancel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
