/**
 * Memory Upload API
 *
 * Handles file uploads for memory ingestion.
 * Uses AI (GPT-4o) to intelligently parse and structure memories.
 *
 * Supports: .txt, .md, .json, .csv, .zip (including ChatGPT exports)
 *
 * Also creates ERV entities alongside RLM memories for dual-system population.
 *
 * Admin-only endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, ADMIN_COOKIE } from '@/lib/passcodeAuth';
import { MemoryManager } from '@/lib/memory';
import { processLargeContent, type AIIngestionResult } from '@/lib/memory/ai-ingestion';
import { auth } from '@/lib/openclaw/auth-server';
import JSZip from 'jszip';
import { ConvexHttpClient } from '@/lib/convex-shim';
import { api } from '@/lib/convex-shim';

/**
 * SECURITY: Get authenticated user ID from session
 * Supports both Clerk auth and legacy admin cookie
 */
async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    // First check Clerk auth
    const { userId: clerkUserId } = await auth();
    if (clerkUserId) {
      return clerkUserId;
    }

    // Fallback to admin cookie
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE)?.value;
    const session = verifySession(token);
    if (session && session.type === 'admin') {
      return `admin-${session.subject}`;
    }

    return null;
  } catch {
    return null;
  }
}

// Initialize memory manager
const memoryManager = new MemoryManager();

// Supported file extensions
const SUPPORTED_EXTENSIONS = ['.txt', '.md', '.json', '.csv', '.zip'];

interface ProcessedFile {
  filename: string;
  content: string;
  size: number;
}

/**
 * Extract and process files from a ZIP archive
 */
async function processZipFile(zipData: ArrayBuffer, zipFilename: string): Promise<ProcessedFile[]> {
  const zip = await JSZip.loadAsync(zipData);
  const files: ProcessedFile[] = [];

  // Process each file in the ZIP
  for (const [path, zipEntry] of Object.entries(zip.files)) {
    // Skip directories
    if (zipEntry.dir) continue;

    // Get file extension
    const ext = '.' + path.split('.').pop()?.toLowerCase();

    // Only process supported text-based files
    if (!['.txt', '.md', '.json', '.csv'].includes(ext)) continue;

    // Skip very small files (likely empty or metadata)
    if ((zipEntry as JSZip.JSZipObject).comment?.length || 0 > 0) continue;

    try {
      const content = await (zipEntry as JSZip.JSZipObject).async('string');

      // Skip empty or very small files
      if (content.length < 50) continue;

      // Skip files that look like metadata
      const filename = path.split('/').pop() || path;
      if (filename.startsWith('.') || filename === 'metadata.json') continue;

      files.push({
        filename: `${zipFilename}/${path}`,
        content,
        size: content.length,
      });
    } catch {
      // Skip files that can't be read as text
      console.warn(`Skipping file ${path}: could not read as text`);
    }
  }

  return files;
}

/**
 * Process ChatGPT export format specifically
 * ChatGPT exports have a conversations.json with a specific structure
 */
function processChatGPTExport(content: string, filename: string): string {
  try {
    const data = JSON.parse(content);

    // Check if this looks like a ChatGPT conversations export
    if (Array.isArray(data) && data.length > 0 && data[0].mapping) {
      // This is a ChatGPT conversations.json file
      const conversations: string[] = [];

      for (const conversation of data) {
        if (!conversation.mapping) continue;

        const title = conversation.title || 'Untitled Conversation';
        const messages: string[] = [`## ${title}\n`];

        // Extract messages from the mapping
        for (const node of Object.values(conversation.mapping) as any[]) {
          if (!node.message) continue;

          const msg = node.message;
          const role = msg.author?.role || 'unknown';
          const content = msg.content?.parts?.join('\n') || '';

          if (content && role !== 'system') {
            messages.push(`**${role === 'user' ? 'You' : 'Assistant'}:** ${content}\n`);
          }
        }

        if (messages.length > 1) {
          conversations.push(messages.join('\n'));
        }
      }

      return conversations.join('\n\n---\n\n');
    }

    // Not a ChatGPT format, return original
    return content;
  } catch {
    // Not valid JSON or parsing failed, return original
    return content;
  }
}

