import { AccessToken } from "livekit-server-sdk"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { roomName, participantName, participantIdentity, role } = body

    if (!roomName || !participantIdentity) {
      return NextResponse.json(
        { error: "Missing required fields: roomName and participantIdentity" },
        { status: 400 }
      )
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit API credentials not configured" },
        { status: 500 }
      )
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName || participantIdentity,
      ttl: "1h",
    })

    // Determine permissions based on role
    const isHost = role === "host"

    at.addGrant({
      room: roomName,
      roomJoin: true,
      roomCreate: isHost,
      roomAdmin: isHost,
      roomList: true,
      roomRecord: isHost,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
      // CRITICAL: This permission is required to update participant metadata
      canUpdateOwnMetadata: true,
    })

    const token = await at.toJwt()

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error generating LiveKit token:", error)
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    )
  }
}
