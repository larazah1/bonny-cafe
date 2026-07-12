import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Bonny Café account to order ahead and track your orders.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
