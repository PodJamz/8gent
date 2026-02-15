/**
 * Claw AI Search - Portfolio content search
 *
 * MVP implementation using keyword-based search.
 * Future: Add vector embeddings with Convex for semantic search.
 */

import { DATA } from '@/data/resume';
import { themes } from '@/lib/themes/definitions';

// Types for searchable content
export interface SearchResult {
  id: string;
  type: 'project' | 'skill' | 'work' | 'education' | 'theme' | 'about';
  title: string;
  description: string;
  url?: string;
  relevance: number;
  metadata?: Record<string, unknown>;
}

export interface SearchOptions {
  category?: 'projects' | 'skills' | 'work' | 'education' | 'themes' | 'all';
  limit?: number;
}

// Normalize text for search
function normalize(text: string): string {
  return text.toLowerCase().trim();
}

// Calculate relevance score based on keyword matches
function calculateRelevance(text: string, query: string): number {
  const normalizedText = normalize(text);
  const normalizedQuery = normalize(query);
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  let score = 0;

  // Exact match gets highest score
  if (normalizedText.includes(normalizedQuery)) {
    score += 10;
  }

  // Word-by-word matching
  for (const word of queryWords) {
    if (word.length < 2) continue;

    // Exact word match
    if (normalizedText.includes(word)) {
      score += 3;
    }

    // Partial match (for technologies like "react" in "reactjs")
    const words = normalizedText.split(/\s+/);
    for (const textWord of words) {
      if (textWord.startsWith(word) || word.startsWith(textWord)) {
        score += 1;
      }
    }
  }

  return score;
}

// Search projects
function searchProjects(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const project of DATA.projects) {
    const searchText = [
      project.title,
      project.description,
      ...project.technologies,
    ].join(' ');

    const relevance = calculateRelevance(searchText, query);

    if (relevance > 0) {
      results.push({
        id: `project-${project.title.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'project',
        title: project.title,
        description: project.description,
        url: project.href,
        relevance,
        metadata: {
          technologies: project.technologies,
          dates: project.dates,
          active: project.active,
        },
      });
    }
  }

  return results;
}

// Search skills
function searchSkills(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const normalizedQuery = normalize(query);

  for (const skill of DATA.skills) {
    const relevance = calculateRelevance(skill, query);

    // Also check for partial matches on skills
    if (relevance > 0 || normalize(skill).includes(normalizedQuery)) {
      results.push({
        id: `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'skill',
        title: skill,
        description: `James has expertise in ${skill}`,
        relevance: relevance > 0 ? relevance : 2,
      });
    }
  }

  return results;
}

// Search work experience
function searchWork(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const job of DATA.work) {
    const searchText = [
      job.company,
      job.title,
      job.description,
      job.location,
    ].join(' ');

    const relevance = calculateRelevance(searchText, query);

    if (relevance > 0) {
      results.push({
        id: `work-${job.company.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'work',
        title: `${job.title} at ${job.company}`,
        description: job.description,
        url: job.href || undefined,
        relevance,
        metadata: {
          company: job.company,
          title: job.title,
          location: job.location,
          start: job.start,
          end: job.end,
        },
      });
    }
  }

  return results;
}

// Search education
function searchEducation(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const edu of DATA.education) {
    const searchText = [edu.school, edu.degree].join(' ');

    const relevance = calculateRelevance(searchText, query);

    if (relevance > 0) {
      results.push({
        id: `edu-${edu.school.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'education',
        title: edu.degree,
        description: `${edu.degree} from ${edu.school}`,
        relevance,
        metadata: {
          school: edu.school,
          start: edu.start,
          end: edu.end,
        },
      });
    }
  }

  return results;
}

