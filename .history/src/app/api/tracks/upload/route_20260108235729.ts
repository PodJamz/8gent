import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession, getVaultCookieName } from "@/lib/vaultAuth";

export async function POST(request: Request) {
  // Verify vault session
  const cookieStore = await cookies();
  const token = cookieStore.get(getVaultCookieName())?.value;
  const session = verifySession(token);

  if (!session) {
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
    const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac"];
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
