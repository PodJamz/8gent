import { NextResponse } from "next/server";

interface ScrapedContent {
  url: string;
  domain: string;
  title?: string;
  favicon?: string;
  contentType: string;
  content?: string;
  excerpt?: string;
  thumbnail?: string;
  images?: string[];
  summary?: string;
  aiSummary?: string;
  aiKeywords?: string[];
  tags?: string[];
  githubData?: {
    owner: string;
    repo: string;
    stars?: number;
    forks?: number;
    language?: string;
    description?: string;
    topics?: string[];
    lastUpdated?: string;
    license?: string;
  };
  videoData?: {
    platform: string;
    videoId: string;
    duration?: number;
    channelName?: string;
    embedUrl?: string;
  };
  packageData?: {
    registry: string;
    name: string;
    version?: string;
    downloads?: number;
    license?: string;
  };
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function detectContentType(url: string, domain: string): string {
  // GitHub
  if (domain === "github.com") {
    const parts = url.split("/").filter(Boolean);
    if (parts.length >= 4) {
      if (parts[3] === "blob") return "github_file";
      if (parts[3] === "tree") return "github_readme";
    }
    if (parts.length === 4) return "github_repo";
    return "github_repo";
  }

  // Video platforms
  if (["youtube.com", "youtu.be", "vimeo.com"].includes(domain)) {
    return "video";
  }

  // Package registries
  if (["npmjs.com", "pypi.org", "crates.io", "rubygems.org"].includes(domain)) {
    return "package";
  }

  // Documentation
  if (
    domain.includes("docs.") ||
    domain.includes("documentation") ||
    url.includes("/docs/")
  ) {
    return "documentation";
  }

  // Twitter/X
  if (["twitter.com", "x.com"].includes(domain)) {
    return "tweet";
  }

  // LinkedIn profiles
  if (domain === "linkedin.com" && url.includes("/in/")) {
    return "person";
  }

  // Default to article
  return "article";
}

async function fetchGitHubData(
  owner: string,
  repo: string
): Promise<ScrapedContent["githubData"]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) return undefined;

    const data = await response.json();

    return {
      owner,
      repo,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      description: data.description,
      topics: data.topics || [],
      lastUpdated: data.updated_at,
      license: data.license?.name,
    };
  } catch {
    return { owner, repo };
  }
}

async function fetchPageContent(url: string): Promise<{
  html: string;
  title?: string;
  excerpt?: string;
  thumbnail?: string;
  favicon?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ResearchBot/1.0; +https://openclaw.io)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Extract basic metadata using regex (avoiding full DOM parsing for speed)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.trim();

    // Try to get og:image or twitter:image
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    );
    const twitterImageMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    );
    const thumbnail = ogImageMatch?.[1] || twitterImageMatch?.[1];

    // Try to get description
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    );
    const excerpt = descMatch?.[1] || ogDescMatch?.[1];

    // Get favicon
    const faviconMatch = html.match(
      /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i
    );
    let favicon = faviconMatch?.[1];

    // Make favicon absolute URL
    if (favicon && !favicon.startsWith("http")) {
      const urlObj = new URL(url);
      favicon = new URL(favicon, urlObj.origin).href;
    }

    // Fallback to default favicon path
    if (!favicon) {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}/favicon.ico`;
    }

    return { html, title, excerpt, thumbnail, favicon };
  } catch (error) {
    console.error("Error fetching page:", error);
    return { html: "" };
  }
}

async function generateAISummary(
  content: string,
  title: string
): Promise<{ summary?: string; keywords?: string[] }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {};
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Analyze this content and provide:
1. A 2-3 sentence summary
2. 3-5 relevant keywords/tags

Title: ${title}
Content (first 2000 chars): ${content.slice(0, 2000)}

Respond in JSON format:
{"summary": "...", "keywords": ["...", "..."]}`,
          },
        ],
      }),
    });

    if (!response.ok) return {};

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (text) {
      // Try to parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary,
          keywords: parsed.keywords,
        };
      }
    }

    return {};
  } catch (error) {
    console.error("AI summary error:", error);
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    let validUrl: string;
    try {
      const urlObj = new URL(url);
      validUrl = urlObj.href;
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const domain = extractDomain(validUrl);
    const contentType = detectContentType(validUrl, domain);

    const result: ScrapedContent = {
      url: validUrl,
      domain,
      contentType,
    };

    // Handle GitHub repos specially
    if (contentType.startsWith("github")) {
      const pathParts = new URL(validUrl).pathname.split("/").filter(Boolean);
      if (pathParts.length >= 2) {
        const [owner, repo] = pathParts;
        result.githubData = await fetchGitHubData(owner, repo);
        result.title =
          result.githubData?.description || `${owner}/${repo}`;
        result.tags = result.githubData?.topics || [];

        // Generate AI summary for GitHub repos
        if (result.githubData?.description) {
          const aiResult = await generateAISummary(
            result.githubData.description +
              (result.githubData.topics?.join(", ") || ""),
            `${owner}/${repo}`
          );
          result.aiSummary = aiResult.summary;
          result.aiKeywords = aiResult.keywords;
        }
      }
    }

    // Handle YouTube videos
    if (contentType === "video" && domain.includes("youtube")) {
      const urlObj = new URL(validUrl);
      let videoId = urlObj.searchParams.get("v");
      if (!videoId && domain === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      }

      if (videoId) {
        result.videoData = {
          platform: "youtube",
          videoId,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
        };
        result.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // Handle npm packages
    if (domain === "npmjs.com") {
      const pathParts = new URL(validUrl).pathname.split("/").filter(Boolean);
      if (pathParts[0] === "package" && pathParts[1]) {
        const packageName = pathParts.slice(1).join("/");
        try {
          const npmResponse = await fetch(
            `https://registry.npmjs.org/${packageName}`
          );
          if (npmResponse.ok) {
            const npmData = await npmResponse.json();
            result.packageData = {
              registry: "npm",
              name: packageName,
              version: npmData["dist-tags"]?.latest,
              license: npmData.license,
            };
            result.title = npmData.name;
            result.excerpt = npmData.description;
          }
        } catch {
          // Ignore npm fetch errors
        }
      }
    }

    // For other content, fetch the page
    if (!result.title) {
      const pageContent = await fetchPageContent(validUrl);
      result.title = pageContent.title || domain;
      result.excerpt = pageContent.excerpt;
      result.thumbnail = pageContent.thumbnail;
      result.favicon = pageContent.favicon;

      // Generate AI summary for articles
      if (
        contentType === "article" ||
        contentType === "documentation"
      ) {
        const textContent =
          pageContent.excerpt ||
          pageContent.html.replace(/<[^>]+>/g, " ").slice(0, 3000);
        const aiResult = await generateAISummary(
          textContent,
          result.title || ""
        );
        result.aiSummary = aiResult.summary;
        result.aiKeywords = aiResult.keywords;
        if (aiResult.keywords) {
          result.tags = aiResult.keywords;
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape URL" },
      { status: 500 }
    );
  }
}
