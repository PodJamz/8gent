/**
 * Skill Ingestion Pipeline
 *
 * Formal, deterministic skill ingestion following Autoship discipline.
 *
 * Principles:
 * - skill.md is the source of truth
 * - Parsing must be strict, validated, versioned
 * - Produces ERV entities, relationships, tool bindings
 * - Audit trail for skill changes
 *
 * @version 0.1.0
 * @since 2026-02-03
 */

// =============================================================================
// Skill Definition Types
// =============================================================================

/**
 * Skill metadata extracted from frontmatter.
 */
export interface SkillMetadata {
  /** Unique skill identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Short description */
  description: string;

  /** Skill version (semver) */
  version: string;

  /** Author/maintainer */
  author?: string;

  /** Category for grouping */
  category: SkillCategory;

  /** Tags for search */
  tags: string[];

  /** Priority for skill selection (higher = more important) */
  priority?: number;

  /** When this skill should be activated */
  triggers?: SkillTrigger[];

  /** Dependencies on other skills */
  dependencies?: string[];

  /** Whether this skill is enabled by default */
  enabledByDefault?: boolean;

  /** Stability level */
  stability: "stable" | "experimental" | "exploratory";
}

export type SkillCategory =
  | "development"
  | "design"
  | "productivity"
  | "security"
  | "infrastructure"
  | "creative"
  | "analysis"
  | "communication"
  | "other";

export interface SkillTrigger {
  /** Type of trigger */
  type: "keyword" | "context" | "tool" | "entity" | "pattern";

  /** Value to match */
  value: string;

  /** Whether this is a required trigger (all must match) */
  required?: boolean;
}

/**
 * Tool binding defined in a skill.
 */
export interface SkillToolBinding {
  /** Tool name to bind */
  toolName: string;

  /** Custom instructions for this tool in this skill context */
  instructions?: string;

  /** Parameters to pre-fill */
  defaultParameters?: Record<string, unknown>;

  /** Whether tool is required for this skill */
  required?: boolean;
}

/**
 * Complete parsed skill definition.
 */
export interface SkillDefinition {
  /** Metadata from frontmatter */
  metadata: SkillMetadata;

  /** Raw markdown content (after frontmatter) */
  content: string;

  /** Parsed sections */
  sections: SkillSection[];

  /** Tool bindings */
  tools: SkillToolBinding[];

  /** Examples extracted from content */
  examples: SkillExample[];

  /** Validation result */
  validation: SkillValidationResult;

  /** Checksum of source file */
  sourceChecksum: string;

  /** When this skill was parsed */
  parsedAt: number;
}

export interface SkillSection {
  /** Section heading */
  heading: string;

  /** Section level (1-6) */
  level: number;

  /** Section content */
  content: string;

  /** Code blocks in this section */
  codeBlocks: {
    language?: string;
    content: string;
  }[];
}

export interface SkillExample {
  /** Example title/description */
  title?: string;

  /** Input/trigger */
  input: string;

  /** Expected output/behavior */
  output: string;

  /** Whether this is a negative example (what not to do) */
  isNegative?: boolean;
}

// =============================================================================
// Validation Types
// =============================================================================

export interface SkillValidationResult {
  /** Whether skill is valid */
  valid: boolean;

  /** Validation errors */
  errors: SkillValidationError[];

  /** Validation warnings */
  warnings: SkillValidationWarning[];

  /** Schema version used for validation */
  schemaVersion: string;
}

export interface SkillValidationError {
  field: string;
  message: string;
  code: SkillValidationErrorCode;
  severity: "error";
}

export interface SkillValidationWarning {
  field: string;
  message: string;
  code: SkillValidationErrorCode;
  severity: "warning";
  suggestion?: string;
}

export type SkillValidationErrorCode =
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_VERSION"
  | "INVALID_CATEGORY"
  | "INVALID_TRIGGER"
  | "DUPLICATE_ID"
  | "DEPENDENCY_NOT_FOUND"
  | "CIRCULAR_DEPENDENCY"
  | "INVALID_TOOL_BINDING"
  | "CONTENT_TOO_SHORT"
  | "NO_EXAMPLES"
  | "INVALID_FRONTMATTER";

// =============================================================================
// Ingestion Pipeline
// =============================================================================

/**
 * Parse skill file content into a SkillDefinition.
 */
