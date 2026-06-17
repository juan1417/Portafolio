import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getRepos, __testResetCache, type GitHubRepo } from './githubRepos';

const API = 'http://localhost:8080';

const mockBackendProjects = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'test-repo',
    description: 'A test repository',
    url: 'https://github.com/juan1417/test-repo',
    github_id: 1,
    stars: 5,
    topics: ['TypeScript', 'React'],
    featured: false,
    cached_at: '2026-06-16T10:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Portafolio',
    description: '',
    url: 'https://github.com/juan1417/Portafolio',
    github_id: 2,
    stars: 0,
    topics: ['Astro', 'TypeScript', 'CSS'],
    featured: false,
    cached_at: '2026-06-16T10:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'juan1417',
    description: '',
    url: 'https://github.com/juan1417/juan1417',
    github_id: 3,
    stars: 0,
    topics: [],
    featured: false,
    cached_at: '2026-06-16T10:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'MenuMaster',
    description: 'MenuMaster es una app de escritorio en C# para gestionar restaurantes.',
    url: 'https://github.com/juan1417/MenuMaster',
    github_id: 4,
    stars: 0,
    topics: ['C#', 'TSQL'],
    featured: false,
    cached_at: '2026-06-16T10:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
]

/**
 * Create a fetch mock that:
 * - Returns projects from /api/projects
 * - Returns screenshots from /api/projects/:name/screenshots (empty array by default)
 */
function mockFetch(screenshotMap?: Record<string, string[]>) {
  const screenshots = screenshotMap || {}

  return vi.fn().mockImplementation((url: string) => {
    // Projects list
    if (url === `${API}/api/projects`) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBackendProjects),
      })
    }

    // Screenshots by project name
    const screenshotMatch = url.match(
      new RegExp(`^${API}/api/projects/([^/]+)/screenshots$`),
    )
    if (screenshotMatch) {
      const name = screenshotMatch[1]
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(screenshots[name] || []),
      })
    }

    // Fallback: not found
    return Promise.resolve({
      ok: false,
      status: 404,
    })
  }) as unknown as typeof fetch
}

describe('githubRepos (backend proxy)', () => {
  beforeEach(() => {
    __testResetCache()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getRepos return structure', () => {
    it('should return an object with repos array and fetchError boolean', async () => {
      vi.stubGlobal('fetch', mockFetch())

      const result = await getRepos()

      expect(result).toHaveProperty('repos')
      expect(result).toHaveProperty('fetchError')
      expect(Array.isArray(result.repos)).toBe(true)
      expect(typeof result.fetchError).toBe('boolean')
    })

    it('should return empty repos with fetchError true on API failure', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }))

      const result = await getRepos()

      expect(result.repos).toEqual([])
      expect(result.fetchError).toBe(true)
    })

    it('should return empty repos with fetchError true on network error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

      const result = await getRepos()

      expect(result.repos).toEqual([])
      expect(result.fetchError).toBe(true)
    })
  })

  describe('filtering', () => {
    it('should exclude Portafolio, juan1417, stunning-octo-chainsaw, effective-octo-spork', async () => {
      vi.stubGlobal('fetch', mockFetch())

      const result = await getRepos()
      const names = result.repos.map((r: GitHubRepo) => r.name)

      expect(names).not.toContain('Portafolio')
      expect(names).not.toContain('juan1417')
      expect(names).not.toContain('stunning-octo-chainsaw')
      expect(names).not.toContain('effective-octo-spork')
    })
  })

  describe('data mapping', () => {
    it('should map name, description, html_url correctly', async () => {
      vi.stubGlobal('fetch', mockFetch())

      const result = await getRepos()
      const testRepo = result.repos.find((r: GitHubRepo) => r.name === 'test-repo')

      expect(testRepo).toBeDefined()
      expect(testRepo!.name).toBe('test-repo')
      expect(testRepo!.description).toBe('A test repository')
      expect(testRepo!.html_url).toBe('https://github.com/juan1417/test-repo')
      expect(testRepo!.fork).toBe(false)
    })

    it('should map languages and topics from backend topics array', async () => {
      vi.stubGlobal('fetch', mockFetch())

      const result = await getRepos()
      const testRepo = result.repos.find((r: GitHubRepo) => r.name === 'MenuMaster')

      expect(testRepo).toBeDefined()
      expect(testRepo!.languages).toEqual(['C#', 'TSQL'])
      expect(testRepo!.topics).toEqual(['C#', 'TSQL'])
    })

    it('should determine primary language from topics', async () => {
      vi.stubGlobal('fetch', mockFetch())

      const result = await getRepos()
      const testRepo = result.repos.find((r: GitHubRepo) => r.name === 'test-repo')

      expect(testRepo!.language).toBe('TypeScript')
    })

    it('should use README description from backend when available', async () => {
      vi.stubGlobal('fetch', mockFetch())

      const result = await getRepos()
      const menuMaster = result.repos.find((r: GitHubRepo) => r.name === 'MenuMaster')

      expect(menuMaster!.description).toBe(
        'MenuMaster es una app de escritorio en C# para gestionar restaurantes.',
      )
    })
  })

  describe('screenshots enrichment', () => {
    it('should return empty images array when no screenshots exist', async () => {
      vi.stubGlobal('fetch', mockFetch())

      const result = await getRepos()
      const testRepo = result.repos.find((r: GitHubRepo) => r.name === 'test-repo')

      expect(testRepo!.images).toEqual([])
    })

    it('should include screenshots when available', async () => {
      const screenshots = {
        'MenuMaster': [
          'https://raw.githubusercontent.com/juan1417/MenuMaster/main/content/img1.png',
          'https://raw.githubusercontent.com/juan1417/MenuMaster/main/content/img2.png',
        ],
      }
      vi.stubGlobal('fetch', mockFetch(screenshots))

      const result = await getRepos()
      const menuMaster = result.repos.find(
        (r: GitHubRepo) => r.name === 'MenuMaster',
      )

      expect(menuMaster!.images).toHaveLength(2)
      expect(menuMaster!.images![0]).toContain('img1.png')
    })

    it('should handle screenshots fetch failure gracefully', async () => {
      const mock = vi.fn()
        // First call: projects list succeeds
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockBackendProjects),
        })
        // Subsequent calls: screenshots fail
        .mockRejectedValue(new Error('screenshots error'))

      vi.stubGlobal('fetch', mock)

      const result = await getRepos()
      const menuMaster = result.repos.find(
        (r: GitHubRepo) => r.name === 'MenuMaster',
      )

      expect(menuMaster!.images).toEqual([])
      expect(result.fetchError).toBe(false)
    })
  })
})
