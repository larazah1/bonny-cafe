"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";
import { BranchId, CartLine, Order, OrderStatus, PickupType } from "@/lib/types";
import { DEFAULT_PREP_TIME_MINUTES } from "@/lib/menu";
import { useAdminData } from "./AdminDataContext";

interface CreateOrderInput {
  branchId: BranchId;
  customerName: string;
  phone: string;
  pickupType: PickupType;
  lines: CartLine[];
  total: number;
}

interface OrdersContextValue {
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  cancelOrder: (id: string) => boolean;
  ordersForCustomer: (phone: string) => Order[];
  ordersForBranch: (branchId: BranchId) => Order[];
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

function genId() {
  return `BNY-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { findProduct } = useAdminData();

  useEffect(() => {
    setOrders(readStorage(STORAGE_KEYS.orders, [] as Order[]));
    setLoaded(true);

    // Orders are created from the customer-facing site and consumed by the
    // staff/admin portals — these are commonly open in separate tabs during
    // testing, so pick up changes written from another tab.
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === STORAGE_KEYS.orders) {
        setOrders(readStorage(STORAGE_KEYS.orders, [] as Order[]));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    writeStorage(STORAGE_KEYS.orders, orders);
  }, [orders, loaded]);

  const createOrder = (input: CreateOrderInput): Order => {
    const now = new Date().toISOString();
    // The order is ready when its slowest item is ready.
    const estimatedMinutes = input.lines.reduce((max, line) => {
      const minutes = findProduct(input.branchId, line.slug)?.prepTimeMinutes ?? DEFAULT_PREP_TIME_MINUTES;
      return Math.max(max, minutes);
    }, DEFAULT_PREP_TIME_MINUTES);
    const order: Order = {
      id: genId(),
      branchId: input.branchId,
      customerName: input.customerName,
      phone: input.phone,
      pickupType: input.pickupType,
      lines: input.lines,
      total: input.total,
      // Orders are auto-accepted and move straight into preparation — staff
      // only ever act on the preparing → ready → completed handoff.
      status: "preparing",
      createdAt: now,
      updatedAt: now,
      estimatedMinutes,
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      )
    );
  };

  const cancelOrder = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return false;
    if (order.status !== "preparing") return false;
    updateStatus(id, "cancelled");
    return true;
  };

  const ordersForCustomer = (phone: string) =>
    orders.filter((o) => o.phone === phone).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const ordersForBranch = (branchId: BranchId) =>
    orders
      .filter((o) => o.branchId === branchId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <OrdersContext.Provider
      value={{ orders, createOrder, updateStatus, cancelOrder, ordersForCustomer, ordersForBranch }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
