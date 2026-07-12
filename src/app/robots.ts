import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/profile", "/staff", "/admin"],
      },
    ],
    sitemap: "https://bonnycafe.example.com/sitemap.xml",
  };
}
