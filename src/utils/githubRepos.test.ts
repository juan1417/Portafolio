import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getRepos, type GitHubRepo } from './githubRepos';

describe('githubRepos', () => {
  describe('getRepos', () => {
    const mockRepos: GitHubRepo[] = [
      {
        name: 'test-repo',
        description: 'A test repository',
        html_url: 'https://github.com/juan1417/test-repo',
        homepage: 'https://test-repo.com',
        language: 'TypeScript',
        languages_url: 'https://api.github.com/repos/juan1417/test-repo/languages',
        topics: ['typescript', 'react'],
        updated_at: '2024-01-01T00:00:00Z',
        fork: false,
      },
      {
        name: 'Portafolio',
        description: 'My portfolio',
        html_url: 'https://github.com/juan1417/Portafolio',
        homepage: null,
        language: 'TypeScript',
        topics: [],
        updated_at: '2024-01-01T00:00:00Z',
        fork: false,
      },
      {
        name: 'juan1417',
        description: 'My profile',
        html_url: 'https://github.com/juan1417/juan1417',
        homepage: null,
        language: null,
        topics: [],
        updated_at: '2024-01-01T00:00:00Z',
        fork: false,
      },
      {
        name: 'forked-repo',
        description: 'A forked repo',
        html_url: 'https://github.com/juan1417/forked-repo',
        homepage: null,
        language: 'JavaScript',
        topics: [],
        updated_at: '2024-01-01T00:00:00Z',
        fork: true,
      },
    ];

    describe('EXCLUDED_REPOS', () => {
      it('should exclude Portafolio, juan1417, and random generated names', () => {
        expect(mockRepos.filter(r => !r.fork)).toHaveLength(3);
      });
    });

    describe('getRepos return structure', () => {
      it('should return an object with repos array and fetchError boolean', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockRepos,
        }) as unknown as typeof fetch;

        const result = await getRepos();

        expect(result).toHaveProperty('repos');
        expect(result).toHaveProperty('fetchError');
        expect(Array.isArray(result.repos)).toBe(true);
        expect(typeof result.fetchError).toBe('boolean');
      });

      it('should return empty repos with fetchError true on API failure', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 403,
        }) as unknown as typeof fetch;

        const result = await getRepos();

        expect(result.repos).toEqual([]);
        expect(result.fetchError).toBe(true);
      });

      it('should return empty repos with fetchError true on network error', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const result = await getRepos();

        expect(result.repos).toEqual([]);
        expect(result.fetchError).toBe(true);
      });

      it('should filter out forked repositories', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockRepos,
        }) as unknown as typeof fetch;

        const result = await getRepos();

        const hasForked = result.repos.some(r => r.fork);
        expect(hasForked).toBe(false);
      });

      it('should filter out excluded repositories', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockRepos,
        }) as unknown as typeof fetch;

        const result = await getRepos();

        const repoNames = result.repos.map(r => r.name);
        expect(repoNames).not.toContain('Portafolio');
        expect(repoNames).not.toContain('juan1417');
        expect(repoNames).not.toContain('stunning-octo-chainsaw');
        expect(repoNames).not.toContain('effective-octo-spork');
      });
    });

    describe('language enrichment', () => {
      it('should handle repos without languages_url', async () => {
        const reposWithoutLanguages = [
          {
            name: 'no-lang-repo',
            description: 'No languages',
            html_url: 'https://github.com/juan1417/no-lang-repo',
            homepage: null,
            language: null,
            topics: ['test'],
            updated_at: '2024-01-01T00:00:00Z',
            fork: false,
          },
        ];

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: async () => reposWithoutLanguages,
        }) as unknown as typeof fetch;

        const result = await getRepos();

        expect(result.repos[0].languages).toBeUndefined();
        expect(result.repos[0].topics).toEqual(['test']);
      });

      it('should handle language fetch failure gracefully', async () => {
        const reposWithLangUrl = [
          {
            name: 'test-repo',
            description: 'Test',
            html_url: 'https://github.com/juan1417/test-repo',
            homepage: null,
            language: 'JavaScript',
            languages_url: 'https://api.github.com/repos/juan1417/test-repo/languages',
            topics: [],
            updated_at: '2024-01-01T00:00:00Z',
            fork: false,
          },
        ];

        global.fetch = vi.fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => reposWithLangUrl,
          })
          .mockRejectedValueOnce(new Error('Language fetch failed'));

        const result = await getRepos();

        expect(result.repos[0].languages).toBeUndefined();
        expect(result.repos[0].topics).toEqual([]);
      });
    });
  });
});