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
  readme?: string;
  images?: string[];
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
        let readme: string | undefined;

        try {
          // Fetch languages
          if (repo.languages_url) {
            const langRes = await fetch(repo.languages_url, {
              headers: { Accept: "application/vnd.github+json" },
            });
            if (langRes.ok) {
              const langData = (await langRes.json()) as Record<string, number>;
              languages = Object.keys(langData);
            }
          }

          // Fetch README and extract first paragraph
          const readmeRes = await fetch(
            `https://api.github.com/repos/juan1417/${repo.name}/readme`,
            { headers: { Accept: "application/vnd.github+json" } }
          );
          if (readmeRes.ok) {
            const readmeData = await readmeRes.json() as { content?: string; html_url?: string };
            if (readmeData.content) {
              // README content is base64 encoded — decode as UTF-8
              const binary = atob(readmeData.content.replace(/\n/g, ''));
              const decoded = new TextDecoder('utf-8').decode(
                Uint8Array.from(binary, c => c.charCodeAt(0))
              );
              // Strip markdown: headers, links, code blocks, bold/italic, etc.
              const cleaned = decoded
                .replace(/^#+\s+/gm, '')          // remove headers
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
                .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')  // images
                .replace(/```[\s\S]*?```/g, '')     // code blocks
                .replace(/`([^`]+)`/g, '$1')       // inline code
                .replace(/<[^>]+>/g, '')           // strip HTML tags
                .replace(/[*_`~>]/g, '')           // remaining markdown symbols
                .replace(/\n+/g, ' ')              // collapse newlines
                .trim();
              // Extract first sentence/paragraph (stop at first period + newline or double newline)
              const first = cleaned.split(/\.\s+/)[0].trim();
              // Skip if description is too short or just the repo name
              if (first.length > 30 && first.toLowerCase() !== repo.name.toLowerCase()) {
                readme = first.slice(0, 300);
              }
            }
          }
        } catch {
          // Silently ignore fetch errors for individual repos
        }

        // Fetch images folder contents
        let images: string[] = [];
        try {
          const imagesRes = await fetch(
            `https://api.github.com/repos/juan1417/${repo.name}/contents/images`,
            { headers: { Accept: "application/vnd.github+json" } }
          );
          if (imagesRes.ok) {
            const imagesData = await imagesRes.json() as Array<{ name: string; type: string }>;
            images = imagesData
              .filter(f => f.type === "file" && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name))
              .map(f => `https://raw.githubusercontent.com/juan1417/${repo.name}/main/images/${f.name}`);
          }
        } catch {
          // ignore
        }

        return { ...repo, topics: safeTopics, languages, readme, images };
      })
    );
    // Update cache
    cache = { repos: enriched, fetchedAt: now };
    return { repos: enriched, fetchError: false };
  } catch {
    return { repos: [], fetchError: true };
  }
}
