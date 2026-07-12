import { Branch } from "./types";

/**
 * Coordinates are approximate district centers (Jeddah, Saudi Arabia) for
 * demo distance/radius calculations — swap in exact storefront coordinates
 * before going live.
 */
export const BRANCHES: Branch[] = [
  {
    id: "al-basateen",
    name: "Al Basateen",
    nameAr: "البساتين",
    address: "Al Basateen District, Jeddah, Saudi Arabia",
    lat: 21.5433,
    lng: 39.1728,
    phone: "+966 12 555 0101",
    hours: [
      { day: "Saturday – Wednesday", hours: "7:00 AM – 11:00 PM" },
      { day: "Thursday – Friday", hours: "7:00 AM – 12:00 AM" },
    ],
    mapsUrl: "https://maps.google.com/?q=21.5433,39.1728",
  },
  {
    id: "al-mohammadiyah",
    name: "Al Mohammadiyah",
    nameAr: "المحمدية",
    address: "Al Mohammadiyah District, Jeddah, Saudi Arabia",
    lat: 21.5731,
    lng: 39.1594,
    phone: "+966 12 555 0102",
    hours: [
      { day: "Saturday – Wednesday", hours: "7:00 AM – 11:00 PM" },
      { day: "Thursday – Friday", hours: "7:00 AM – 12:00 AM" },
    ],
    mapsUrl: "https://maps.google.com/?q=21.5731,39.1594",
  },
  {
    id: "al-manar",
    name: "Al Manar",
    nameAr: "المنار",
    address: "Al Manar District, Jeddah, Saudi Arabia",
    lat: 21.5967,
    lng: 39.1653,
    phone: "+966 12 555 0103",
    hours: [
      { day: "Saturday – Wednesday", hours: "7:00 AM – 11:00 PM" },
      { day: "Thursday – Friday", hours: "7:00 AM – 12:00 AM" },
    ],
    mapsUrl: "https://maps.google.com/?q=21.5967,39.1653",
  },
];

export function getBranch(id: string | undefined | null) {
  return BRANCHES.find((b) => b.id === id) ?? BRANCHES[0];
}
