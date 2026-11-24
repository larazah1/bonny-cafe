"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { pick } from "@/i18n/pick";
import { formatSAR } from "@/lib/currency";
import { BRANCHES } from "@/lib/branches";
import { CATEGORIES } from "@/lib/menu";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminData } from "@/context/AdminDataContext";
import { useOrders } from "@/context/OrdersContext";
import { useStaffAuth, StoredStaff } from "@/context/StaffAuthContext";
import { useRental, RooftopRequest } from "@/context/RentalContext";
import { useToast } from "@/context/ToastContext";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { ImageUploadField } from "@/components/ImageUploadField";
import { BranchId, ProductCategory } from "@/lib/types";
import { sanitizeImagePath } from "@/lib/validate";

type Tab = "overview" | "orders" | "menu" | "branches" | "staff" | "rooftop" | "announcement";

export default function AdminDashboardPage() {
  const { locale, dict } = useLocale();
  const { admin } = useAdminAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!admin) router.replace("/admin");
  }, [admin, router]);

  if (!admin) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: dict.admin.tabOverview },
    { id: "orders", label: dict.admin.tabOrders },
    { id: "menu", label: dict.admin.tabMenu },
    { id: "branches", label: dict.admin.tabBranches },
    { id: "staff", label: dict.admin.tabStaff },
    { id: "rooftop", label: dict.admin.tabRooftop },
    { id: "announcement", label: dict.admin.tabAnnouncement },
  ];

  return (
    <div className="container-page max-w-6xl py-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-heading sm:text-3xl">
          {dict.admin.dashboardTitle}
        </h1>
        <div className="flex gap-2">
          <Link
            href="/admin/profile"
            className="focus-ring rounded-full border border-line px-4 py-2 text-xs font-semibold text-body hover:border-brown-400"
          >
            {dict.admin.profileLink}
          </Link>
        </div>
      </div>

      <div className="scrollbar-none mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
              tab === t.id ? "border-primary bg-primary text-on-primary" : "border-line text-body"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && <OverviewTab locale={locale} dict={dict} />}
        {tab === "orders" && <OrdersTab locale={locale} dict={dict} />}
        {tab === "menu" && <MenuTab locale={locale} dict={dict} />}
        {tab === "branches" && <BranchesTab locale={locale} dict={dict} />}
        {tab === "staff" && <StaffTab dict={dict} />}
        {tab === "rooftop" && <RooftopTab dict={dict} />}
        {tab === "announcement" && <AnnouncementTab dict={dict} />}
      </div>
    </div>
  );
}

