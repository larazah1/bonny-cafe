import type { MetadataRoute } from "next";

const BASE_URL = "https://bonnycafe.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/branches", "/rooftop", "/about", "/contact", "/login", "/register"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
