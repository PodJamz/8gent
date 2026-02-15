/**
 * Docs Library
 *
 * Parses the /docs folder structure into navigable documentation.
 * Notion-inspired: clean, typography-first, effortlessly navigable.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface DocMeta {
  title: string;
  description?: string;
  order?: number;
  icon?: string;
}

export interface DocNode {
  slug: string;
  path: string;
  title: string;
  description?: string;
  icon?: string;
  type: 'file' | 'folder';
  children?: DocNode[];
  content?: string;
  headings?: Array<{ level: number; text: string; slug: string }>;
}

export interface DocsTree {
  nodes: DocNode[];
  flatList: DocNode[];
}

const DOCS_PATH = path.join(process.cwd(), 'docs');

// Icons for folder categories
const FOLDER_ICONS: Record<string, string> = {
  'philosophy': 'compass',
  'getting-started': 'rocket',
  'architecture': 'cpu',
  'features': 'sparkles',
  'completed': 'check-circle',
  'roadmap': 'map',
  'reference': 'book-open',
  'planning': 'calendar',
  'personal': 'user',
  'claw-ai': 'bot',
  'apps': 'grid-3x3',
  'design-system': 'palette',
  'integrations': 'plug',
};

// Pretty names for folders
const FOLDER_NAMES: Record<string, string> = {
  'philosophy': 'Philosophy',
  'getting-started': 'Getting Started',
  'architecture': 'Architecture',
  'features': 'Features',
  'completed': 'Completed',
  'roadmap': 'Roadmap',
  'reference': 'Reference',
  'planning': 'Planning',
  'personal': 'Personal',
  'claw-ai': 'Claw AI',
  'apps': 'Apps',
  'design-system': 'Design System',
  'integrations': 'Integrations',
  'images': 'Images',
};

/**
 * Convert filename to title
 */
function fileNameToTitle(fileName: string): string {
  return fileName
    .replace(/\.md$/, '')
    .replace(/^README$/i, 'Overview')
    .replace(/^PRD[-_]/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bPrd\b/g, 'PRD')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bRag\b/g, 'RAG')
    .replace(/\bUi\b/g, 'UI')
    .replace(/\bUx\b/g, 'UX');
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): Array<{ level: number; text: string; slug: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; slug: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ level, text, slug });
  }

  return headings;
}

/**
 * Read a single markdown file
 */
function readMarkdownFile(filePath: string): { content: string; meta: DocMeta; headings: Array<{ level: number; text: string; slug: string }> } | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const headings = extractHeadings(content);

    // Extract title from first h1 if not in frontmatter
    let title = data.title;
    if (!title) {
      const h1Match = content.match(/^#\s+(.+)$/m);
      title = h1Match ? h1Match[1] : fileNameToTitle(path.basename(filePath));
    }

    return {
      content,
      meta: {
        title,
        description: data.description,
        order: data.order,
        icon: data.icon,
      },
      headings,
    };
  } catch {
    return null;
  }
}

/**
 * Recursively build docs tree from filesystem
 */
function buildDocsTree(dirPath: string, basePath: string = ''): DocNode[] {
  const nodes: DocNode[] = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    // Sort: folders first, then files, READMEs first
    const sortedEntries = entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      if (a.name.toLowerCase() === 'readme.md') return -1;
      if (b.name.toLowerCase() === 'readme.md') return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of sortedEntries) {
      const entryPath = path.join(dirPath, entry.name);
      const relativePath = path.join(basePath, entry.name);

      // Skip non-markdown files (except folders)
      if (!entry.isDirectory() && !entry.name.endsWith('.md')) continue;

      // Skip hidden files and archive folder
      if (entry.name.startsWith('.')) continue;
      if (entry.name === 'archive') continue;

      if (entry.isDirectory()) {
        const children = buildDocsTree(entryPath, relativePath);

        // Only include folders that have content
        if (children.length > 0) {
          const folderName = entry.name.toLowerCase();
          nodes.push({
            slug: entry.name,
            path: relativePath,
            title: FOLDER_NAMES[folderName] || fileNameToTitle(entry.name),
            icon: FOLDER_ICONS[folderName],
            type: 'folder',
            children,
          });
        }
      } else {
        const fileData = readMarkdownFile(entryPath);
        if (fileData) {
          const slug = entry.name.replace(/\.md$/, '');
          const isReadme = slug.toLowerCase() === 'readme';

          nodes.push({
            slug: isReadme ? 'index' : slug,
            path: relativePath.replace(/\.md$/, ''),
            title: fileData.meta.title,
            description: fileData.meta.description,
            icon: fileData.meta.icon,
            type: 'file',
            content: fileData.content,
            headings: fileData.headings,
          });
        }
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return nodes;
}

/**
 * Flatten the tree for search and navigation
 */
function flattenTree(nodes: DocNode[], parentPath: string = ''): DocNode[] {
  const flat: DocNode[] = [];

  for (const node of nodes) {
    if (node.type === 'file') {
      flat.push({
        ...node,
        path: parentPath ? `${parentPath}/${node.slug}` : node.slug,
      });
    }
    if (node.children) {
      const childPath = parentPath ? `${parentPath}/${node.slug}` : node.slug;
      flat.push(...flattenTree(node.children, childPath));
    }
  }

  return flat;
}

/**
 * Get the full docs tree
 */
export function getDocsTree(): DocsTree {
  const nodes = buildDocsTree(DOCS_PATH);
  const flatList = flattenTree(nodes);
  return { nodes, flatList };
}

/**
 * Get a single doc by path
 */
export function getDocByPath(docPath: string): DocNode | null {
  const { flatList } = getDocsTree();

  // Normalize path
  const normalizedPath = docPath
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\/index$/, '');

  // Try exact match first
  let doc = flatList.find(d => d.path === normalizedPath || d.path === `${normalizedPath}/index`);

  // Try with README
  if (!doc) {
    doc = flatList.find(d => d.path === `${normalizedPath}/README` || d.slug === normalizedPath);
  }

  return doc || null;
}

/**
 * Get all doc paths for static generation
 */
export function getAllDocPaths(): string[] {
  const { flatList } = getDocsTree();
  return flatList.map(doc => doc.path);
}

/**
 * Search docs by query
 */
export function searchDocs(query: string): DocNode[] {
  if (!query.trim()) return [];

  const { flatList } = getDocsTree();
  const lowerQuery = query.toLowerCase();

  return flatList.filter(doc => {
    const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
    const contentMatch = doc.content?.toLowerCase().includes(lowerQuery);
    const descMatch = doc.description?.toLowerCase().includes(lowerQuery);
    return titleMatch || contentMatch || descMatch;
  }).slice(0, 10); // Limit results
}

/**
 * Get breadcrumbs for a doc path
 */
export function getBreadcrumbs(docPath: string): Array<{ title: string; path: string }> {
  const parts = docPath.split('/').filter(Boolean);
  const breadcrumbs: Array<{ title: string; path: string }> = [
    { title: 'Docs', path: '/wiki' },
  ];

  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    const folderName = FOLDER_NAMES[part.toLowerCase()] || fileNameToTitle(part);
    breadcrumbs.push({
      title: folderName,
      path: `/wiki${currentPath}`,
    });
  }

  return breadcrumbs;
}
