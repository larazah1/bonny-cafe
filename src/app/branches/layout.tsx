import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Branches",
  description:
    "Find Bonny Café locations in Al Basateen, Al Mohammadiyah and Al Manar, Jeddah — opening hours, phone numbers and directions.",
};

export default function BranchesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
