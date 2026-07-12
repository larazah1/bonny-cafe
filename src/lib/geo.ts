import { Branch } from "./types";

const EARTH_RADIUS_KM = 6371;

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Approximate driving minutes from straight-line distance. Real deployments
 * should replace this with the Google Maps Distance Matrix API (or similar)
 * for actual road-network travel time; this is a reasonable in-city stand-in
 * (~28 km/h average with a fixed traffic-light/turn overhead) so the ordering
 * radius check works without a paid maps key.
 */
export function estimateDriveMinutes(distanceKm: number): number {
  const avgSpeedKmh = 28;
  const overheadMinutes = 2;
  return (distanceKm / avgSpeedKmh) * 60 + overheadMinutes;
}

export const ORDER_RADIUS_MINUTES = 5;

export function nearestBranch(
  branches: Branch[],
  lat: number,
  lng: number
): { branch: Branch; distanceKm: number; driveMinutes: number } {
  let best = branches[0];
  let bestDist = Infinity;
  for (const b of branches) {
    const d = haversineDistanceKm(lat, lng, b.lat, b.lng);
    if (d < bestDist) {
      bestDist = d;
      best = b;
    }
  }
  return {
    branch: best,
    distanceKm: bestDist,
    driveMinutes: estimateDriveMinutes(bestDist),
  };
}

export function driveMinutesTo(branch: Branch, lat: number, lng: number): number {
  return estimateDriveMinutes(haversineDistanceKm(lat, lng, branch.lat, branch.lng));
}
