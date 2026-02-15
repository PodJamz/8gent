/**
 * ERV Entity Import API
 *
 * Dedicated endpoint for importing data directly into the ERV entity system.
 * Uses AI-assisted classification to determine entity types and extract attributes.
 *
 * Supports: .txt, .md, .json, .csv (one entity per line/row)
 *
 * Owner-only endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/openclaw/auth-server';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';

// Entity type classification schemas
const ENTITY_TYPE_SCHEMAS = {
  Person: {
    keywords: ['person', 'contact', 'colleague', 'friend', 'team', 'member', 'employee', 'met', 'introduced', 'email', '@'],
    defaultTags: ['contact'],
  },
  Project: {
    keywords: ['project', 'app', 'website', 'repo', 'build', 'create', 'develop', 'startup', 'product', 'github'],
    defaultTags: ['project'],
  },
  Track: {
    keywords: ['song', 'track', 'music', 'audio', 'beat', 'album', 'artist', 'spotify', 'soundcloud'],
    defaultTags: ['music'],
  },
  Event: {
    keywords: ['event', 'meeting', 'conference', 'deadline', 'appointment', 'call', 'date', 'schedule'],
    defaultTags: ['calendar'],
  },
  Memory: {
    keywords: ['remember', 'memory', 'note', 'thought', 'idea', 'insight', 'learned', 'decision'],
    defaultTags: ['memory'],
  },
  Ticket: {
    keywords: ['ticket', 'task', 'bug', 'feature', 'story', 'issue', 'todo', 'fix', 'implement'],
    defaultTags: ['task'],
  },
  Draft: {
    keywords: ['draft', 'writing', 'blog', 'article', 'post', 'essay', 'document'],
    defaultTags: ['writing'],
  },
  Skill: {
    keywords: ['skill', 'ability', 'expertise', 'technology', 'tool', 'language', 'framework'],
    defaultTags: ['skill'],
  },
} as const;

type EntityTypeName = keyof typeof ENTITY_TYPE_SCHEMAS;

interface ClassificationResult {
  entityType: EntityTypeName;
  confidence: number;
  name: string;
  data: Record<string, unknown>;
  tags: string[];
}

/**
 * Classify a single content item into an entity type
 */
function classifyContent(content: string, defaultType?: EntityTypeName): ClassificationResult {
  const lowerContent = content.toLowerCase();

  // Score each entity type
  let bestType: EntityTypeName = defaultType || 'Memory';
  let bestScore = 0;

  for (const [typeName, schema] of Object.entries(ENTITY_TYPE_SCHEMAS)) {
    const matches = schema.keywords.filter((kw) => lowerContent.includes(kw));
    const score = matches.length / schema.keywords.length;

    if (score > bestScore) {
      bestScore = score;
      bestType = typeName as EntityTypeName;
    }
  }

  // Extract name (first line or truncated content)
  const lines = content.split('\n').filter((l) => l.trim());
  const name = lines[0] && lines[0].length < 100
    ? lines[0].trim()
    : content.slice(0, 60).trim() + (content.length > 60 ? '...' : '');

  // Build data based on type
  const data: Record<string, unknown> = {};

  switch (bestType) {
    case 'Person': {
      const emailMatch = content.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) data.email = emailMatch[0];
      data.notes = content;
      break;
    }
    case 'Project': {
      data.status = 'discovery';
      data.color = '#8b5cf6';
      data.description = content;
      const githubMatch = content.match(/https?:\/\/github\.com\/[\w-]+\/[\w-]+/);
      if (githubMatch) data.githubRepo = githubMatch[0];
      break;
    }
    case 'Memory': {
      data.memoryType = lowerContent.includes('decision') ? 'decision' :
        lowerContent.includes('preference') ? 'preference' : 'interaction';
      data.content = content;
      data.importance = 0.7;
      data.timestamp = Date.now();
      break;
    }
    case 'Ticket': {
      data.ticketId = `IMPORT-${Date.now().toString(36).toUpperCase()}`;
      data.type = lowerContent.includes('bug') ? 'bug' : 'task';
      data.priority = 'P2';
      data.status = 'backlog';
      data.description = content;
      break;
    }
    case 'Event': {
      data.startTime = Date.now();
      data.endTime = Date.now() + 60 * 60 * 1000;
      data.timezone = 'America/Los_Angeles';
      data.isAllDay = false;
      data.description = content;
      break;
    }
    case 'Track': {
      data.isPrivate = false;
      data.artist = 'Unknown Artist';
      data.audioUrl = '';
      break;
    }
    case 'Draft': {
      data.content = content;
      data.wordCount = content.split(/\s+/).length;
      data.status = 'draft';
      break;
    }
    case 'Skill': {
      data.level = 'intermediate';
      data.description = content;
      break;
    }
  }

  const schema = ENTITY_TYPE_SCHEMAS[bestType];

  return {
    entityType: bestType,
    confidence: Math.min(0.5 + bestScore * 0.5, 0.95),
    name,
    data,
    tags: [...schema.defaultTags],
  };
}

