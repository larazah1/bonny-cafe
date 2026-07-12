import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story of Bonny Café — a small-batch specialty coffee roaster with three branches across Jeddah.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
