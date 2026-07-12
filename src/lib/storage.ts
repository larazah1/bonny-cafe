export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota, etc.) — fail silently
  }
}

export const STORAGE_KEYS = {
  branch: "bonny.selectedBranch",
  cart: "bonny.cart",
  customer: "bonny.customerAccount",
  customerSession: "bonny.customerSession",
  orders: "bonny.orders",
  staffSession: "bonny.staffSession",
  adminSession: "bonny.adminSession",
} as const;