// ---------------- Overview ----------------
function OverviewTab({ locale, dict }: { locale: "en" | "ar"; dict: import("@/i18n/en").Dictionary }) {
  const { orders } = useOrders();

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const active = orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length;

    const itemCounts = new Map<string, number>();
    orders.forEach((o) =>
      o.lines.forEach((l) => itemCounts.set(l.name, (itemCounts.get(l.name) ?? 0) + l.quantity))
    );
    const topItems = [...itemCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    const byBranch = BRANCHES.map((b) => ({
      branch: b,
      count: orders.filter((o) => o.branchId === b.id).length,
    }));

    return { totalRevenue, active, topItems, byBranch };
  }, [orders]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={dict.admin.totalOrders} value={String(orders.length)} />
        <StatCard label={dict.admin.totalRevenue} value={formatSAR(stats.totalRevenue)} />
        <StatCard label={dict.admin.activeOrders} value={String(stats.active)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line-soft bg-white p-5">
          <h3 className="font-semibold text-brown-900">{dict.admin.topItems}</h3>
          <ul className="mt-3 space-y-2 text-sm text-brown-600">
            {stats.topItems.length === 0 && <li className="text-subtle">—</li>}
            {stats.topItems.map(([name, qty]) => (
              <li key={name} className="flex justify-between">
                <span>{name}</span>
                <span className="font-semibold">{qty}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line-soft bg-white p-5">
          <h3 className="font-semibold text-brown-900">{dict.admin.ordersByBranch}</h3>
          <ul className="mt-3 space-y-2 text-sm text-brown-600">
            {stats.byBranch.map(({ branch, count }) => (
              <li key={branch.id} className="flex justify-between">
                <span>{pick(locale, branch.name, branch.nameAr)}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line-soft bg-white p-5">
      <p className="text-xs text-subtle">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-heading">{value}</p>
    </div>
  );
}

// ---------------- Orders ----------------
function OrdersTab({ locale, dict }: { locale: "en" | "ar"; dict: import("@/i18n/en").Dictionary }) {
  const { orders } = useOrders();
  const [branchFilter, setBranchFilter] = useState<BranchId | "all">("all");

  const filtered = branchFilter === "all" ? orders : orders.filter((o) => o.branchId === branchFilter);

  return (
    <div>
      <select
        value={branchFilter}
        onChange={(e) => setBranchFilter(e.target.value as BranchId | "all")}
        className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-sm"
      >
        <option value="all">{dict.admin.allBranches}</option>
        {BRANCHES.map((b) => (
          <option key={b.id} value={b.id}>
            {pick(locale, b.name, b.nameAr)}
          </option>
        ))}
      </select>

      <div className="mt-5 space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-2xl border border-line-soft bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm">
                <span className="font-semibold text-heading">#{o.id}</span>
                <span className="ms-2 text-subtle">
                  {pick(
                    locale,
                    BRANCHES.find((b) => b.id === o.branchId)?.name ?? "",
                    BRANCHES.find((b) => b.id === o.branchId)?.nameAr ?? ""
                  )}
                </span>
                <span className="ms-2 text-subtle">{o.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-brown-800">{formatSAR(o.total)}</span>
                <OrderStatusBadge status={o.status} dict={dict} />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-subtle">—</p>}
      </div>
    </div>
  );
}

// ---------------- Menu ----------------
function MenuTab({ locale, dict }: { locale: "en" | "ar"; dict: import("@/i18n/en").Dictionary }) {
  const [branchId, setBranchId] = useState<BranchId>(BRANCHES[0].id);
  const [category, setCategory] = useState<ProductCategory>(CATEGORIES[0].id);
  const [showAddForm, setShowAddForm] = useState(false);
  const { productsForBranch, setProductOverride } = useAdminData();

  const products = productsForBranch(branchId).filter((p) => p.category === category);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-brown-600">
            <span className="text-xs text-subtle">{dict.admin.viewingBranch}:</span>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value as BranchId)}
              className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-sm"
            >
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {pick(locale, b.name, b.nameAr)}
                </option>
              ))}
            </select>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {locale === "ar" ? c.labelAr : c.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="focus-ring rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:bg-primary-strong"
        >
          + {dict.admin.addItem}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {products.map((p) => (
          <div
            key={p.slug}
            className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-white p-4 sm:flex-row"
          >
            <div className="w-full shrink-0 sm:w-48">
              <ImageUploadField
                value={p.image}
                onChange={(dataUrl) => setProductOverride(p.slug, branchId, { image: dataUrl })}
              />
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="font-medium text-brown-900">{pick(locale, p.name, p.nameAr)}</p>
              </div>
              <label className="block text-xs font-medium text-muted">
                {dict.admin.description}
                <input
                  defaultValue={p.description}
                  onBlur={(e) => setProductOverride(p.slug, branchId, { description: e.target.value })}
                  className="focus-ring mt-1 w-full rounded-lg border border-line px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block text-xs font-medium text-muted">
                {dict.admin.price}
                <input
                  type="number"
                  defaultValue={p.price}
                  onBlur={(e) => setProductOverride(p.slug, branchId, { price: Number(e.target.value) })}
                  className="focus-ring mt-1 w-28 rounded-lg border border-line px-2 py-1.5 text-sm"
                />
              </label>
              <label className="block text-xs font-medium text-muted">
                {dict.admin.prepTimeLabel}
                <input
                  type="number"
                  min={1}
                  defaultValue={p.prepTimeMinutes}
                  onBlur={(e) =>
                    setProductOverride(p.slug, branchId, { prepTimeMinutes: Number(e.target.value) })
                  }
                  className="focus-ring mt-1 w-28 rounded-lg border border-line px-2 py-1.5 text-sm"
                />
              </label>
              <div className="flex items-end">
                <button
                  onClick={() => setProductOverride(p.slug, branchId, { available: !p.available })}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    p.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.available ? dict.admin.available : dict.admin.unavailable}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <AddItemModal locale={locale} dict={dict} onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}

function AddItemModal({
  locale,
  dict,
  onClose,
}: {
  locale: "en" | "ar";
  dict: import("@/i18n/en").Dictionary;
  onClose: () => void;
}) {
  const { addCustomProduct } = useAdminData();
  const { show } = useToast();
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<ProductCategory>(CATEGORIES[0].id);
  const [branches, setBranches] = useState<BranchId[]>([]);

  const toggleBranch = (id: BranchId) => {
    setBranches((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  const submit = () => {
    if (!name.trim() || branches.length === 0) {
      show(dict.admin.addItemPickBranch, "error");
      return;
    }
    addCustomProduct({
      name: name.trim(),
      nameAr: nameAr.trim(),
      description: description.trim(),
      image: sanitizeImagePath(image),
      price: Math.max(0, price),
      category,
      branches,
    });
    show(dict.admin.addItemSuccess, "success");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-primary-deep/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-heading">{dict.admin.addItem}</h3>
          <button
            onClick={onClose}
            aria-label={dict.common.close}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-tint-strong"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            placeholder={dict.admin.addItemNameEn}
            dir="ltr"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm"
          />
          <input
            placeholder={dict.admin.addItemNameAr}
            dir="rtl"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {locale === "ar" ? c.labelAr : c.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder={dict.admin.price}
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm"
          />
          <div className="sm:col-span-2">
            <ImageUploadField value={image} onChange={setImage} />
          </div>
          <input
            placeholder={dict.admin.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm sm:col-span-2"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-brown-600">
          <span className="text-xs text-subtle">{dict.admin.addItemVisibleIn}:</span>
          {BRANCHES.map((b) => (
            <label key={b.id} className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={branches.includes(b.id)}
                onChange={() => toggleBranch(b.id)}
                className="h-4 w-4 accent-primary"
              />
              {pick(locale, b.name, b.nameAr)}
            </label>
          ))}
        </div>

        <button
          onClick={submit}
          className="focus-ring mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-on-primary hover:bg-primary-strong"
        >
          {dict.admin.addItemSubmit}
        </button>
      </div>
    </div>
  );
}

// ---------------- Branches ----------------
function BranchesTab({ locale, dict }: { locale: "en" | "ar"; dict: import("@/i18n/en").Dictionary }) {
  const {
    getBranchDisplay,
    setBranchOverride,
    orderRadiusMinutes,
    setOrderRadiusMinutes,
    requireLocationCheck,
    setRequireLocationCheck,
  } = useAdminData();
  const { show } = useToast();
  const [radius, setRadius] = useState(orderRadiusMinutes);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line-soft bg-white p-5">
        <label className="block text-sm font-medium text-body">
          {dict.admin.radiusLabel}
          <input
            type="number"
            min={1}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="focus-ring mt-1.5 w-32 rounded-lg border border-line px-2 py-1.5"
          />
        </label>
        <button
          onClick={() => {
            setOrderRadiusMinutes(radius);
            show(dict.admin.radiusSaved, "success");
          }}
          className="focus-ring mt-3 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-on-primary hover:bg-primary-strong"
        >
          {dict.admin.radiusSave}
        </button>

        <div className="mt-5 border-t border-line-soft pt-4">
          <label className="flex items-start gap-2.5 text-sm font-medium text-body">
            <input
              type="checkbox"
              checked={requireLocationCheck}
              onChange={(e) => setRequireLocationCheck(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            {dict.admin.requireLocationLabel}
          </label>
          <p className="mt-1.5 text-xs text-subtle">{dict.admin.requireLocationHint}</p>
        </div>
      </div>

      {BRANCHES.map((base) => (
        <BranchEditCard
          key={base.id}
          branchId={base.id}
          locale={locale}
          dict={dict}
          getBranchDisplay={getBranchDisplay}
          setBranchOverride={setBranchOverride}
        />
      ))}
    </div>
  );
}

function BranchEditCard({
  branchId,
  locale,
  dict,
  getBranchDisplay,
  setBranchOverride,
}: {
  branchId: BranchId;
  locale: "en" | "ar";
  dict: import("@/i18n/en").Dictionary;
  getBranchDisplay: ReturnType<typeof useAdminData>["getBranchDisplay"];
  setBranchOverride: ReturnType<typeof useAdminData>["setBranchOverride"];
}) {
  const branch = getBranchDisplay(branchId);
  const { show } = useToast();
  const [phone, setPhone] = useState(branch.phone);
  const [address, setAddress] = useState(branch.address);
  const [lat, setLat] = useState(String(branch.lat));
  const [lng, setLng] = useState(String(branch.lng));
  const [hoursText, setHoursText] = useState(
    branch.hours.map((h) => `${h.day}: ${h.hours}`).join("\n")
  );

  const save = () => {
    const hours = hoursText
      .split("\n")
      .map((line) => line.split(":"))
      .filter((parts) => parts.length >= 2)
      .map(([day, ...rest]) => ({ day: day.trim(), hours: rest.join(":").trim() }));
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    setBranchOverride(branchId, {
      phone,
      hours,
      address,
      ...(Number.isFinite(parsedLat) ? { lat: parsedLat } : {}),
      ...(Number.isFinite(parsedLng) ? { lng: parsedLng } : {}),
    });
    show(dict.admin.branchSaved, "success");
  };

  return (
    <div className="rounded-2xl border border-line-soft bg-white p-5">
      <h3 className="font-semibold text-brown-900">{pick(locale, branch.name, branch.nameAr)}</h3>
      <label className="mt-3 block text-sm font-medium text-body">
        {dict.admin.phoneLabel}
        <input
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="focus-ring mt-1.5 w-full rounded-lg border border-line px-3 py-2"
        />
      </label>
      <label className="mt-3 block text-sm font-medium text-body">
        {dict.admin.hoursLabel}
        <textarea
          rows={3}
          value={hoursText}
          onChange={(e) => setHoursText(e.target.value)}
          className="focus-ring mt-1.5 w-full resize-none rounded-lg border border-line px-3 py-2 font-mono text-xs"
        />
      </label>
      <label className="mt-3 block text-sm font-medium text-body">
        {dict.admin.addressLabel}
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="focus-ring mt-1.5 w-full rounded-lg border border-line px-3 py-2"
        />
      </label>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium text-body">
          {dict.admin.latLabel}
          <input
            dir="ltr"
            inputMode="decimal"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-body">
          {dict.admin.lngLabel}
          <input
            dir="ltr"
            inputMode="decimal"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>
      <p className="mt-1.5 text-xs text-subtle">{dict.admin.locationHint}</p>
      <button
        onClick={save}
        className="focus-ring mt-3 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-on-primary hover:bg-primary-strong"
      >
        {dict.admin.branchSave}
      </button>
    </div>
  );
}

// ---------------- Staff ----------------
function StaffTab({ dict }: { dict: import("@/i18n/en").Dictionary }) {
  const { staffAccounts, addStaff, removeStaff } = useStaffAuth();
  const [form, setForm] = useState<StoredStaff>({
    username: "",
    password: "",
    name: "",
    branchId: BRANCHES[0].id,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line-soft bg-white p-5">
        <h3 className="font-semibold text-brown-900">{dict.admin.staffList}</h3>
        <ul className="mt-3 divide-y divide-brown-50">
          {staffAccounts.map((s) => (
            <li key={s.username} className="flex items-center justify-between py-2 text-sm">
              <span>
                <span className="font-medium text-brown-900">{s.name}</span>
                <span className="ms-2 text-subtle" dir="ltr">
                  ({s.username})
                </span>
              </span>
              <button
                onClick={() => removeStaff(s.username)}
                className="text-xs font-semibold text-red-700 hover:underline"
              >
                {dict.admin.remove}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-line-soft bg-white p-5">
        <h3 className="font-semibold text-brown-900">{dict.admin.addStaff}</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            placeholder={dict.admin.staffName}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm"
          />
          <select
            value={form.branchId}
            onChange={(e) => setForm({ ...form, branchId: e.target.value as BranchId })}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm"
          >
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <input
            dir="ltr"
            placeholder={dict.admin.staffUsername}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm"
          />
          <input
            dir="ltr"
            placeholder={dict.admin.staffPassword}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="focus-ring rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={() => {
            if (!form.username || !form.password || !form.name) return;
            addStaff(form);
            setForm({ username: "", password: "", name: "", branchId: BRANCHES[0].id });
          }}
          className="focus-ring mt-3 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-on-primary hover:bg-primary-strong"
        >
          {dict.admin.addStaffSubmit}
        </button>
      </div>
    </div>
  );
}

// ---------------- Rooftop ----------------
function RooftopTab({ dict }: { dict: import("@/i18n/en").Dictionary }) {
  const { requests, updateStatus } = useRental();

  if (requests.length === 0) return <p className="text-subtle">{dict.admin.rooftopEmpty}</p>;

  const statusLabel: Record<string, string> = {
    new: dict.admin.rooftopStatusNew,
    contacted: dict.admin.rooftopStatusContacted,
    confirmed: dict.admin.rooftopStatusConfirmed,
    declined: dict.admin.rooftopStatusDeclined,
  };
  const statusColor: Record<string, string> = {
    new: "bg-tint-strong text-body",
    contacted: "bg-blue-100 text-blue-700",
    confirmed: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-3">
      {requests.map((r) => {
        const actions: { status: RooftopRequest["status"]; label: string; activeClass: string }[] = [
          { status: "contacted", label: dict.admin.rooftopMarkContacted, activeClass: "bg-blue-600 text-white border-blue-600" },
          { status: "confirmed", label: dict.admin.rooftopMarkConfirmed, activeClass: "bg-green-600 text-white border-green-600" },
          { status: "declined", label: dict.admin.rooftopMarkDeclined, activeClass: "bg-red-600 text-white border-red-600" },
        ];
        return (
          <div key={r.id} className="rounded-2xl border border-line-soft bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm">
                <span className="font-semibold text-heading">{r.name}</span>
                <span className="ms-2 text-subtle" dir="ltr">
                  {r.phone}
                </span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[r.status]}`}>
                {statusLabel[r.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-brown-600">
              {r.eventType} · {r.guests} guests · {r.date} · {r.timeSlot}
            </p>
            {r.notes && <p className="mt-1 text-xs text-subtle">{r.notes}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {actions.map((a) => {
                const isActive = r.status === a.status;
                return (
                  <button
                    key={a.status}
                    onClick={() => updateStatus(r.id, a.status)}
                    className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive ? a.activeClass : "border-line text-body hover:border-brown-400"
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------- Announcement ----------------
function AnnouncementTab({ dict }: { dict: import("@/i18n/en").Dictionary }) {
  const { announcement, setAnnouncement } = useAdminData();
  const { show } = useToast();
  const [en, setEn] = useState(announcement.en);
  const [ar, setAr] = useState(announcement.ar);

  return (
    <div className="rounded-2xl border border-line-soft bg-white p-5">
      <h3 className="font-semibold text-brown-900">{dict.admin.announcementLabel}</h3>
      <p className="mt-1 text-xs text-subtle">{dict.admin.announcementHint}</p>

      <label className="mt-4 block text-sm font-medium text-body">
        {dict.admin.announcementLabelEn}
        <textarea
          dir="ltr"
          rows={2}
          value={en}
          onChange={(e) => setEn(e.target.value)}
          className="focus-ring mt-1.5 w-full resize-none rounded-lg border border-line px-3 py-2 text-sm"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-body">
        {dict.admin.announcementLabelAr}
        <textarea
          dir="rtl"
          rows={2}
          value={ar}
          onChange={(e) => setAr(e.target.value)}
          className="focus-ring mt-1.5 w-full resize-none rounded-lg border border-line px-3 py-2 text-sm"
        />
      </label>

      <button
        onClick={() => {
          setAnnouncement({ en, ar });
          show(dict.admin.announcementSaved, "success");
        }}
        className="focus-ring mt-4 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-on-primary hover:bg-primary-strong"
      >
        {dict.admin.announcementSave}
      </button>
    </div>
  );
}
