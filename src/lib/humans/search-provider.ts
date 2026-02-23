// Humans App Search Provider
// Abstraction layer for people search APIs

import type {
  SearchProvider,
  SearchProviderOptions,
  SearchProviderResult,
  SearchQuery,
  SearchResult,
  MatchConfidence,
  MatchEvidence,
  SocialLinks,
} from './types';
import { filterSensitiveData, isProfessionalSource } from './guardrails';

// ============================================================================
// Mock Data for Development
// ============================================================================

// Extended mock data with rich social links - better than LinkedIn recruiting tools
interface MockPerson extends SearchProviderResult {
  socialLinks: SocialLinks;
}

const MOCK_PEOPLE: MockPerson[] = [
  {
    id: 'mock-1',
    url: 'https://linkedin.com/in/sarah-chen-engineering',
    title: 'Sarah Chen - Senior Software Engineer at Stripe',
    snippet: 'Senior Software Engineer specializing in distributed systems and payment infrastructure. Previously at Google. Stanford CS. Based in San Francisco Bay Area. Contact: sarah.chen@stripe.com',
    author: 'Sarah Chen',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarah-chen-engineering',
      x: 'sarahchendev',
      github: 'https://github.com/sarahchen',
      email: 'sarah.chen@stripe.com',
    },
  },
  {
    id: 'mock-2',
    url: 'https://github.com/alexmartinez',
    title: 'Alex Martinez - Full Stack Developer',
    snippet: 'Full stack developer focused on React and Node.js. Building developer tools and open source projects. Currently leading engineering at a Series A startup in NYC. @alexmartinezdev on X.',
    author: 'Alex Martinez',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexmartinez-dev',
      x: 'alexmartinezdev',
      github: 'https://github.com/alexmartinez',
      website: 'https://alexmartinez.dev',
    },
  },
  {
    id: 'mock-3',
    url: 'https://linkedin.com/in/priya-patel-pm',
    title: 'Priya Patel - Director of Product at Notion',
    snippet: 'Director of Product at Notion. 10+ years in product management. Former PM at Slack and Microsoft. Stanford MBA. Passionate about productivity tools. priya@notion.so',
    author: 'Priya Patel',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priya-patel-pm',
      x: 'priyabuilds',
      email: 'priya@notion.so',
    },
  },
  {
    id: 'mock-4',
    url: 'https://twitter.com/markjohnson_vc',
    title: 'Mark Johnson - Partner at Sequoia',
    snippet: 'General Partner at Sequoia Capital. Investing in early-stage B2B SaaS. Board member at several unicorns. Previously founded two successful startups. DMs open @markjohnson_vc',
    author: 'Mark Johnson',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/markjohnson-sequoia',
      x: 'markjohnson_vc',
      email: 'mark@sequoiacap.com',
      website: 'https://sequoiacap.com/people/mark-johnson',
    },
  },
  {
    id: 'mock-5',
    url: 'https://linkedin.com/in/emily-wong-design',
    title: 'Emily Wong - Head of Design at Figma',
    snippet: 'Head of Design at Figma. Previously led design teams at Airbnb and Facebook. RISD graduate. Speaker at Config and design conferences worldwide. emily@figma.com',
    author: 'Emily Wong',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emily-wong-design',
      x: 'emilywongdesign',
      email: 'emily@figma.com',
      website: 'https://emilywong.design',
    },
  },
  {
    id: 'mock-6',
    url: 'https://substack.com/@davidkim',
    title: 'David Kim - AI Researcher and Writer',
    snippet: 'AI researcher at OpenAI. PhD from MIT. Writing about machine learning, AI safety, and the future of work. Advisor to multiple AI startups. david.kim@openai.com',
    author: 'David Kim',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidkim-ai',
      x: 'davidkimai',
      github: 'https://github.com/davidkim-ml',
      email: 'david.kim@openai.com',
      website: 'https://davidkim.substack.com',
    },
  },
  {
    id: 'mock-7',
    url: 'https://linkedin.com/in/rachel-green-sales',
    title: 'Rachel Green - VP of Sales at HubSpot',
    snippet: 'VP of Sales at HubSpot. 15 years in B2B sales leadership. Built sales teams from 5 to 500+. Expert in sales methodology and go-to-market strategy. rgreen@hubspot.com',
    author: 'Rachel Green',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rachel-green-sales',
      x: 'rachelgreensales',
      email: 'rgreen@hubspot.com',
    },
  },
  {
    id: 'mock-8',
    url: 'https://angel.co/u/james-lee-founder',
    title: 'Angel Investor - Serial Entrepreneur & Angel Investor',
    snippet: 'Serial entrepreneur with 3 exits. Angel investor in 50+ startups. YC alum. Currently building in the climate tech space. Based in Austin, TX. @jameslee_vc',
    author: 'Angel Investor',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jameslee-founder',
      x: 'jameslee_vc',
      email: 'james@jameslee.vc',
      website: 'https://jameslee.vc',
    },
  },
  {
    id: 'mock-9',
    url: 'https://linkedin.com/in/maria-garcia-recruiter',
    title: 'Maria Garcia - Head of Talent at Stripe',
    snippet: 'Head of Talent Acquisition at Stripe. Previously built recruiting teams at Airbnb, Uber, and Google. Expert in scaling engineering orgs. maria.garcia@stripe.com',
    author: 'Maria Garcia',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/maria-garcia-recruiter',
      x: 'mariagarciaTA',
      email: 'maria.garcia@stripe.com',
    },
  },
  {
    id: 'mock-10',
    url: 'https://linkedin.com/in/tom-wilson-cto',
    title: 'Tom Wilson - CTO at Figma',
    snippet: 'CTO at Figma. Previously VP Engineering at Dropbox. 20+ years building consumer and enterprise products. Stanford CS PhD. tom@figma.com',
    author: 'Tom Wilson',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/tom-wilson-cto',
      x: 'tomwilsoncto',
      github: 'https://github.com/tomwilson',
      email: 'tom@figma.com',
    },
  },
];