export function parseSkill(
  fileContent: string,
  fileName: string,
  existingSkillIds: Set<string> = new Set()
): SkillDefinition {
  const errors: SkillValidationError[] = [];
  const warnings: SkillValidationWarning[] = [];

  // Extract frontmatter
  const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
  let metadata: Partial<SkillMetadata> = {};
  let content = fileContent;

  if (frontmatterMatch) {
    try {
      metadata = parseFrontmatter(frontmatterMatch[1]);
      content = fileContent.slice(frontmatterMatch[0].length).trim();
    } catch {
      errors.push({
        field: "frontmatter",
        message: "Failed to parse frontmatter YAML",
        code: "INVALID_FRONTMATTER",
        severity: "error",
      });
    }
  } else {
    // Try to infer metadata from content
    metadata = inferMetadataFromContent(content, fileName);
    warnings.push({
      field: "frontmatter",
      message: "No frontmatter found, metadata inferred from content",
      code: "MISSING_REQUIRED_FIELD",
      severity: "warning",
      suggestion: "Add YAML frontmatter with id, name, version, category",
    });
  }

  // Validate required fields
  if (!metadata.id) {
    metadata.id = generateSkillId(fileName);
    warnings.push({
      field: "id",
      message: "Missing skill ID, generated from filename",
      code: "MISSING_REQUIRED_FIELD",
      severity: "warning",
    });
  }

  if (!metadata.name) {
    metadata.name = metadata.id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    warnings.push({
      field: "name",
      message: "Missing skill name, generated from ID",
      code: "MISSING_REQUIRED_FIELD",
      severity: "warning",
    });
  }

  if (!metadata.version) {
    metadata.version = "0.1.0";
    warnings.push({
      field: "version",
      message: "Missing version, defaulting to 0.1.0",
      code: "MISSING_REQUIRED_FIELD",
      severity: "warning",
    });
  }

  if (!metadata.category) {
    metadata.category = inferCategory(content);
    warnings.push({
      field: "category",
      message: `Missing category, inferred as "${metadata.category}"`,
      code: "MISSING_REQUIRED_FIELD",
      severity: "warning",
    });
  }

  // Check for duplicate ID
  if (existingSkillIds.has(metadata.id)) {
    errors.push({
      field: "id",
      message: `Duplicate skill ID: ${metadata.id}`,
      code: "DUPLICATE_ID",
      severity: "error",
    });
  }

  // Validate version format
  if (!isValidSemver(metadata.version)) {
    errors.push({
      field: "version",
      message: `Invalid version format: ${metadata.version}`,
      code: "INVALID_VERSION",
      severity: "error",
    });
  }

  // Validate category
  const validCategories: SkillCategory[] = [
    "development", "design", "productivity", "security",
    "infrastructure", "creative", "analysis", "communication", "other",
  ];
  if (!validCategories.includes(metadata.category as SkillCategory)) {
    warnings.push({
      field: "category",
      message: `Unknown category "${metadata.category}", using "other"`,
      code: "INVALID_CATEGORY",
      severity: "warning",
    });
    metadata.category = "other";
  }

  // Parse sections
  const sections = parseSections(content);

  // Extract tool bindings
  const tools = extractToolBindings(content);

  // Extract examples
  const examples = extractExamples(content);

  // Content quality checks
  if (content.length < 100) {
    warnings.push({
      field: "content",
      message: "Skill content is very short (< 100 chars)",
      code: "CONTENT_TOO_SHORT",
      severity: "warning",
      suggestion: "Add more detailed instructions and examples",
    });
  }

  if (examples.length === 0) {
    warnings.push({
      field: "examples",
      message: "No examples found in skill content",
      code: "NO_EXAMPLES",
      severity: "warning",
      suggestion: "Add <example> blocks to demonstrate skill usage",
    });
  }

  // Generate checksum
  const sourceChecksum = generateChecksum(fileContent);

  // Compile full metadata with defaults
  const fullMetadata: SkillMetadata = {
    id: metadata.id,
    name: metadata.name,
    description: metadata.description || extractFirstParagraph(content),
    version: metadata.version,
    author: metadata.author,
    category: metadata.category as SkillCategory,
    tags: metadata.tags || [],
    priority: metadata.priority ?? 5,
    triggers: metadata.triggers || [],
    dependencies: metadata.dependencies || [],
    enabledByDefault: metadata.enabledByDefault ?? true,
    stability: metadata.stability || "experimental",
  };

  return {
    metadata: fullMetadata,
    content,
    sections,
    tools,
    examples,
    validation: {
      valid: errors.length === 0,
      errors,
      warnings,
      schemaVersion: "0.1.0",
    },
    sourceChecksum,
    parsedAt: Date.now(),
  };
}

/**
 * Parse simple YAML frontmatter.
 */
