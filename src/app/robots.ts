import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://openclaw.io";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/vault/upload", "/s/", "/settings"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/vault/upload", "/s/", "/settings"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/", "/vault/upload", "/s/", "/settings"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/vault/upload", "/s/", "/settings"],
      },
      {
        userAgent: "Anthropic-AI",
        allow: "/",
        disallow: ["/api/", "/vault/upload", "/s/", "/settings"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/vault/upload", "/s/", "/settings"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/vault/upload", "/s/", "/settings"],
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/api/", "/vault/upload", "/s/", "/settings"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
