"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { readStorage, writeStorage } from "@/lib/storage";

export interface RooftopRequest {
  id: string;
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  guests: number;
  eventType: string;
  notes?: string;
  createdAt: string;
  status: "new" | "contacted" | "confirmed" | "declined";
}

interface RentalContextValue {
  requests: RooftopRequest[];
  submitRequest: (
    input: Omit<RooftopRequest, "id" | "createdAt" | "status">
  ) => RooftopRequest;
  updateStatus: (id: string, status: RooftopRequest["status"]) => void;
}

const KEY = "cafe.rooftopRequests";

const RentalContext = createContext<RentalContextValue | null>(null);

function genId() {
  return `RSV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function RentalProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<RooftopRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRequests(readStorage(KEY, [] as RooftopRequest[]));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    writeStorage(KEY, requests);
  }, [requests, loaded]);

  const submitRequest: RentalContextValue["submitRequest"] = (input) => {
    const req: RooftopRequest = {
      ...input,
      id: genId(),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    setRequests((prev) => [req, ...prev]);
    return req;
  };

  const updateStatus = (id: string, status: RooftopRequest["status"]) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <RentalContext.Provider value={{ requests, submitRequest, updateStatus }}>
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  const ctx = useContext(RentalContext);
  if (!ctx) throw new Error("useRental must be used within RentalProvider");
  return ctx;
}
