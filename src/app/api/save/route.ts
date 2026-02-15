import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// File-based storage for dev, would be replaced with DB in production
const DATA_DIR = path.join(process.cwd(), '.data', 'sessions');
const INDEX_FILE = path.join(DATA_DIR, '_index.json');

// Token expiration time (7 days in milliseconds)
const TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

// Session data structure
interface SavedSession {
  sessionId: string;
  draft: unknown;
  chatHistory: unknown[];
  eventLog: unknown[];
  createdAt: number;
  expiresAt: number;
}

interface SessionIndex {
  [token: string]: {
    sessionId: string;
    createdAt: number;
    expiresAt: number;
  };
}

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

// Read session index
async function readIndex(): Promise<SessionIndex> {
  try {
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Write session index
async function writeIndex(index: SessionIndex): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
}

// Get session file path
function getSessionPath(token: string): string {
  // Use a safe filename
  const safeToken = token.replace(/[^a-zA-Z0-9-_]/g, '_');
  return path.join(DATA_DIR, `${safeToken}.json`);
}

// Read a session
async function readSession(token: string): Promise<SavedSession | null> {
  try {
    const data = await fs.readFile(getSessionPath(token), 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Write a session
async function writeSession(token: string, session: SavedSession): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(getSessionPath(token), JSON.stringify(session, null, 2));
}

// Delete a session
async function deleteSession(token: string): Promise<void> {
  try {
    await fs.unlink(getSessionPath(token));
  } catch {
    // File might not exist
  }
}

// Generate a secure random token
function generateToken(): string {
  return crypto.randomBytes(16).toString('base64url');
}

// Clean up expired sessions
async function cleanupExpiredSessions(): Promise<void> {
  const now = Date.now();
  const index = await readIndex();
  let hasChanges = false;

  for (const [token, meta] of Object.entries(index)) {
    if (meta.expiresAt < now) {
      delete index[token];
      await deleteSession(token);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    await writeIndex(index);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, draft, chatHistory, eventLog } = body;

    if (!sessionId || !draft) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId and draft' },
        { status: 400 }
      );
    }

    // Generate a unique token
    const token = generateToken();
    const now = Date.now();

    // Create the session data
    const session: SavedSession = {
      sessionId,
      draft,
      chatHistory: chatHistory || [],
      eventLog: eventLog || [],
      createdAt: now,
      expiresAt: now + TOKEN_EXPIRATION,
    };

    // Write session to file
    await writeSession(token, session);

    // Update index
    const index = await readIndex();
    index[token] = {
      sessionId,
      createdAt: now,
      expiresAt: now + TOKEN_EXPIRATION,
    };
    await writeIndex(index);

    // Clean up old sessions periodically (10% chance to avoid doing it every request)
    if (Math.random() < 0.1) {
      cleanupExpiredSessions().catch(console.error);
    }

    return NextResponse.json({
      success: true,
      token,
      expiresAt: now + TOKEN_EXPIRATION,
    });
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Missing token parameter' },
        { status: 400 }
      );
    }

    const session = await readSession(token);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or expired' },
        { status: 404 }
      );
    }

    // Check if expired
    if (session.expiresAt < Date.now()) {
      await deleteSession(token);
      const index = await readIndex();
      delete index[token];
      await writeIndex(index);
      return NextResponse.json(
        { error: 'Session has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      draft: session.draft,
      chatHistory: session.chatHistory,
      eventLog: session.eventLog,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
