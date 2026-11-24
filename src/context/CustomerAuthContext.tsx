"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { CustomerAccount } from "@/lib/types";

interface StoredCustomer extends CustomerAccount {
  password?: string;
}

interface PendingOtp {
  identifier: string; // mobile number
  code: string;
  purpose: "register" | "login";
  draft?: { fullName: string; mobile: string; email: string; password?: string };
}

interface CustomerAuthContextValue {
  customer: CustomerAccount | null;
  requestRegisterOtp: (
    fullName: string,
    mobile: string,
    email: string,
    password?: string
  ) => Promise<string>;
  requestLoginOtp: (mobile: string) => Promise<string | null>;
  verifyOtp: (code: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  updateProfile: (patch: { fullName: string; email: string }) => void;
  logout: () => void;
  pendingIdentifier: string | null;
}

const CUSTOMERS_KEY = "cafe.customers";
const SESSION_KEY = "cafe.customerSession";

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

function fakeDelay<T>(value: T, ms = 650): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function genOtp() {
  return String(Math.floor(100000 + (Date.now() % 900000))).slice(0, 6);
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerAccount | null>(null);
  const [pending, setPending] = useState<PendingOtp | null>(null);

  useEffect(() => {
    const session = readStorage<string | null>(SESSION_KEY, null);
    if (session) {
      const all = readStorage<Record<string, StoredCustomer>>(CUSTOMERS_KEY, {});
      const found = all[session];
      if (found) setCustomer(found);
    }
  }, []);

  const requestRegisterOtp = async (
    fullName: string,
    mobile: string,
    email: string,
    password?: string
  ) => {
    const code = genOtp();
    setPending({ identifier: mobile, code, purpose: "register", draft: { fullName, mobile, email, password } });
    return fakeDelay(code);
  };

  const requestLoginOtp = async (mobile: string) => {
    const all = readStorage<Record<string, StoredCustomer>>(CUSTOMERS_KEY, {});
    if (!all[mobile]) return fakeDelay(null);
    const code = genOtp();
    setPending({ identifier: mobile, code, purpose: "login" });
    return fakeDelay(code);
  };

  const verifyOtp = async (code: string) => {
    if (!pending) return fakeDelay(false);
    const ok = code.trim() === pending.code;
    if (!ok) return fakeDelay(false);

    const all = readStorage<Record<string, StoredCustomer>>(CUSTOMERS_KEY, {});
    if (pending.purpose === "register" && pending.draft) {
      const record: StoredCustomer = {
        fullName: pending.draft.fullName,
        mobile: pending.draft.mobile,
        email: pending.draft.email,
        password: pending.draft.password,
      };
      all[pending.identifier] = record;
      writeStorage(CUSTOMERS_KEY, all);
      writeStorage(SESSION_KEY, pending.identifier);
      setCustomer(record);
    } else {
      const record = all[pending.identifier];
      if (record) {
        writeStorage(SESSION_KEY, pending.identifier);
        setCustomer(record);
      }
    }
    setPending(null);
    return fakeDelay(true);
  };

  const loginWithEmail = async (email: string, password: string) => {
    const all = readStorage<Record<string, StoredCustomer>>(CUSTOMERS_KEY, {});
    const match = Object.values(all).find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    if (!match) return fakeDelay(false);
    writeStorage(SESSION_KEY, match.mobile);
    setCustomer(match);
    return fakeDelay(true);
  };

  const updateProfile = (patch: { fullName: string; email: string }) => {
    if (!customer) return;
    const all = readStorage<Record<string, StoredCustomer>>(CUSTOMERS_KEY, {});
    const existing = all[customer.mobile];
    if (!existing) return;
    const updated: StoredCustomer = { ...existing, ...patch };
    all[customer.mobile] = updated;
    writeStorage(CUSTOMERS_KEY, all);
    setCustomer(updated);
  };

  const logout = () => {
    writeStorage(SESSION_KEY, null);
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        requestRegisterOtp,
        requestLoginOtp,
        verifyOtp,
        loginWithEmail,
        updateProfile,
        logout,
        pendingIdentifier: pending?.identifier ?? null,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}
