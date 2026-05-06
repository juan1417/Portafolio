// Utility to fetch GitHub repositories with simple in‑memory caching
// This is used by the Projects page to avoid refetching on every SSR request.

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url?: string;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  languages?: string[];
}

// Set of repositories we never want to display
const EXCLUDED_REPOS = new Set([
  "juan1417",
  "Portafolio",
  "stunning-octo-chainsaw",
  "effective-octo-spork",
]);

// Cache configuration – 5 minutes TTL (adjust as needed)
const CACHE_TTL_MS = 5 * 60 * 1000;
interface CacheEntry {
  repos: GitHubRepo[];
  fetchedAt: number;
}
let cache: CacheEntry | null = null;

/**
 * Fetch repositories from GitHub, applying filters and caching the result.
 * Returns an object with the repo list and a boolean indicating if a fetch error occurred.
 */
export async function getRepos(): Promise<{ repos: GitHubRepo[]; fetchError: boolean }> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    // Return cached data
    return { repos: cache.repos, fetchError: false };
  }

  try {
    const res = await fetch(
      "https://api.github.com/users/juan1417/repos?per_page=100&sort=updated",
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) {
      return { repos: [], fetchError: true };
    }
    const all: GitHubRepo[] = await res.json();
    const filtered = all.filter((r) => !r.fork && !EXCLUDED_REPOS.has(r.name));
    const enriched = await Promise.all(
      filtered.map(async (repo) => {
        const safeTopics = Array.isArray(repo.topics) ? repo.topics : [];
        try {
          if (!repo.languages_url) return { ...repo, topics: safeTopics };
          const langRes = await fetch(repo.languages_url, {
            headers: { Accept: "application/vnd.github+json" },
          });
          if (!langRes.ok) return { ...repo, topics: safeTopics };
          const langData = (await langRes.json()) as Record<string, number>;
          const languages = Object.keys(langData);
          return { ...repo, topics: safeTopics, languages };
        } catch {
          return { ...repo, topics: safeTopics };
        }
      })
    );
    // Update cache
    cache = { repos: enriched, fetchedAt: now };
    return { repos: enriched, fetchError: false };
  } catch {
    return { repos: [], fetchError: true };
  }
}