function parseFrontmatter(yaml: string): Partial<SkillMetadata> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split("\n");

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      // Handle arrays
      if (value.startsWith("[") && value.endsWith("]")) {
        result[key] = value.slice(1, -1).split(",").map(s => s.trim().replace(/['"]/g, ""));
      } else if (value === "true") {
        result[key] = true;
      } else if (value === "false") {
        result[key] = false;
      } else if (!isNaN(Number(value))) {
        result[key] = Number(value);
      } else {
        result[key] = value.replace(/['"]/g, "");
      }
    }
  }

  return result as Partial<SkillMetadata>;
}

/**
 * Infer metadata from content when frontmatter is missing.
 */
function inferMetadataFromContent(content: string, fileName: string): Partial<SkillMetadata> {
  // Extract first heading as name
  const headingMatch = content.match(/^#\s+(.+)$/m);
  const name = headingMatch ? headingMatch[1] : undefined;

  return {
    id: generateSkillId(fileName),
    name,
    category: inferCategory(content),
    tags: extractTags(content),
    stability: "experimental",
  };
}

/**
 * Generate skill ID from filename.
 */
function generateSkillId(fileName: string): string {
  return fileName
    .replace(/\.(md|txt)$/i, "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .toLowerCase();
}

/**
 * Infer category from content keywords.
 */
function inferCategory(content: string): SkillCategory {
  const lower = content.toLowerCase();

  if (/react|typescript|code|programming|api/.test(lower)) return "development";
  if (/design|ui|ux|layout|color/.test(lower)) return "design";
  if (/security|vulnerability|auth|encryption/.test(lower)) return "security";
  if (/infrastructure|deploy|kubernetes|docker/.test(lower)) return "infrastructure";
  if (/writing|story|creative|art/.test(lower)) return "creative";
  if (/analysis|data|metrics|research/.test(lower)) return "analysis";
  if (/todo|task|productivity|workflow/.test(lower)) return "productivity";
  if (/chat|message|communication/.test(lower)) return "communication";

  return "other";
}

/**
 * Extract tags from content.
 */
function extractTags(content: string): string[] {
  const tags: Set<string> = new Set();

  // Look for hashtags
  const hashtagMatches = content.match(/#[a-zA-Z]\w+/g);
  if (hashtagMatches) {
    for (const tag of hashtagMatches) {
      tags.add(tag.slice(1).toLowerCase());
    }
  }

  // Look for common technical terms
  const techTerms = ["react", "typescript", "node", "python", "api", "ui", "ux", "ai", "ml"];
  const lower = content.toLowerCase();
  for (const term of techTerms) {
    if (lower.includes(term)) {
      tags.add(term);
    }
  }

  return Array.from(tags);
}

/**
 * Parse markdown sections.
 */
function parseSections(content: string): SkillSection[] {
  const sections: SkillSection[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let lastIndex = 0;
  let currentSection: SkillSection | null = null;

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    // Save previous section
    if (currentSection) {
      currentSection.content = content.slice(lastIndex, match.index).trim();
      currentSection.codeBlocks = extractCodeBlocks(currentSection.content);
      sections.push(currentSection);
    }

    currentSection = {
      heading: match[2],
      level: match[1].length,
      content: "",
      codeBlocks: [],
    };
    lastIndex = match.index + match[0].length;
  }

  // Save final section
  if (currentSection) {
    currentSection.content = content.slice(lastIndex).trim();
    currentSection.codeBlocks = extractCodeBlocks(currentSection.content);
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Extract code blocks from content.
 */
function extractCodeBlocks(content: string): { language?: string; content: string }[] {
  const blocks: { language?: string; content: string }[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || undefined,
      content: match[2].trim(),
    });
  }

  return blocks;
}

/**
 * Extract tool bindings from content.
 */
function extractToolBindings(content: string): SkillToolBinding[] {
  const bindings: SkillToolBinding[] = [];

  // Look for tool references in various formats
  // Format 1: `tool_name` - tool description
  const toolRefRegex = /`([\w_]+)`\s*[-:]?\s*([^\n]+)/g;
  let match;

  while ((match = toolRefRegex.exec(content)) !== null) {
    const toolName = match[1];
    const description = match[2];

    // Filter to likely tool names
    if (toolName.includes("_") || /^(create|get|list|update|delete|search|navigate)/.test(toolName)) {
      bindings.push({
        toolName,
        instructions: description,
      });
    }
  }

  return bindings;
}

/**
 * Extract examples from content.
 */
function extractExamples(content: string): SkillExample[] {
  const examples: SkillExample[] = [];

  // Format 1: <example>...</example> blocks
  const exampleBlockRegex = /<example>[\s\S]*?<\/example>/g;
  let match;

  while ((match = exampleBlockRegex.exec(content)) !== null) {
    const block = match[0];
    const userMatch = block.match(/user:\s*["']?([^"'\n]+)/i);
    const assistantMatch = block.match(/assistant:\s*["']?([^"'\n]+)/i);

    if (userMatch && assistantMatch) {
      examples.push({
        input: userMatch[1],
        output: assistantMatch[1],
      });
    }
  }

  // Format 2: Input/Output pairs
  const ioRegex = /(?:input|user|query):\s*(.+)\n(?:output|response|assistant):\s*(.+)/gi;
  while ((match = ioRegex.exec(content)) !== null) {
    examples.push({
      input: match[1].trim(),
      output: match[2].trim(),
    });
  }

  return examples;
}

/**
 * Extract first paragraph for description.
 */
function extractFirstParagraph(content: string): string {
  // Skip any headings at the start
  const withoutHeadings = content.replace(/^#.*\n/gm, "").trim();
  const paragraphs = withoutHeadings.split(/\n\n+/);

  if (paragraphs.length > 0) {
    return paragraphs[0].replace(/\n/g, " ").trim().slice(0, 200);
  }

  return "";
}

/**
 * Validate semver format.
 */
function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/.test(version);
}

/**
 * Generate simple checksum of content.
 */
function generateChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// =============================================================================
// Skill Registry
// =============================================================================

/**
 * In-memory skill registry.
 */
export class SkillRegistry {
  private skills: Map<string, SkillDefinition> = new Map();
  private auditLog: SkillAuditEntry[] = [];

  /**
   * Register a skill.
   */
  register(skill: SkillDefinition): void {
    const previousSkill = this.skills.get(skill.metadata.id);

    this.skills.set(skill.metadata.id, skill);

    // Audit log
    this.auditLog.push({
      action: previousSkill ? "updated" : "registered",
      skillId: skill.metadata.id,
      version: skill.metadata.version,
      previousVersion: previousSkill?.metadata.version,
      timestamp: Date.now(),
      checksum: skill.sourceChecksum,
    });
  }

  /**
   * Unregister a skill.
   */
  unregister(skillId: string): boolean {
    const skill = this.skills.get(skillId);
    if (!skill) return false;

    this.skills.delete(skillId);

    this.auditLog.push({
      action: "unregistered",
      skillId,
      version: skill.metadata.version,
      timestamp: Date.now(),
      checksum: skill.sourceChecksum,
    });

    return true;
  }

  /**
   * Get a skill by ID.
   */
  get(skillId: string): SkillDefinition | undefined {
    return this.skills.get(skillId);
  }

  /**
   * Get all skills.
   */
  getAll(): SkillDefinition[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get skills by category.
   */
  getByCategory(category: SkillCategory): SkillDefinition[] {
    return this.getAll().filter(s => s.metadata.category === category);
  }

  /**
   * Get skills matching triggers.
   */
  getMatchingSkills(context: {
    keywords?: string[];
    tools?: string[];
    entityTypes?: string[];
  }): SkillDefinition[] {
    return this.getAll().filter(skill => {
      if (!skill.metadata.triggers || skill.metadata.triggers.length === 0) {
        return false;
      }

      return skill.metadata.triggers.some(trigger => {
        switch (trigger.type) {
          case "keyword":
            return context.keywords?.some(k =>
              k.toLowerCase().includes(trigger.value.toLowerCase())
            );
          case "tool":
            return context.tools?.includes(trigger.value);
          case "entity":
            return context.entityTypes?.includes(trigger.value);
          default:
            return false;
        }
      });
    });
  }

  /**
   * Get audit log.
   */
  getAuditLog(): SkillAuditEntry[] {
    return [...this.auditLog];
  }

  /**
   * Export registry state.
   */
  export(): SkillRegistryExport {
    return {
      version: "0.1.0",
      exportedAt: Date.now(),
      skills: this.getAll().map(s => ({
        id: s.metadata.id,
        name: s.metadata.name,
        version: s.metadata.version,
        category: s.metadata.category,
        stability: s.metadata.stability,
        checksum: s.sourceChecksum,
      })),
      auditLog: this.auditLog,
    };
  }
}

export interface SkillAuditEntry {
  action: "registered" | "updated" | "unregistered";
  skillId: string;
  version: string;
  previousVersion?: string;
  timestamp: number;
  checksum: string;
}

export interface SkillRegistryExport {
  version: string;
  exportedAt: number;
  skills: {
    id: string;
    name: string;
    version: string;
    category: SkillCategory;
    stability: string;
    checksum: string;
  }[];
  auditLog: SkillAuditEntry[];
}

// =============================================================================
// Singleton Instance
// =============================================================================

let registryInstance: SkillRegistry | null = null;

export function getSkillRegistry(): SkillRegistry {
  if (!registryInstance) {
    registryInstance = new SkillRegistry();
  }
  return registryInstance;
}

export function resetSkillRegistry(): void {
  registryInstance = null;
}
