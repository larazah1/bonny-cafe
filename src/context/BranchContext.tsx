"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { BRANCHES, getBranch } from "@/lib/branches";
import { driveMinutesTo, nearestBranch } from "@/lib/geo";
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";
import { BranchId } from "@/lib/types";
import { useAdminData } from "./AdminDataContext";

type GeoStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported";

interface BranchContextValue {
  branchId: BranchId;
  branch: (typeof BRANCHES)[number];
  setBranchId: (id: BranchId) => void;
  geoStatus: GeoStatus;
  coords: { lat: number; lng: number } | null;
  requestLocation: () => void;
  driveMinutesToSelected: number | null;
  withinOrderRadius: boolean | null;
  nearestBranchId: BranchId | null;
}

const BranchContext = createContext<BranchContextValue | null>(null);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branchId, setBranchIdState] = useState<BranchId>(BRANCHES[0].id);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const stored = readStorage<BranchId | null>(STORAGE_KEYS.branch, null);
    if (stored) setBranchIdState(stored);
  }, []);

  const setBranchId = (id: BranchId) => {
    setBranchIdState(id);
    writeStorage(STORAGE_KEYS.branch, id);
  };

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("granted");
      },
      () => {
        setGeoStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const branch = useMemo(() => getBranch(branchId), [branchId]);

  const driveMinutesToSelected = useMemo(() => {
    if (!coords) return null;
    return driveMinutesTo(branch, coords.lat, coords.lng);
  }, [coords, branch]);

  const { orderRadiusMinutes, requireLocationCheck } = useAdminData();

  const withinOrderRadius = useMemo(() => {
    if (!requireLocationCheck) return true;
    if (driveMinutesToSelected === null) return null;
    return driveMinutesToSelected <= orderRadiusMinutes;
  }, [driveMinutesToSelected, orderRadiusMinutes, requireLocationCheck]);

  const nearestBranchId = useMemo(() => {
    if (!coords) return null;
    return nearestBranch(BRANCHES, coords.lat, coords.lng).branch.id;
  }, [coords]);

  return (
    <BranchContext.Provider
      value={{
        branchId,
        branch,
        setBranchId,
        geoStatus,
        coords,
        requestLocation,
        driveMinutesToSelected,
        withinOrderRadius,
        nearestBranchId,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used within BranchProvider");
  return ctx;
}