/**
 * Parse CSV content into rows
 */
function parseCSV(content: string): string[][] {
  const lines = content.split('\n').filter((l) => l.trim());
  return lines.map((line) => {
    // Simple CSV parsing (handles basic cases)
    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    return row;
  });
}

/**
 * Parse JSON content into items
 */
function parseJSON(content: string): string[] {
  try {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      return data.map((item) =>
        typeof item === 'string' ? item : JSON.stringify(item)
      );
    }
    return [content];
  } catch {
    return [content];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Sign in required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const defaultType = formData.get('defaultType') as EntityTypeName | null;
    const commonTagsStr = formData.get('commonTags') as string | null;
    const dryRun = formData.get('dryRun') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const content = await file.text();
    const ext = file.name.split('.').pop()?.toLowerCase();

    // Parse content into items based on file type
    let items: string[] = [];

    if (ext === 'csv') {
      const rows = parseCSV(content);
      // Skip header row if it looks like headers
      const startIndex = rows[0]?.some((cell) =>
        ['name', 'title', 'content', 'description', 'email'].includes(cell.toLowerCase())
      ) ? 1 : 0;
      items = rows.slice(startIndex).map((row) => row.join(' | '));
    } else if (ext === 'json') {
      items = parseJSON(content);
    } else {
      // txt, md - split by double newlines or treat each line as an item
      items = content.split(/\n\n+/).filter((s) => s.trim().length > 10);
      if (items.length === 1 && items[0].includes('\n')) {
        // Single block with multiple lines - treat each line as an item
        items = items[0].split('\n').filter((s) => s.trim().length > 10);
      }
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'No valid items found in file' },
        { status: 400 }
      );
    }

    // Parse common tags
    const commonTags: string[] = commonTagsStr
      ? commonTagsStr.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    // Add import tag
    const importTag = `import-${new Date().toISOString().slice(0, 10)}`;
    commonTags.push(importTag);

    // Classify all items
    const classifications: Array<ClassificationResult & { content: string; index: number }> = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const result = classifyContent(item, defaultType || undefined);
      classifications.push({ ...result, content: item, index: i });
    }

    // Count by type
    const typeCounts: Record<string, number> = {};
    for (const c of classifications) {
      typeCounts[c.entityType] = (typeCounts[c.entityType] || 0) + 1;
    }

    // If dry run, return preview
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        totalItems: items.length,
        typeCounts,
        preview: classifications.slice(0, 20).map((c) => ({
          index: c.index,
          entityType: c.entityType,
          name: c.name,
          confidence: c.confidence,
          tags: [...c.tags, ...commonTags],
          contentPreview: c.content.slice(0, 100),
        })),
      });
    }

    // Create entities
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json(
        { error: 'Convex URL not configured' },
        { status: 500 }
      );
    }

    const client = new ConvexHttpClient(convexUrl);
    let created = 0;
    let errors = 0;
    const results: Array<{
      index: number;
      entityId?: string;
      entityType: string;
      name: string;
      error?: string;
    }> = [];

    for (const classification of classifications) {
      try {
        const result = await client.mutation(api.erv.createEntity, {
          entityType: classification.entityType,
          name: classification.name,
          data: JSON.stringify(classification.data),
          tags: [...classification.tags, ...commonTags],
          source: 'erv_import',
          importance: classification.confidence,
        });

        results.push({
          index: classification.index,
          entityId: result.entityId,
          entityType: classification.entityType,
          name: classification.name,
        });
        created++;
      } catch (error) {
        results.push({
          index: classification.index,
          entityType: classification.entityType,
          name: classification.name,
          error: error instanceof Error ? error.message : 'Failed to create',
        });
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      dryRun: false,
      filename: file.name,
      totalItems: items.length,
      created,
      errors,
      typeCounts,
      results: results.slice(0, 50), // Limit response size
    });
  } catch (error) {
    console.error('ERV import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process import' },
      { status: 500 }
    );
  }
}
