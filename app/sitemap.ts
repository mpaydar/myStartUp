import type { MetadataRoute } from "next";

function normalizeOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

/**
 * Sitemap `<loc>` must use your canonical public URL (custom domain), not a
 * preview deployment host. Set NEXT_PUBLIC_SITE_URL in Vercel for production.
 */
function getBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return normalizeOrigin(fromEnv);

  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prodHost) return normalizeOrigin(prodHost);

  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/get_in_touch`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/get_started`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
