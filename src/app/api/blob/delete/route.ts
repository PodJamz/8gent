import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

/**
 * Delete an image from Vercel Blob storage
 * POST /api/blob/delete
 * Body: { url: string } - The blob URL to delete
 */
export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Verify it's a valid blob URL
    if (!url.includes("blob.vercel-storage.com")) {
      return NextResponse.json(
        { error: "Invalid blob URL" },
        { status: 400 }
      );
    }

    // Delete from Vercel Blob
    await del(url);

    return NextResponse.json({
      success: true,
      deleted: url,
      message: "Image deleted from blob storage"
    });
  } catch (error) {
    console.error("Blob delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete from blob storage" },
      { status: 500 }
    );
  }
}