// Search themes
function searchThemes(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const theme of themes) {
    const relevance = calculateRelevance(
      `${theme.name} ${theme.label}`,
      query
    );

    if (relevance > 0) {
      results.push({
        id: `theme-${theme.name}`,
        type: 'theme',
        title: theme.label,
        description: `The ${theme.label} theme for the portfolio`,
        url: `/design?theme=${theme.name}`,
        relevance,
        metadata: {
          themeName: theme.name,
        },
      });
    }
  }

  return results;
}

// Search about/profile information
function searchAbout(query: string): SearchResult[] {
  const results: SearchResult[] = [];

  const aboutText = [
    DATA.name,
    DATA.description,
    DATA.summary,
    DATA.location,
  ].join(' ');

  const relevance = calculateRelevance(aboutText, query);

  if (relevance > 0) {
    results.push({
      id: 'about-james',
      type: 'about',
      title: 'About OpenClaw-OS',
      description: DATA.description,
      url: '/story',
      relevance,
      metadata: {
        location: DATA.location,
        email: DATA.contact.email,
      },
    });
  }

  return results;
}

// Main search function
export function searchPortfolio(
  query: string,
  options: SearchOptions = {}
): SearchResult[] {
  const { category = 'all', limit = 10 } = options;

  let results: SearchResult[] = [];

  // Search across categories
  if (category === 'all' || category === 'projects') {
    results = results.concat(searchProjects(query));
  }

  if (category === 'all' || category === 'skills') {
    results = results.concat(searchSkills(query));
  }

  if (category === 'all' || category === 'work') {
    results = results.concat(searchWork(query));
  }

  if (category === 'all' || category === 'education') {
    results = results.concat(searchEducation(query));
  }

  if (category === 'all' || category === 'themes') {
    results = results.concat(searchThemes(query));
  }

  if (category === 'all') {
    results = results.concat(searchAbout(query));
  }

  // Sort by relevance and limit
  results.sort((a, b) => b.relevance - a.relevance);

  return results.slice(0, limit);
}

// Get all themes (for list_themes tool)
export function getAllThemes(category?: string): SearchResult[] {
  // For MVP, we don't have category metadata on themes
  // Just return all themes
  return themes.map((theme) => ({
    id: `theme-${theme.name}`,
    type: 'theme' as const,
    title: theme.label,
    description: `The ${theme.label} design theme`,
    url: `/design?theme=${theme.name}`,
    relevance: 1,
    metadata: {
      themeName: theme.name,
    },
  }));
}

// Format search results for AI response
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'No results found for that search.';
  }

  const grouped: Record<string, SearchResult[]> = {};

  for (const result of results) {
    if (!grouped[result.type]) {
      grouped[result.type] = [];
    }
    grouped[result.type].push(result);
  }

  const sections: string[] = [];

  if (grouped.project) {
    sections.push(
      `**Projects:**\n${grouped.project
        .map(
          (r) =>
            `- ${r.title}: ${r.description.slice(0, 150)}...${
              r.metadata?.technologies
                ? ` (Technologies: ${(r.metadata.technologies as string[]).slice(0, 5).join(', ')})`
                : ''
            }`
        )
        .join('\n')}`
    );
  }

  if (grouped.skill) {
    sections.push(
      `**Skills:**\n${grouped.skill.map((r) => `- ${r.title}`).join('\n')}`
    );
  }

  if (grouped.work) {
    sections.push(
      `**Work Experience:**\n${grouped.work
        .map(
          (r) =>
            `- ${r.title} (${(r.metadata?.start as string) || ''} - ${(r.metadata?.end as string) || 'Present'})`
        )
        .join('\n')}`
    );
  }

  if (grouped.education) {
    sections.push(
      `**Education:**\n${grouped.education.map((r) => `- ${r.title}`).join('\n')}`
    );
  }

  if (grouped.theme) {
    sections.push(
      `**Themes:**\n${grouped.theme.map((r) => `- ${r.title}`).join('\n')}`
    );
  }

  if (grouped.about) {
    sections.push(
      `**About:**\n${grouped.about.map((r) => r.description).join('\n')}`
    );
  }

  return sections.join('\n\n');
}