/**
 * Process a single file and extract memories
 */
async function processFile(
  content: string,
  filename: string,
  useAI: boolean
): Promise<AIIngestionResult> {
  // Check if this might be a ChatGPT export
  if (filename.toLowerCase().includes('conversations.json') ||
      filename.toLowerCase().includes('chatgpt')) {
    content = processChatGPTExport(content, filename);
  }

  if (useAI) {
    return processLargeContent(content, filename);
  } else {
    return extractWithHeuristics(content, filename);
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Get authenticated user ID from session
    const authenticatedUserId = await getAuthenticatedUserId();
    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const useAI = formData.get('useAI') !== 'false'; // Default to AI processing

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    // Validate file type
    if (!SUPPORTED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${SUPPORTED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    // Collect all files to process
    let filesToProcess: ProcessedFile[] = [];

    if (fileExtension === '.zip') {
      // Handle ZIP files
      const zipData = await file.arrayBuffer();
      filesToProcess = await processZipFile(zipData, file.name);

      if (filesToProcess.length === 0) {
        return NextResponse.json(
          { error: 'No supported files found in ZIP archive' },
          { status: 400 }
        );
      }
    } else {
      // Handle single files
      const content = await file.text();

      if (content.length < 50) {
        return NextResponse.json(
          { error: 'File content too short (minimum 50 characters)' },
          { status: 400 }
        );
      }

      filesToProcess = [{
        filename: file.name,
        content,
        size: content.length,
      }];
    }

    // Process all files and collect results
    const allResults: AIIngestionResult = {
      episodicMemories: [],
      semanticMemories: [],
      summary: '',
      processingNotes: [],
    };

    const fileResults: { filename: string; episodic: number; semantic: number }[] = [];

    for (const fileToProcess of filesToProcess) {
      const result = await processFile(
        fileToProcess.content,
        fileToProcess.filename,
        useAI
      );

      allResults.episodicMemories.push(...result.episodicMemories);
      allResults.semanticMemories.push(...result.semanticMemories);
      allResults.processingNotes.push(...result.processingNotes);

      fileResults.push({
        filename: fileToProcess.filename,
        episodic: result.episodicMemories.length,
        semantic: result.semanticMemories.length,
      });
    }

    // Deduplicate semantic memories by key (keep highest confidence)
    const semanticByKey = new Map<string, typeof allResults.semanticMemories[0]>();
    for (const mem of allResults.semanticMemories) {
      const existing = semanticByKey.get(mem.key);
      if (!existing || mem.confidence > existing.confidence) {
        semanticByKey.set(mem.key, mem);
      }
    }
    allResults.semanticMemories = Array.from(semanticByKey.values());

    // Store episodic memories
    let episodicStored = 0;
    for (const memory of allResults.episodicMemories) {
      try {
        await memoryManager.storeEpisodicMemory(
          authenticatedUserId,
          memory.content,
          memory.memoryType,
          memory.importance,
          undefined, // projectId
          {
            toolsUsed: ['file_upload', useAI ? 'ai_extraction' : 'heuristic_extraction'],
            outcome: memory.context || `Imported from ${file.name}`,
          }
        );
        episodicStored++;
      } catch (error) {
        console.error('Failed to store episodic memory:', error);
      }
    }

    // Store semantic memories
    let semanticStored = 0;
    for (const memory of allResults.semanticMemories) {
      try {
        await memoryManager.upsertSemanticMemory(
          authenticatedUserId,
          memory.category,
          memory.key,
          memory.value,
          memory.confidence,
          memory.source || `file_upload:${file.name}`
        );
        semanticStored++;
      } catch (error) {
        console.error('Failed to store semantic memory:', error);
      }
    }

    // Also create ERV entities for dual-system population
    let entitiesCreated = 0;
    const createEntities = formData.get('createEntities') !== 'false'; // Default to true

    if (createEntities) {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (convexUrl) {
        const convexClient = new ConvexHttpClient(convexUrl);
        const importTag = `import-${new Date().toISOString().slice(0, 10)}`;
        const sourceTag = `source-${file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

        // Create Memory entities from episodic memories
        for (const memory of allResults.episodicMemories) {
          try {
            await convexClient.mutation(api.erv.createEntity, {
              entityType: 'Memory',
              name: memory.content.slice(0, 60) + (memory.content.length > 60 ? '...' : ''),
              data: JSON.stringify({
                memoryType: memory.memoryType,
                content: memory.content,
                importance: memory.importance,
                timestamp: Date.now(),
                context: memory.context || `Imported from ${file.name}`,
              }),
              tags: ['memory', importTag, sourceTag],
              source: 'file_upload',
              importance: memory.importance,
            });
            entitiesCreated++;
          } catch (error) {
            console.error('Failed to create ERV entity:', error);
          }
        }
      }
    }

    // Build summary
    const totalExtracted = allResults.episodicMemories.length + allResults.semanticMemories.length;
    allResults.summary = fileExtension === '.zip'
      ? `Processed ${filesToProcess.length} files from ${file.name}: extracted ${totalExtracted} memories`
      : `Processed ${file.name}: extracted ${totalExtracted} memories`;

    return NextResponse.json({
      success: true,
      filename: file.name,
      processingMode: useAI ? 'ai' : 'heuristic',
      summary: allResults.summary,
      filesProcessed: filesToProcess.length,
      fileDetails: fileResults,
      extracted: {
        episodic: allResults.episodicMemories.length,
        semantic: allResults.semanticMemories.length,
      },
      stored: {
        episodic: episodicStored,
        semantic: semanticStored,
        entities: entitiesCreated,
      },
      processingNotes: allResults.processingNotes.slice(0, 10), // Limit notes
    });
  } catch (error) {
    console.error('Memory upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
}

/**
 * Fallback heuristic-based extraction (no AI)
 */
function extractWithHeuristics(content: string, filename: string): AIIngestionResult {
  const episodicMemories: AIIngestionResult['episodicMemories'] = [];
  const semanticMemories: AIIngestionResult['semanticMemories'] = [];

  // Split into paragraphs/sections
  const sections = content.split(/\n\n+/).filter(s => s.trim().length > 20);

  for (const section of sections) {
    const trimmed = section.trim();
    if (trimmed.length < 20 || trimmed.length > 2000) continue;

    const lowerContent = trimmed.toLowerCase();
    let memoryType: 'interaction' | 'decision' | 'preference' | 'feedback' | 'milestone' = 'interaction';
    let importance = 0.5;

    // Classify memory type
    if (/decided|chose|selected|picked|went with|option|decision/i.test(lowerContent)) {
      memoryType = 'decision';
      importance = 0.7;
    } else if (/prefer|like|love|favorite|enjoy|rather|better when/i.test(lowerContent)) {
      memoryType = 'preference';
      importance = 0.8;
    } else if (/feedback|review|thanks|great|perfect|issue|problem|bug/i.test(lowerContent)) {
      memoryType = 'feedback';
      importance = 0.6;
    } else if (/shipped|launched|completed|finished|released|deployed|milestone|achievement/i.test(lowerContent)) {
      memoryType = 'milestone';
      importance = 0.9;
    }

    // Boost importance for certain patterns
    if (/important|critical|key|essential|must|always|never/i.test(lowerContent)) {
      importance = Math.min(1, importance + 0.1);
    }

    episodicMemories.push({
      content: `[From ${filename}] ${trimmed.slice(0, 300)}`,
      memoryType,
      importance,
    });

    // Limit to 100 memories per file
    if (episodicMemories.length >= 100) break;
  }

  return {
    episodicMemories,
    semanticMemories,
    summary: `Processed ${filename} with heuristics (${episodicMemories.length} memories extracted)`,
    processingNotes: ['Used heuristic extraction - AI processing disabled'],
  };
}
