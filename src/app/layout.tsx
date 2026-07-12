import type { Metadata } from "next";
import { Fraunces, Inter, Reem_Kufi, Tajawal } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingCartButton } from "@/components/FloatingCartButton";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bonnycafe.example.com"),
  title: {
    default: "Bonny Café | Specialty Coffee in Jeddah",
    template: "%s | Bonny Café",
  },
  description:
    "Bonny Café — specialty coffee, desserts and sandwiches across three Jeddah branches. Order ahead for pickup or dine in.",
  openGraph: {
    title: "Bonny Café",
    description:
      "Specialty coffee, desserts and sandwiches across three Jeddah branches.",
    siteName: "Bonny Café",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${reemKufi.variable} ${tajawal.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-cream-50 font-sans text-brown-950 antialiased">
        <AppProviders>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <FloatingCartButton />
        </AppProviders>
      </body>
    </html>
  );
}
