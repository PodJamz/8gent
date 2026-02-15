import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession, getVaultCookieName } from "@/lib/vaultAuth";
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

export async function POST(request: Request) {
  // Check auth: vault session OR owner via Clerk
  const cookieStore = await cookies();
  const token = cookieStore.get(getVaultCookieName())?.value;
  const vaultSession = verifySession(token);
  const ownerAuth = await isOwner();

  if (!vaultSession && !ownerAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'audio' or 'image'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac", "audio/x-m4a"];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (type === "audio" && !allowedAudioTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid audio format. Allowed: MP3, WAV, OGG, M4A, AAC" },
        { status: 400 }
      );
    }

    if (type === "image" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image format. Allowed: JPG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    // Generate a path based on type
    const folder = type === "audio" ? "music/audio" : "music/artwork";
    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
