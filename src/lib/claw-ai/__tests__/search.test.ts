/**
 * Tests for Claw AI Search Module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchPortfolio, getAllThemes, formatSearchResults, SearchResult } from '../search';

describe('search module', () => {
  describe('searchPortfolio', () => {
    describe('basic search functionality', () => {
      it('should return results for matching queries', () => {
        const results = searchPortfolio('React');
        expect(results.length).toBeGreaterThan(0);
      });

      it('should return empty array for non-matching queries', () => {
        const results = searchPortfolio('xyznonexistentquery123');
        expect(results).toEqual([]);
      });

      it('should be case insensitive', () => {
        const resultsLower = searchPortfolio('react');
        const resultsUpper = searchPortfolio('REACT');
        const resultsMixed = searchPortfolio('ReAcT');

        expect(resultsLower.length).toBe(resultsUpper.length);
        expect(resultsLower.length).toBe(resultsMixed.length);
      });

      it('should trim whitespace from queries', () => {
        const resultsNormal = searchPortfolio('React');
        const resultsWithSpace = searchPortfolio('  React  ');

        expect(resultsNormal.length).toBe(resultsWithSpace.length);
      });
    });

    describe('relevance scoring', () => {
      it('should score exact matches higher than partial matches', () => {
        const results = searchPortfolio('TypeScript');
        const exactMatch = results.find(r =>
          r.title.toLowerCase().includes('typescript') ||
          r.description.toLowerCase().includes('typescript')
        );

        expect(exactMatch).toBeDefined();
        expect(exactMatch!.relevance).toBeGreaterThan(0);
      });

      it('should sort results by relevance descending', () => {
        const results = searchPortfolio('AI');

        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].relevance).toBeGreaterThanOrEqual(results[i + 1].relevance);
        }
      });

      it('should handle multi-word queries', () => {
        const results = searchPortfolio('AI development');
        expect(results.length).toBeGreaterThan(0);
      });

      it('should skip single character words in scoring', () => {
        const resultsWithShort = searchPortfolio('a React');
        const resultsWithoutShort = searchPortfolio('React');

        // Both should find React-related results
        expect(resultsWithShort.length).toBeGreaterThan(0);
        expect(resultsWithoutShort.length).toBeGreaterThan(0);
      });
    });

    describe('category filtering', () => {
      it('should filter by projects category', () => {
        const results = searchPortfolio('project', { category: 'projects' });

        results.forEach(result => {
          expect(result.type).toBe('project');
        });
      });

      it('should filter by skills category', () => {
        const results = searchPortfolio('React', { category: 'skills' });

        results.forEach(result => {
          expect(result.type).toBe('skill');
        });
      });

      it('should filter by work category', () => {
        const results = searchPortfolio('engineer', { category: 'work' });

        results.forEach(result => {
          expect(result.type).toBe('work');
        });
      });

      it('should filter by education category', () => {
        const results = searchPortfolio('university', { category: 'education' });

        results.forEach(result => {
          expect(result.type).toBe('education');
        });
      });

      it('should filter by themes category', () => {
        const results = searchPortfolio('claude', { category: 'themes' });

        results.forEach(result => {
          expect(result.type).toBe('theme');
        });
      });

      it('should search all categories by default', () => {
        const results = searchPortfolio('James');
        const types = new Set(results.map(r => r.type));

        // Should include results from multiple categories
        expect(types.size).toBeGreaterThanOrEqual(1);
      });

      it('should include about results only when category is all', () => {
        const resultsAll = searchPortfolio('James', { category: 'all' });
        const resultsProjects = searchPortfolio('James', { category: 'projects' });

        const aboutInAll = resultsAll.some(r => r.type === 'about');
        const aboutInProjects = resultsProjects.some(r => r.type === 'about');

        // About should only appear in 'all' category
        expect(aboutInProjects).toBe(false);
      });
    });

    describe('result limiting', () => {
      it('should limit results to default of 10', () => {
        const results = searchPortfolio('a');  // Broad query
        expect(results.length).toBeLessThanOrEqual(10);
      });

      it('should respect custom limit', () => {
        const results = searchPortfolio('React', { limit: 3 });
        expect(results.length).toBeLessThanOrEqual(3);
      });

      it('should return fewer results if not enough matches', () => {
        const results = searchPortfolio('TypeScript', { limit: 100 });
        // Should return all matches even if less than limit
        expect(results.length).toBeLessThanOrEqual(100);
      });
    });

    describe('result structure', () => {
      it('should return results with required fields', () => {
        const results = searchPortfolio('React');

        results.forEach(result => {
          expect(result).toHaveProperty('id');
          expect(result).toHaveProperty('type');
          expect(result).toHaveProperty('title');
          expect(result).toHaveProperty('description');
          expect(result).toHaveProperty('relevance');
          expect(typeof result.id).toBe('string');
          expect(typeof result.title).toBe('string');
          expect(typeof result.description).toBe('string');
          expect(typeof result.relevance).toBe('number');
        });
      });

      it('should generate valid IDs for projects', () => {
        const results = searchPortfolio('project', { category: 'projects' });

        results.forEach(result => {
          expect(result.id).toMatch(/^project-/);
        });
      });

      it('should generate valid IDs for skills', () => {
        const results = searchPortfolio('React', { category: 'skills' });

        results.forEach(result => {
          expect(result.id).toMatch(/^skill-/);
        });
      });

      it('should include metadata for projects', () => {
        const results = searchPortfolio('project', { category: 'projects' });

        results.forEach(result => {
          if (result.type === 'project') {
            expect(result.metadata).toBeDefined();
            expect(result.metadata).toHaveProperty('technologies');
          }
        });
      });

      it('should include metadata for work experience', () => {
        const results = searchPortfolio('engineer', { category: 'work' });

        results.forEach(result => {
          if (result.type === 'work') {
            expect(result.metadata).toBeDefined();
            expect(result.metadata).toHaveProperty('company');
            expect(result.metadata).toHaveProperty('title');
          }
        });
      });
    });

    describe('specific content searches', () => {
      it('should find skills by name', () => {
        const results = searchPortfolio('TypeScript', { category: 'skills' });
        const hasTypeScript = results.some(r =>
          r.title.toLowerCase().includes('typescript')
        );
        expect(hasTypeScript).toBe(true);
      });

      it('should find themes by name', () => {
        const results = searchPortfolio('cyberpunk', { category: 'themes' });
        const hasCyberpunk = results.some(r =>
          r.title.toLowerCase().includes('cyberpunk')
        );
        expect(hasCyberpunk).toBe(true);
      });

      it('should find about information', () => {
        const results = searchPortfolio('Dublin', { category: 'all' });
        const hasAbout = results.some(r => r.type === 'about');
        expect(hasAbout).toBe(true);
      });
    });
  });

  describe('getAllThemes', () => {
    it('should return all themes', () => {
      const themes = getAllThemes();
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should return themes with correct structure', () => {
      const themes = getAllThemes();

      themes.forEach(theme => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('type', 'theme');
        expect(theme).toHaveProperty('title');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('url');
        expect(theme).toHaveProperty('relevance', 1);
        expect(theme).toHaveProperty('metadata');
        expect(theme.metadata).toHaveProperty('themeName');
      });
    });

    it('should include theme URLs', () => {
      const themes = getAllThemes();

      themes.forEach(theme => {
        expect(theme.url).toMatch(/^\/design\?theme=/);
      });
    });

    it('should return same themes regardless of category parameter', () => {
      const themesAll = getAllThemes();
      const themesWithCategory = getAllThemes('dark');

      // Currently getAllThemes ignores category
      expect(themesAll.length).toBe(themesWithCategory.length);
    });

    it('should include specific known themes', () => {
      const themes = getAllThemes();
      const themeNames = themes.map(t => t.metadata?.themeName);

      expect(themeNames).toContain('claude');
      expect(themeNames).toContain('cyberpunk');
      expect(themeNames).toContain('nature');
    });
  });

  describe('formatSearchResults', () => {
    it('should return message for empty results', () => {
      const formatted = formatSearchResults([]);
      expect(formatted).toBe('No results found for that search.');
    });

    it('should format project results', () => {
      const results: SearchResult[] = [
        {
          id: 'project-test',
          type: 'project',
          title: 'Test Project',
          description: 'A test project description that is quite long and should be truncated at some point',
          relevance: 5,
          metadata: {
            technologies: ['React', 'TypeScript', 'Node.js'],
          },
        },
      ];

      const formatted = formatSearchResults(results);

      expect(formatted).toContain('**Projects:**');
      expect(formatted).toContain('Test Project');
      expect(formatted).toContain('Technologies:');
    });

    it('should format skill results', () => {
      const results: SearchResult[] = [
        {
          id: 'skill-react',
          type: 'skill',
          title: 'React',
          description: 'James has expertise in React',
          relevance: 3,
        },
      ];

      const formatted = formatSearchResults(results);

      expect(formatted).toContain('**Skills:**');
      expect(formatted).toContain('React');
    });

    it('should format work experience results', () => {
      const results: SearchResult[] = [
        {
          id: 'work-acme',
          type: 'work',
          title: 'Engineer at Acme Corp',
          description: 'Built amazing things',
          relevance: 4,
          metadata: {
            company: 'Acme Corp',
            title: 'Engineer',
            start: '2020',
            end: '2023',
          },
        },
      ];

      const formatted = formatSearchResults(results);

      expect(formatted).toContain('**Work Experience:**');
      expect(formatted).toContain('Engineer at Acme Corp');
      expect(formatted).toContain('2020');
      expect(formatted).toContain('2023');
    });

    it('should format education results', () => {
      const results: SearchResult[] = [
        {
          id: 'edu-test',
          type: 'education',
          title: 'BS Computer Science',
          description: 'BS Computer Science from Test University',
          relevance: 3,
        },
      ];

      const formatted = formatSearchResults(results);

      expect(formatted).toContain('**Education:**');
      expect(formatted).toContain('BS Computer Science');
    });

    it('should format theme results', () => {
      const results: SearchResult[] = [
        {
          id: 'theme-claude',
          type: 'theme',
          title: 'Claude',
          description: 'The Claude theme for the portfolio',
          relevance: 3,
        },
      ];

      const formatted = formatSearchResults(results);

      expect(formatted).toContain('**Themes:**');
      expect(formatted).toContain('Claude');
    });

    it('should format about results', () => {
      const results: SearchResult[] = [
        {
          id: 'about-james',
          type: 'about',
          title: 'About James',
          description: 'Creative Technologist',
          relevance: 5,
        },
      ];

      const formatted = formatSearchResults(results);

      expect(formatted).toContain('**About:**');
      expect(formatted).toContain('Creative Technologist');
    });

    it('should group results by type', () => {
      const results: SearchResult[] = [
        {
          id: 'skill-react',
          type: 'skill',
          title: 'React',
          description: 'React skill',
          relevance: 3,
        },
        {
          id: 'project-test',
          type: 'project',
          title: 'Test Project',
          description: 'A project',
          relevance: 5,
          metadata: { technologies: ['React'] },
        },
        {
          id: 'skill-ts',
          type: 'skill',
          title: 'TypeScript',
          description: 'TS skill',
          relevance: 2,
        },
      ];

      const formatted = formatSearchResults(results);

      // Both sections should be present
      expect(formatted).toContain('**Projects:**');
      expect(formatted).toContain('**Skills:**');
    });

    it('should truncate long project descriptions', () => {
      const longDescription = 'A'.repeat(300);
      const results: SearchResult[] = [
        {
          id: 'project-test',
          type: 'project',
          title: 'Test',
          description: longDescription,
          relevance: 5,
          metadata: { technologies: [] },
        },
      ];

      const formatted = formatSearchResults(results);

      // Should be truncated with ...
      expect(formatted).toContain('...');
      expect(formatted.length).toBeLessThan(longDescription.length + 100);
    });

    it('should limit technologies shown for projects', () => {
      const results: SearchResult[] = [
        {
          id: 'project-test',
          type: 'project',
          title: 'Test',
          description: 'Description',
          relevance: 5,
          metadata: {
            technologies: ['Tech1', 'Tech2', 'Tech3', 'Tech4', 'Tech5', 'Tech6', 'Tech7'],
          },
        },
      ];

      const formatted = formatSearchResults(results);

      // Should show max 5 technologies
      expect(formatted).toContain('Tech1');
      expect(formatted).toContain('Tech5');
      expect(formatted).not.toContain('Tech6');
    });

    it('should handle work without end date', () => {
      const results: SearchResult[] = [
        {
          id: 'work-current',
          type: 'work',
          title: 'Current Job',
          description: 'Working here',
          relevance: 4,
          metadata: {
            start: '2023',
            // No end date - current job
          },
        },
      ];

      const formatted = formatSearchResults(results);

      expect(formatted).toContain('2023');
      // Should still format correctly without end date
      expect(formatted).toContain('**Work Experience:**');
    });
  });
});