// ============================================================================
// Mock Search Provider (for development)
// ============================================================================

function createMockProvider(): SearchProvider {
  return {
    name: 'Mock',
    available: true,
    search: async (query: string, options?: SearchProviderOptions): Promise<SearchProviderResult[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      const queryLower = query.toLowerCase();

      // Filter mock data based on query
      const results = MOCK_PEOPLE.filter(person => {
        const searchText = `${person.title} ${person.snippet}`.toLowerCase();
        const queryWords = queryLower.split(/\s+/);
        return queryWords.some(word => searchText.includes(word));
      });

      // Return shuffled subset to simulate different results
      const shuffled = results.sort(() => Math.random() - 0.5);
      const numResults = options?.numResults || 10;
      return shuffled.slice(0, numResults);
    },
  };
}

// ============================================================================
// Exa Search Provider (via API route to avoid CORS)
// ============================================================================

function createExaProvider(): SearchProvider {
  return {
    name: 'Exa',
    available: true, // Always available, API route handles fallback
    search: async (query: string, options?: SearchProviderOptions): Promise<SearchProviderResult[]> => {
      try {
        const response = await fetch('/api/humans/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            numResults: options?.numResults || 10,
          }),
        });

        if (!response.ok) {
          console.warn('Search API error, falling back to mock data');
          return [];
        }

        const data = await response.json();

        // If API tells us to use mock, return empty to trigger fallback
        if (data.useMock) {
          console.info('Using mock data:', data.message);
          return [];
        }

        return data.results;
      } catch (error) {
        console.warn('Search API failed, falling back to mock data:', error);
        return [];
      }
    },
  };
}

// ============================================================================
// Provider Factory
// ============================================================================

export function getSearchProvider(preferredProvider?: 'exa' | 'mock'): SearchProvider {
  // If mock is explicitly preferred, return mock
  if (preferredProvider === 'mock') {
    return createMockProvider();
  }

  // Create a combined provider that tries Exa first, then falls back to mock
  const exaProvider = createExaProvider();
  const mockProvider = createMockProvider();

  return {
    name: 'Combined',
    available: true,
    search: async (query: string, options?: SearchProviderOptions): Promise<SearchProviderResult[]> => {
      // Try Exa first
      const exaResults = await exaProvider.search(query, options);

      // If we got results from Exa, use them
      if (exaResults.length > 0) {
        return exaResults;
      }

      // Otherwise fall back to mock data
      console.info('Using mock data for search results');
      return mockProvider.search(query, options);
    },
  };
}

// ============================================================================
// Search Query Builder
// ============================================================================

