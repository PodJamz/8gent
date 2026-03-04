import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/lib/openclaw/auth-server";
import { ConvexHttpClient } from "@/lib/openclaw/client";
import { makeFunctionReference } from "@/lib/openclaw/client";

// Check if user is owner via Clerk + Convex
async function isOwner(): Promise<boolean> {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return false;

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) return false;

    const client = new ConvexHttpClient(convexUrl);
    const getManagedUser = makeFunctionReference<
      "query",
      { clerkId: string },
      { role: string } | null
    >("userManagement:getManagedUserByClerkId");

    const user = await client.query(getManagedUser, { clerkId: clerkUserId });
    return user?.role === "owner";
  } catch {
    return false;
  }
}

// Allowed file types for canvas uploads
const ALLOWED_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac", "audio/x-m4a", "audio/webm"],
  video: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
};

function getMediaType(mimeType: string): "image" | "audio" | "video" | null {
  if (ALLOWED_TYPES.image.includes(mimeType)) return "image";
  if (ALLOWED_TYPES.audio.includes(mimeType)) return "audio";
  if (ALLOWED_TYPES.video.includes(mimeType)) return "video";
  return null;
}

export async function POST(request: Request) {
  // Check owner auth
  const ownerAuth = await isOwner();
  if (!ownerAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine media type from file
    const mediaType = getMediaType(file.type);
    if (!mediaType) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    // Generate path for blob storage
    const folder = `canvas/${mediaType}`;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${folder}/${Date.now()}-${sanitizedName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      mediaType,
    });
  } catch (error) {
    console.error("Canvas upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
