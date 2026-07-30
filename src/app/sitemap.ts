import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://velmoor.com",
      priority: 1,
    },
  ];
}
