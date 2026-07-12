"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { AdminAccount } from "@/lib/types";

interface StoredAdmin extends AdminAccount {
  password: string;
}

interface AdminAuthContextValue {
  admin: AdminAccount | null;
  password: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
}

const SEED: StoredAdmin = { username: "admin", password: "admin123", name: "Bonny HQ" };
const SESSION_KEY = "bonny.adminSession";
const PASSWORD_KEY = "bonny.adminPassword";

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [password, setPassword] = useState(SEED.password);

  useEffect(() => {
    setPassword(readStorage<string>(PASSWORD_KEY, SEED.password));
    const session = readStorage<boolean>(SESSION_KEY, false);
    if (session) setAdmin({ username: SEED.username, name: SEED.name });
  }, []);

  const login = (username: string, enteredPassword: string) => {
    if (username === SEED.username && enteredPassword === password) {
      writeStorage(SESSION_KEY, true);
      setAdmin({ username: SEED.username, name: SEED.name });
      return true;
    }
    return false;
  };

  const logout = () => {
    writeStorage(SESSION_KEY, false);
    setAdmin(null);
  };

  const changePassword = (newPassword: string) => {
    setPassword(newPassword);
    writeStorage(PASSWORD_KEY, newPassword);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, password, login, logout, changePassword }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
