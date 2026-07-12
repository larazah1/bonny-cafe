"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { BranchId, StaffAccount } from "@/lib/types";

interface StoredStaff extends StaffAccount {
  password: string;
}

interface StaffAuthContextValue {
  staff: StaffAccount | null;
  staffAccounts: StoredStaff[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addStaff: (account: StoredStaff) => void;
  removeStaff: (username: string) => void;
  changePassword: (username: string, newPassword: string) => void;
}

const STAFF_KEY = "bonny.staffAccounts";
const SESSION_KEY = "bonny.staffSession";

const SEED: StoredStaff[] = [
  { username: "basateen.staff", password: "staff123", branchId: "al-basateen", name: "Al Basateen Team" },
  { username: "mohammadiyah.staff", password: "staff123", branchId: "al-mohammadiyah", name: "Al Mohammadiyah Team" },
  { username: "manar.staff", password: "staff123", branchId: "al-manar", name: "Al Manar Team" },
];

const StaffAuthContext = createContext<StaffAuthContextValue | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [staffAccounts, setStaffAccounts] = useState<StoredStaff[]>(SEED);
  const [staff, setStaff] = useState<StaffAccount | null>(null);

  useEffect(() => {
    const stored = readStorage<StoredStaff[] | null>(STAFF_KEY, null);
    if (stored && stored.length) {
      setStaffAccounts(stored);
    } else {
      writeStorage(STAFF_KEY, SEED);
    }
    const session = readStorage<string | null>(SESSION_KEY, null);
    if (session) {
      const list = stored && stored.length ? stored : SEED;
      const found = list.find((s) => s.username === session);
      if (found) setStaff(found);
    }

    // Admin can add/remove staff accounts from a separate tab — pick those
    // changes up here rather than only on next reload.
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === STAFF_KEY) {
        const next = readStorage<StoredStaff[] | null>(STAFF_KEY, null);
        if (next && next.length) setStaffAccounts(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (username: string, password: string) => {
    const found = staffAccounts.find(
      (s) => s.username === username && s.password === password
    );
    if (!found) return false;
    writeStorage(SESSION_KEY, username);
    setStaff(found);
    return true;
  };

  const logout = () => {
    writeStorage(SESSION_KEY, null);
    setStaff(null);
  };

  const addStaff = (account: StoredStaff) => {
    setStaffAccounts((prev) => {
      const next = [...prev.filter((s) => s.username !== account.username), account];
      writeStorage(STAFF_KEY, next);
      return next;
    });
  };

  const removeStaff = (username: string) => {
    setStaffAccounts((prev) => {
      const next = prev.filter((s) => s.username !== username);
      writeStorage(STAFF_KEY, next);
      return next;
    });
  };

  const changePassword = (username: string, newPassword: string) => {
    setStaffAccounts((prev) => {
      const next = prev.map((s) => (s.username === username ? { ...s, password: newPassword } : s));
      writeStorage(STAFF_KEY, next);
      return next;
    });
  };

  return (
    <StaffAuthContext.Provider
      value={{ staff, staffAccounts, login, logout, addStaff, removeStaff, changePassword }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}

export type { StoredStaff };
export type { BranchId as StaffBranchId };
