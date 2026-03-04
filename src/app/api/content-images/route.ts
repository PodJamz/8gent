import { NextResponse } from "next/server";
import { readdirSync, statSync, existsSync, readFileSync } from "fs";
import { join } from "path";

interface BlobManifest {
  files: Record<string, Array<{ name: string; url: string; size: number; uploadedAt: string }>>;
}

// Load blob manifest to get URLs
function loadBlobManifest(): BlobManifest | null {
  const manifestPath = join(process.cwd(), "content", "unbreakable", "ep01", "blob-manifest.json");
  if (!existsSync(manifestPath)) return null;
  try {
    return JSON.parse(readFileSync(manifestPath, "utf-8"));
  } catch {
    return null;
  }
}

// List images from content/unbreakable directory OR blob manifest (for Vercel production)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "ep01/style-tests";

  const basePath = join(process.cwd(), "content", "unbreakable", folder);
  const manifest = loadBlobManifest();

  // Get blob data for this folder
  const folderKey = folder.replace("ep01/", ""); // e.g., "style-tests"
  const blobFiles = manifest?.files[folderKey] || [];

  // Build a map of blob URLs and metadata
  const blobMap = new Map<string, { url: string; size: number; uploadedAt: string }>();
  for (const file of blobFiles) {
    blobMap.set(file.name, { url: file.url, size: file.size, uploadedAt: file.uploadedAt });
  }

  // Try to read local files first (works in development)
  if (existsSync(basePath)) {
    try {
      const files = readdirSync(basePath);
      const images = files
        .filter((f) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
        .map((filename) => {
          const filepath = join(basePath, filename);
          const stats = statSync(filepath);
          const blobData = blobMap.get(filename);
          return {
            filename,
            path: blobData?.url || `/api/content-images/file?path=${encodeURIComponent(
              `${folder}/${filename}`
            )}`,
            url: blobData?.url, // Blob URL if available
            size: stats.size,
            modified: stats.mtime.toISOString(),
          };
        })
        .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

      return NextResponse.json({ images, folder, source: "local" });
    } catch (error) {
      // Fall through to blob-only mode
    }
  }

  // Fallback: use blob manifest only (for Vercel production where local files don't exist)
  if (blobFiles.length > 0) {
    const images = blobFiles
      .filter((f) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f.name))
      .map((file) => ({
        filename: file.name,
        path: file.url, // Use blob URL directly
        url: file.url,
        size: file.size,
        modified: file.uploadedAt,
      }))
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    return NextResponse.json({ images, folder, source: "blob" });
  }

  // No images found in either location
  return NextResponse.json({ images: [], folder, source: "none" });
}
