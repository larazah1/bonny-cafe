import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent the Rooftop",
  description:
    "Book Mocha House's Al Basateen rooftop for private events — birthdays, engagements, corporate gatherings and more.",
};

export default function RooftopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
