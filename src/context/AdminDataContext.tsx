"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { BRANCHES } from "@/lib/branches";
import {
  PRODUCTS,
  productsForBranch as baseProductsForBranch,
  DEFAULT_PREP_TIME_MINUTES,
} from "@/lib/menu";
import { ORDER_RADIUS_MINUTES } from "@/lib/geo";
import {
  Branch,
  BranchId,
  DayHours,
  ProductBase,
  ProductCategory,
  ResolvedProduct,
} from "@/lib/types";

interface ProductOverride {
  price?: number;
  available?: boolean;
  description?: string;
  image?: string;
  prepTimeMinutes?: number;
}

type ProductOverrides = Record<string, Partial<Record<BranchId, ProductOverride>>>;

interface BranchOverride {
  hours?: DayHours[];
  phone?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

type BranchOverrides = Partial<Record<BranchId, BranchOverride>>;

export interface Announcement {
  en: string;
  ar: string;
}

interface CustomProduct extends ProductBase {
  branchInfo: Partial<Record<BranchId, { price: number; available: boolean }>>;
}

export interface NewProductInput {
  name: string;
  nameAr: string;
  description: string;
  category: ProductCategory;
  image: string;
  price: number;
  branches: BranchId[];
}

interface AdminDataContextValue {
  productsForBranch: (branchId: BranchId) => ResolvedProduct[];
  findProduct: (branchId: BranchId, slug: string) => ResolvedProduct | undefined;
  setProductOverride: (slug: string, branchId: BranchId, patch: ProductOverride) => void;
  addCustomProduct: (input: NewProductInput) => void;
  getBranchDisplay: (branchId: BranchId) => Branch;
  setBranchOverride: (branchId: BranchId, patch: BranchOverride) => void;
  orderRadiusMinutes: number;
  setOrderRadiusMinutes: (n: number) => void;
  requireLocationCheck: boolean;
  setRequireLocationCheck: (b: boolean) => void;
  announcement: Announcement;
  setAnnouncement: (a: Announcement) => void;
}

const KEY_PRODUCTS = "bonny.productOverrides";
const KEY_BRANCHES = "bonny.branchOverrides";
const KEY_RADIUS = "bonny.orderRadiusMinutes";
const KEY_REQUIRE_LOCATION = "bonny.requireLocationCheck";
const KEY_ANNOUNCEMENT = "bonny.announcement";
const KEY_CUSTOM_PRODUCTS = "bonny.customProducts";

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `item-${Date.now()}`
  );
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [productOverrides, setProductOverrides] = useState<ProductOverrides>({});
  const [branchOverrides, setBranchOverrides] = useState<BranchOverrides>({});
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>([]);
  const [orderRadiusMinutes, setOrderRadiusMinutesState] = useState(ORDER_RADIUS_MINUTES);
  const [requireLocationCheck, setRequireLocationCheckState] = useState(true);
  const [announcement, setAnnouncementState] = useState<Announcement>({ en: "", ar: "" });

  const loadAll = () => {
    setProductOverrides(readStorage(KEY_PRODUCTS, {} as ProductOverrides));
    setBranchOverrides(readStorage(KEY_BRANCHES, {} as BranchOverrides));
    setCustomProducts(readStorage(KEY_CUSTOM_PRODUCTS, [] as CustomProduct[]));
    setOrderRadiusMinutesState(readStorage(KEY_RADIUS, ORDER_RADIUS_MINUTES));
    setRequireLocationCheckState(readStorage(KEY_REQUIRE_LOCATION, true));
    setAnnouncementState(readStorage(KEY_ANNOUNCEMENT, { en: "", ar: "" } as Announcement));
  };

  useEffect(() => {
    loadAll();
    // Admin edits and the customer/staff-facing site often run in separate
    // browser tabs during testing — pick up changes made in other tabs.
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === null ||
        [
          KEY_PRODUCTS,
          KEY_BRANCHES,
          KEY_CUSTOM_PRODUCTS,
          KEY_RADIUS,
          KEY_REQUIRE_LOCATION,
          KEY_ANNOUNCEMENT,
        ].includes(e.key)
      ) {
        loadAll();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setProductOverride = (slug: string, branchId: BranchId, patch: ProductOverride) => {
    setProductOverrides((prev) => {
      const next: ProductOverrides = {
        ...prev,
        [slug]: { ...prev[slug], [branchId]: { ...prev[slug]?.[branchId], ...patch } },
      };
      writeStorage(KEY_PRODUCTS, next);
      return next;
    });
  };

  const addCustomProduct = (input: NewProductInput) => {
    const slug = slugify(input.name);
    const branchInfo: CustomProduct["branchInfo"] = {};
    input.branches.forEach((b) => {
      branchInfo[b] = { price: input.price, available: true };
    });
    const product: CustomProduct = {
      slug,
      name: input.name,
      nameAr: input.nameAr || input.name,
      description: input.description,
      category: input.category,
      image: input.image || "/images/products/latte.jpg",
      branchInfo,
    };
    setCustomProducts((prev) => {
      const next = [...prev, product];
      writeStorage(KEY_CUSTOM_PRODUCTS, next);
      return next;
    });
  };

  const setBranchOverride = (branchId: BranchId, patch: BranchOverride) => {
    setBranchOverrides((prev) => {
      const next: BranchOverrides = { ...prev, [branchId]: { ...prev[branchId], ...patch } };
      writeStorage(KEY_BRANCHES, next);
      return next;
    });
  };

  const setOrderRadiusMinutes = (n: number) => {
    setOrderRadiusMinutesState(n);
    writeStorage(KEY_RADIUS, n);
  };

  const setRequireLocationCheck = (b: boolean) => {
    setRequireLocationCheckState(b);
    writeStorage(KEY_REQUIRE_LOCATION, b);
  };

  const setAnnouncement = (a: Announcement) => {
    setAnnouncementState(a);
    writeStorage(KEY_ANNOUNCEMENT, a);
  };

  const productsForBranch = (branchId: BranchId): ResolvedProduct[] => {
    const base = baseProductsForBranch(branchId).map((p) => {
      const o = productOverrides[p.slug]?.[branchId];
      return {
        ...p,
        ...o,
        prepTimeMinutes: o?.prepTimeMinutes ?? DEFAULT_PREP_TIME_MINUTES,
      };
    });

    const custom: ResolvedProduct[] = customProducts
      .filter((p) => p.branchInfo[branchId])
      .map((p) => {
        const info = p.branchInfo[branchId]!;
        const o = productOverrides[p.slug]?.[branchId];
        return {
          ...p,
          price: info.price,
          available: info.available,
          ...o,
          prepTimeMinutes: o?.prepTimeMinutes ?? DEFAULT_PREP_TIME_MINUTES,
        };
      });

    return [...base, ...custom];
  };

  const findProduct = (branchId: BranchId, slug: string) =>
    productsForBranch(branchId).find((p) => p.slug === slug);

  const getBranchDisplay = (branchId: BranchId): Branch => {
    const base = BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];
    const o = branchOverrides[branchId];
    if (!o) return base;
    const lat = o.lat ?? base.lat;
    const lng = o.lng ?? base.lng;
    return {
      ...base,
      ...o,
      lat,
      lng,
      mapsUrl: o.lat !== undefined || o.lng !== undefined ? `https://maps.google.com/?q=${lat},${lng}` : base.mapsUrl,
    };
  };

  return (
    <AdminDataContext.Provider
      value={{
        productsForBranch,
        findProduct,
        setProductOverride,
        addCustomProduct,
        getBranchDisplay,
        setBranchOverride,
        orderRadiusMinutes,
        setOrderRadiusMinutes,
        requireLocationCheck,
        setRequireLocationCheck,
        announcement,
        setAnnouncement,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}

export { PRODUCTS };
