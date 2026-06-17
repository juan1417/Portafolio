// Utility to fetch GitHub repositories via the Go backend
// Replaces the old direct-GitHub-API approach.

// Define the shape returned by the backend
interface BackendProject {
  id: string
  name: string
  description: string
  url: string
  github_id: number
  stars: number
  topics: string[]
  featured: boolean
  cached_at: string
  created_at: string
}

export interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  languages_url?: string
  topics?: string[]
  updated_at: string
  fork: boolean
  languages?: string[]
  images?: string[]
  readme?: string
}

// Set of repositories we never want to display
const EXCLUDED_REPOS = new Set([
  "juan1417",
  "Portafolio",
  "stunning-octo-chainsaw",
  "effective-octo-spork",
])

// Cache configuration – 5 minutes TTL
const CACHE_TTL_MS = 5 * 60 * 1000
interface CacheEntry {
  repos: GitHubRepo[]
  fetchedAt: number
}
let cache: CacheEntry | null = null

/**
 * Reset the in-memory cache. Only used by tests — not part of the public API.
 */
export function __testResetCache(): void {
  cache = null
}

/**
 * Resolve the backend URL.
 * In dev mode the Go server runs on localhost:8080.
 * In production, set the API_URL env variable (Vercel, Railway, etc.)
 * Falls back to localhost:8080 so dev works out of the box.
 */
function getApiUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.API_URL) {
    return import.meta.env.API_URL
  }
  // Vite exposes PUBLIC_ vars to the client too — check both
  if (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_URL) {
    return import.meta.env.PUBLIC_API_URL
  }
  return 'http://localhost:8080'
}

/**
 * Fetch repositories from the Go backend, applying filters and caching.
 */
export async function getRepos(lang?: string): Promise<{ repos: GitHubRepo[]; fetchError: boolean }> {
  const now = Date.now()
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { repos: cache.repos, fetchError: false }
  }

  const apiUrl = getApiUrl()

  try {
    // 1. Fetch projects from backend (pass lang so backend swaps description)
    const projectsUrl = lang ? `${apiUrl}/api/projects?lang=${lang}` : `${apiUrl}/api/projects`
    const res = await fetch(projectsUrl)
    if (!res.ok) {
      return { repos: [], fetchError: true }
    }

    const projects: BackendProject[] = await res.json()

    // 2. Filter excluded repos (the backend may already do this, but belt-and-suspenders)
    const filtered = projects.filter((p) => !EXCLUDED_REPOS.has(p.name))

    // 3. Enrich each project with screenshots
    const enriched = await Promise.all(
      filtered.map(async (project) => {
        let images: string[] = []

        try {
          const imgRes = await fetch(`${apiUrl}/api/projects/${project.name}/screenshots`)
          if (imgRes.ok) {
            images = await imgRes.json()
          }
        } catch {
          // Best-effort
        }

        // topics from the backend already include both GitHub topics AND languages
        const allTopics = project.topics || []

        const repo: GitHubRepo = {
          name: project.name,
          description: project.description || null,
          html_url: project.url,
          homepage: null,
          // primary language = first entry that looks like a language (starts with uppercase)
          language: allTopics.find((t) => /^[A-Z]/.test(t)) || null,
          topics: allTopics,
          updated_at: project.cached_at,
          fork: false,
          languages: allTopics,
          images,
        }

        return repo
      }),
    )

    cache = { repos: enriched, fetchedAt: now }
    return { repos: enriched, fetchError: false }
  } catch {
    return { repos: [], fetchError: true }
  }
}
