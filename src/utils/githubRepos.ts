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
  images?: string[];
  readme?: string;
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
    const all: GitHubRepo[] = [];
    let nextUrl = `https://api.github.com/users/juan1417/repos?per_page=100&sort=updated`;

    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) {
        return { repos: [], fetchError: true };
      }
      const pageRepos: GitHubRepo[] = await res.json();
      all.push(...pageRepos);

      // Follow pagination Link header
      const linkHeader = res.headers.get("Link") || "";
      const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      nextUrl = nextMatch ? nextMatch[1] : "";
    }

    const filtered = all.filter((r) => !r.fork && !EXCLUDED_REPOS.has(r.name));
    const enriched = await Promise.all(
      filtered.map(async (repo) => {
        const safeTopics = Array.isArray(repo.topics) ? repo.topics : [];
        let languages: string[] = [];
        let images: string[] = [];

        if (repo.languages_url) {
          try {
            const langRes = await fetch(repo.languages_url, {
              headers: { Accept: "application/vnd.github+json" },
            });
            if (langRes.ok) {
              const langData = (await langRes.json()) as Record<string, number>;
              languages = Object.keys(langData);
            }
          } catch {
            // Silently ignore fetch errors for individual repos
          }
        }

        let readme: string | undefined

        try {
          const contentsRes = await fetch(
            `https://api.github.com/repos/juan1417/${repo.name}/contents/content`,
            { headers: { Accept: "application/vnd.github+json" } }
          )
          if (contentsRes.ok) {
            const files = await contentsRes.json() as { name: string; download_url: string }[]
            images = files.filter(f => f.name.endsWith(".png")).map(f => f.download_url)
          }
        } catch {
          // No content/ folder — silently skip
        }

        try {
          const readmeRes = await fetch(
            `https://api.github.com/repos/juan1417/${repo.name}/readme`,
            { headers: { Accept: "application/vnd.github+json" } }
          )
          if (readmeRes.ok) {
            const readmeData = await readmeRes.json() as { content?: string }
            if (readmeData.content) {
              const binary = atob(readmeData.content.replace(/\n/g, ''))
              const decoded = new TextDecoder('utf-8').decode(
                Uint8Array.from(binary, c => c.charCodeAt(0))
              )
              const cleaned = decoded
                .replace(/^#+\s+/gm, '')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
                .replace(/```[\s\S]*?```/g, '')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/<[^>]+>/g, '')
                .replace(/[*_`~>]/g, '')
                .replace(/\n+/g, ' ')
                .trim()
              const first = cleaned.split(/\.\s+/)[0].trim()
              if (first.length > 30 && first.toLowerCase() !== repo.name.toLowerCase()) {
                readme = first.slice(0, 300)
              }
            }
          }
        } catch {
          // No README — silently skip
        }

        return { ...repo, topics: safeTopics, languages, images, readme };
      })
    );
    // Update cache
    cache = { repos: enriched, fetchedAt: now };
    return { repos: enriched, fetchError: false };
  } catch {
    return { repos: [], fetchError: true };
  }
}
