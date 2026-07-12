"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { formatSAR } from "@/lib/currency";
import { useCart } from "@/context/CartContext";
import { useBranch } from "@/context/BranchContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useToast } from "@/context/ToastContext";
import { useAdminData } from "@/context/AdminDataContext";
import { PickupType } from "@/lib/types";

export default function CartPage() {
  const { locale, dict } = useLocale();
  const { lines, updateQuantity, removeItem, total, pickupType, setPickupType, clear } = useCart();
  const { branch, geoStatus, requestLocation, withinOrderRadius } = useBranch();
  const { requireLocationCheck } = useAdminData();
  const { customer } = useCustomerAuth();
  const { createOrder } = useOrders();
  const { show } = useToast();
  const router = useRouter();

  const [name, setName] = useState(customer?.fullName ?? "");
  const [placing, setPlacing] = useState(false);

  // Location is checked silently in the background (no button, no gate UI).
  // The radius itself is admin-configurable (Admin Dashboard > Branches >
  // "Order radius") — to test ordering from anywhere, raise that value
  // rather than bypassing the check below.
  useEffect(() => {
    if (requireLocationCheck && geoStatus === "idle") requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requireLocationCheck, geoStatus]);

  const canPlaceOrder = lines.length > 0 && Boolean(customer) && name.trim().length > 0;

  const handlePlaceOrder = () => {
    if (!customer || !canPlaceOrder) return;
    if (requireLocationCheck && withinOrderRadius !== true) {
      show(dict.cart.tooFarToast, "error");
      return;
    }
    if (!window.confirm(dict.cart.confirmOrder.replace("{total}", formatSAR(total)))) return;
    setPlacing(true);
    createOrder({
      branchId: branch.id,
      customerName: name.trim(),
      phone: customer.mobile,
      pickupType,
      lines,
      total,
    });
    clear();
    show(dict.cart.orderPlaced, "success");
    router.push("/profile");
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-brown-950">{dict.cart.title}</h1>
        <p className="mt-3 text-brown-500">{dict.cart.empty}</p>
        <Link
          href="/"
          className="focus-ring mt-6 inline-block rounded-full bg-brown-800 px-7 py-3 text-sm font-semibold text-cream-50 hover:bg-brown-900"
        >
          {dict.cart.browseMenu}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brown-950">{dict.cart.title}</h1>
      <p className="mt-1 text-sm text-brown-500">
        {dict.cart.branchMismatchNote} {pick(locale, branch.name, branch.nameAr)}
      </p>

      <div className="mt-6 divide-y divide-brown-100 rounded-2xl border border-brown-100 bg-white">
        {lines.map((line) => (
          <div key={`${line.slug}-${line.note ?? ""}`} className="flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
              <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-brown-950">{line.name}</h3>
                <button
                  onClick={() => removeItem(line.slug)}
                  className="focus-ring text-xs font-medium text-brown-400 hover:text-red-700"
                >
                  {dict.common.cancel}
                </button>
              </div>
              {line.note && (
                <p className="mt-0.5 text-xs text-brown-400">
                  {dict.cart.note}: {line.note}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 rounded-full border border-brown-200 px-1">
                  <button
                    onClick={() => updateQuantity(line.slug, line.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-brown-800 hover:bg-brown-100"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm font-semibold">{line.quantity}</span>
                  <button
                    onClick={() => updateQuantity(line.slug, line.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-brown-800 hover:bg-brown-100"
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold text-brown-800">
                  {formatSAR(line.price * line.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pickup type */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-brown-800">{dict.cart.pickupType}</h2>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(["drive-thru", "dine-in"] as PickupType[]).map((t) => (
            <button
              key={t}
              onClick={() => setPickupType(t)}
              className={`focus-ring rounded-xl border px-4 py-3 text-start text-sm font-medium transition-colors ${
                pickupType === t
                  ? "border-brown-800 bg-brown-800 text-cream-50"
                  : "border-brown-200 text-brown-700 hover:border-brown-400"
              }`}
            >
              {t === "drive-thru" ? dict.cart.driveThru : dict.cart.dineIn}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      {customer ? (
        <label className="mt-6 block text-sm font-medium text-brown-700">
          {dict.cart.yourName}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-xl border border-brown-200 bg-white px-3.5 py-2.5 text-sm"
          />
        </label>
      ) : (
        <div className="mt-6 rounded-2xl border border-brown-100 bg-white p-4">
          <p className="text-sm text-brown-600">{dict.cart.loginRequired}</p>
          <Link
            href="/login?next=/cart"
            className="focus-ring mt-3 inline-block rounded-full bg-brown-800 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-brown-900"
          >
            {dict.cart.logInToOrder}
          </Link>
        </div>
      )}

      {/* Total + submit */}
      <div className="mt-8 flex items-center justify-between border-t border-brown-100 pt-6">
        <span className="text-lg font-semibold text-brown-950">{dict.cart.total}</span>
        <span className="text-xl font-bold text-brown-900">{formatSAR(total)}</span>
      </div>
      <button
        onClick={handlePlaceOrder}
        disabled={!canPlaceOrder || placing}
        className="focus-ring mt-4 w-full rounded-full bg-brown-800 py-3.5 text-sm font-semibold text-cream-50 hover:bg-brown-900 disabled:opacity-40"
      >
        {dict.cart.placeOrder}
      </button>
    </div>
  );
}
