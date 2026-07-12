import { Branch } from "./types";

export const BRANCHES: Branch[] = [
  {
    id: "al-basateen",
    name: "Al Basateen",
    nameAr: "البساتين",
    address: "Al Basateen District, Jeddah, Saudi Arabia",
    lat: 21.684152,
    lng: 39.1162245,
    phone: "+966 12 555 0101",
    hours: [
      { day: "Saturday – Wednesday", hours: "7:00 AM – 11:00 PM" },
      { day: "Thursday – Friday", hours: "7:00 AM – 12:00 AM" },
    ],
    mapsUrl: "https://maps.app.goo.gl/hxDnXTSmZRMMKu1bA",
  },
  {
    id: "al-mohammadiyah",
    name: "Al Mohammadiyah",
    nameAr: "المحمدية",
    address: "Al Mohammadiyah District, Jeddah, Saudi Arabia",
    lat: 21.6565698,
    lng: 39.1343367,
    phone: "+966 12 555 0102",
    hours: [
      { day: "Saturday – Wednesday", hours: "7:00 AM – 11:00 PM" },
      { day: "Thursday – Friday", hours: "7:00 AM – 12:00 AM" },
    ],
    mapsUrl: "https://maps.app.goo.gl/nsRZh9xb3rnJyXtGA",
  },
  {
    id: "al-manar",
    name: "Al Manar",
    nameAr: "المنار",
    address: "Al Manar District, Jeddah, Saudi Arabia",
    lat: 21.601192,
    lng: 39.2248104,
    phone: "+966 12 555 0103",
    hours: [
      { day: "Saturday – Wednesday", hours: "7:00 AM – 11:00 PM" },
      { day: "Thursday – Friday", hours: "7:00 AM – 12:00 AM" },
    ],
    mapsUrl: "https://maps.app.goo.gl/G2yE7WULwWxRT6JQ9",
  },
];

export function getBranch(id: string | undefined | null) {
  return BRANCHES.find((b) => b.id === id) ?? BRANCHES[0];
}
