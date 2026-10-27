import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/verify",
        "/api/",
      ],
    },
    sitemap: "https://digimart.evolurelabs.com/sitemap.xml",
  };
}