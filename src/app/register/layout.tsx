import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Bonny Café account to place orders ahead at your nearest branch.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
