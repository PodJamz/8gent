import { NextResponse } from "next/server";
import { readFileSync, existsSync, unlinkSync } from "fs";
import { join, extname } from "path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "No path specified" }, { status: 400 });
  }

  // Prevent directory traversal
  if (path.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const fullPath = join(process.cwd(), "content", "unbreakable", path);

  if (!existsSync(fullPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const buffer = readFileSync(fullPath);
    const ext = extname(fullPath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "No path specified" }, { status: 400 });
  }

  // Prevent directory traversal
  if (path.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const fullPath = join(process.cwd(), "content", "unbreakable", path);

  if (!existsSync(fullPath)) {
    // File doesn't exist locally, that's fine (might only be in blob)
    return NextResponse.json({ success: true, message: "File not found locally" });
  }

  try {
    unlinkSync(fullPath);
    return NextResponse.json({ success: true, deleted: path });
  } catch (error) {
    console.error("Failed to delete file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
