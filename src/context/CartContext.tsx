"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";
import { CartLine, PickupType, ResolvedProduct } from "@/lib/types";
import { useBranch } from "./BranchContext";
import { useToast } from "./ToastContext";

interface StoredCart {
  branchId: string;
  lines: CartLine[];
  pickupType: PickupType;
}

interface CartContextValue {
  lines: CartLine[];
  pickupType: PickupType;
  setPickupType: (t: PickupType) => void;
  addItem: (product: ResolvedProduct, quantity?: number, note?: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY: StoredCart = { branchId: "", lines: [], pickupType: "dine-in" };

export function CartProvider({ children }: { children: ReactNode }) {
  const { branchId } = useBranch();
  const { show } = useToast();
  const [cart, setCart] = useState<StoredCart>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(readStorage(STORAGE_KEYS.cart, EMPTY));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    writeStorage(STORAGE_KEYS.cart, cart);
  }, [cart, loaded]);

  // if the active branch changes and the cart holds items from a different
  // branch, clear it — menus/prices are branch-specific
  useEffect(() => {
    if (!loaded) return;
    if (cart.lines.length > 0 && cart.branchId && cart.branchId !== branchId) {
      setCart(EMPTY);
      show("Branch changed — your cart was cleared since items differ by branch.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, loaded]);

  const addItem = (product: ResolvedProduct, quantity = 1, note?: string) => {
    setCart((prev) => {
      const base = prev.branchId === branchId ? prev : { ...EMPTY, branchId };
      const existing = base.lines.find((l) => l.slug === product.slug && l.note === note);
      let lines: CartLine[];
      if (existing) {
        lines = base.lines.map((l) =>
          l === existing ? { ...l, quantity: l.quantity + quantity } : l
        );
      } else {
        lines = [
          ...base.lines,
          {
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            note,
          },
        ];
      }
      return { ...base, branchId, lines };
    });
    show(`Added ${product.name} to cart`, "success");
  };

  const updateQuantity = (slug: string, quantity: number) => {
    setCart((prev) => ({
      ...prev,
      lines:
        quantity <= 0
          ? prev.lines.filter((l) => l.slug !== slug)
          : prev.lines.map((l) => (l.slug === slug ? { ...l, quantity } : l)),
    }));
  };

  const removeItem = (slug: string) => {
    setCart((prev) => ({ ...prev, lines: prev.lines.filter((l) => l.slug !== slug) }));
  };

  const clear = () => setCart({ ...EMPTY, branchId });

  const setPickupType = (t: PickupType) => setCart((prev) => ({ ...prev, pickupType: t }));

  const total = useMemo(
    () => cart.lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [cart.lines]
  );
  const count = useMemo(
    () => cart.lines.reduce((sum, l) => sum + l.quantity, 0),
    [cart.lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines: cart.lines,
        pickupType: cart.pickupType ?? "dine-in",
        setPickupType,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
