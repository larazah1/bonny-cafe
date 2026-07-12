export type BranchId = "al-basateen" | "al-mohammadiyah" | "al-manar";

export interface DayHours {
  day: string;
  hours: string;
}

export interface Branch {
  id: BranchId;
  name: string;
  nameAr: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: DayHours[];
  mapsUrl: string;
}

export type ProductCategory =
  | "espresso-drinks"
  | "black-coffee"
  | "cold-drinks"
  | "desserts"
  | "sandwiches"
  | "beans";

export interface ProductBase {
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  category: ProductCategory;
  image: string;
  allergens?: string[];
}

export interface ProductSize {
  label: string;
  labelAr: string;
  price: number;
}

export interface BranchProductInfo {
  price: number;
  available: boolean;
  /** for items with hot/iced or size-based pricing tiers, e.g. "9 / 13 / 15" */
  priceNote?: string;
  /** when set, the product modal offers these as selectable size options */
  sizes?: ProductSize[];
}

export interface Product extends ProductBase {
  branchInfo: Record<BranchId, BranchProductInfo>;
}

export interface ResolvedProduct extends ProductBase {
  price: number;
  available: boolean;
  priceNote?: string;
  prepTimeMinutes: number;
  sizes?: ProductSize[];
}

export type PickupType = "drive-thru" | "dine-in";

export interface CartLine {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  note?: string;
}

export type OrderStatus = "preparing" | "ready" | "completed" | "cancelled";

export interface Order {
  id: string;
  branchId: BranchId;
  customerName: string;
  phone: string;
  pickupType: PickupType;
  lines: CartLine[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedMinutes?: number;
}

export interface CustomerAccount {
  fullName: string;
  mobile: string;
  email: string;
}

export interface StaffAccount {
  username: string;
  branchId: BranchId;
  name: string;
}

export interface AdminAccount {
  username: string;
  name: string;
}