export function buildSearchQuery(query: SearchQuery): string {
  const parts: string[] = [];

  if (query.personName) {
    parts.push(`"${query.personName}"`);
  }

  if (query.role) {
    parts.push(query.role);
  }

  if (query.seniority && query.seniority !== 'any') {
    const seniorityTerms: Record<string, string> = {
      entry: 'junior OR entry-level',
      mid: '',
      senior: 'senior',
      lead: 'lead OR principal OR staff',
      director: 'director',
      vp: 'VP OR vice president',
      c_level: 'CEO OR CTO OR CFO OR COO OR chief',
    };
    if (seniorityTerms[query.seniority]) {
      parts.push(seniorityTerms[query.seniority]);
    }
  }

  if (query.location) {
    parts.push(`${query.location}`);
  }

  if (query.keywords) {
    parts.push(query.keywords);
  }

  return parts.filter(Boolean).join(' ');
}

// ============================================================================
// Result Processor
// ============================================================================

export function processSearchResults(
  results: SearchProviderResult[],
  query: SearchQuery
): SearchResult[] {
  return results.map((result, index) => {
    // Extract name from title or author
    const name = extractName(result.title, result.author);

    // Extract title and company
    const { title, company } = extractTitleAndCompany(result.title, result.snippet);

    // Extract location
    const location = extractLocation(result.snippet);

    // Calculate confidence
    const confidence = calculateConfidence(result, query);

    // Build evidence
    const evidence = buildEvidence(result, query);

    // Extract social links - key differentiator from LinkedIn
    const socialLinks = extractSocialLinks(result);

    return {
      id: result.id || `result-${index}`,
      name,
      title,
      company,
      location,
      snippet: filterSensitiveData(result.snippet.slice(0, 300)),
      sourceUrl: result.url,
      sourceDomain: extractDomain(result.url),
      confidence,
      evidence,
      socialLinks,
    };
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

function extractName(title: string, author?: string): string {
  if (author) return author;

  // Try to extract name from patterns like "John Doe - Title at Company"
  const dashPattern = title.match(/^([^-]+)\s*-/);
  if (dashPattern) {
    return dashPattern[1].trim();
  }

  // Try to extract from "Name | Title"
  const pipePattern = title.match(/^([^|]+)\s*\|/);
  if (pipePattern) {
    return pipePattern[1].trim();
  }

  // Return first two capitalized words
  const words = title.split(/\s+/);
  const nameWords = words.slice(0, 2).filter(w => /^[A-Z]/.test(w));
  return nameWords.join(' ') || title.slice(0, 30);
}

function extractTitleAndCompany(
  sourceTitle: string,
  snippet: string
): { title?: string; company?: string } {
  // Pattern: "Name - Title at Company"
  const atPattern = sourceTitle.match(/\s+-\s+(.+)\s+at\s+(.+)$/i);
  if (atPattern) {
    return { title: atPattern[1].trim(), company: atPattern[2].trim() };
  }

  // Pattern: "Name | Title, Company"
  const commaPattern = sourceTitle.match(/\s+[|–-]\s+([^,]+),\s*(.+)$/);
  if (commaPattern) {
    return { title: commaPattern[1].trim(), company: commaPattern[2].trim() };
  }

  // Try to find in snippet
  const snippetAt = snippet.match(/(?:^|\s)([\w\s]+)\s+at\s+([\w\s]+)(?:\.|,|$)/i);
  if (snippetAt) {
    return { title: snippetAt[1].trim(), company: snippetAt[2].trim() };
  }

  return {};
}

function extractLocation(snippet: string): string | undefined {
  const locationPatterns = [
    /(?:based\s+in|located\s+in|from)\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,|$)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/, // City, State
    /(San Francisco|New York|NYC|Los Angeles|LA|Seattle|Austin|Boston|Chicago|London|Berlin|Singapore|Tokyo)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = snippet.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return undefined;
}

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function calculateConfidence(
  result: SearchProviderResult,
  query: SearchQuery
): MatchConfidence {
  let score = 0;
  const searchText = `${result.title} ${result.snippet}`.toLowerCase();

  // Role match
  if (query.role && searchText.includes(query.role.toLowerCase())) {
    score += 3;
  }

  // Location match
  if (query.location && searchText.includes(query.location.toLowerCase())) {
    score += 2;
  }

  // Keywords match
  if (query.keywords) {
    const keywords = query.keywords.toLowerCase().split(/\s+/);
    const matches = keywords.filter(kw => searchText.includes(kw));
    score += matches.length;
  }

  // Professional source bonus
  if (isProfessionalSource(result.url)) {
    score += 1;
  }

  // Name match for specific person
  if (query.personName) {
    const nameLower = query.personName.toLowerCase();
    if (searchText.includes(nameLower)) {
      score += 4;
    }
  }

  if (score >= 5) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

function buildEvidence(
  result: SearchProviderResult,
  query: SearchQuery
): MatchEvidence {
  const evidence: MatchEvidence = {};
  const searchText = `${result.title} ${result.snippet}`.toLowerCase();

  if (query.role && searchText.includes(query.role.toLowerCase())) {
    evidence.roleMatch = query.role;
  }

  if (query.location && searchText.includes(query.location.toLowerCase())) {
    evidence.locationMatch = query.location;
  }

  if (query.seniority && query.seniority !== 'any') {
    const seniorityTerms: Record<string, string[]> = {
      entry: ['junior', 'entry'],
      mid: ['mid'],
      senior: ['senior'],
      lead: ['lead', 'principal', 'staff'],
      director: ['director'],
      vp: ['vp', 'vice president'],
      c_level: ['ceo', 'cto', 'cfo', 'coo', 'chief'],
    };
    const terms = seniorityTerms[query.seniority] || [];
    if (terms.some(t => searchText.includes(t))) {
      evidence.seniorityMatch = query.seniority;
    }
  }

  if (query.keywords) {
    const keywords = query.keywords.split(/\s+/);
    const matches = keywords.filter(kw =>
      searchText.includes(kw.toLowerCase())
    );
    if (matches.length > 0) {
      evidence.keywordMatches = matches;
    }
  }

  // Add a relevant snippet excerpt
  evidence.sourceSnippet = result.snippet.slice(0, 150);

  return evidence;
}

// ============================================================================
// Social Links Extraction - Key Value Differentiator
// ============================================================================

function extractSocialLinks(result: SearchProviderResult & { socialLinks?: SocialLinks }): SocialLinks {
  // If mock data already has social links, use them
  if (result.socialLinks) {
    return result.socialLinks;
  }

  const socialLinks: SocialLinks = {};
  const text = `${result.url} ${result.title} ${result.snippet}`;

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    socialLinks.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
  }

  // Extract X/Twitter handle
  const xHandleMatch = text.match(/@([a-zA-Z0-9_]{1,15})(?:\s|$|,|\.)/);
  if (xHandleMatch) {
    socialLinks.x = xHandleMatch[1];
  }
  // Also check for twitter.com or x.com URLs
  const xUrlMatch = text.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/i);
  if (xUrlMatch && !socialLinks.x) {
    socialLinks.x = xUrlMatch[1];
  }

  // Extract GitHub
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) {
    socialLinks.github = `https://github.com/${githubMatch[1]}`;
  }

  // Extract work email (avoid personal email domains)
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@(?!gmail|yahoo|hotmail|outlook|icloud|aol|protonmail)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch) {
    socialLinks.email = emailMatch[1].toLowerCase();
  }

  // Extract personal website
  const websitePatterns = [
    /(?:website|site|workspace|blog):\s*(https?:\/\/[^\s,]+)/i,
    /(?:https?:\/\/)?([a-zA-Z0-9-]+\.(?:dev|io|me|com|co|design|tech))(?:\/|$|\s)/i,
  ];
  for (const pattern of websitePatterns) {
    const match = text.match(pattern);
    if (match) {
      const url = match[1].startsWith('http') ? match[1] : `https://${match[1]}`;
      // Avoid social media sites
      if (!url.match(/linkedin|twitter|github|facebook|instagram/i)) {
        socialLinks.website = url;
        break;
      }
    }
  }

  return socialLinks;
}

// Helper to format X handle to full URL
export function getXUrl(handle: string): string {
  const cleanHandle = handle.replace('@', '');
  return `https://x.com/${cleanHandle}`;
}

// Helper to check if a social link exists
export function hasSocialLinks(links: SocialLinks): boolean {
  return !!(links.linkedin || links.x || links.github || links.email || links.website);
}
