import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Credits",
  description: "Attribution and licenses for the menu photos used on this site.",
};

export default function CreditsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
