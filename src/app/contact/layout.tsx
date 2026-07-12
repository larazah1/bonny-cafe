import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Rooftop Rental",
  description:
    "Get in touch with Bonny Café, find branch locations and hours, or request our Al Basateen rooftop for private events.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
