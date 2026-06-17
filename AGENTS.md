# AGENTS.md — Quick Reference

## Commands

- Package manager: **pnpm** only (pinned to `pnpm@10.33.0` via `packageManager`). No `package-lock.json` allowed; it breaks the Vercel build.
- `pnpm install` — install deps
- `pnpm dev` — dev server at `http://localhost:4321`
- `pnpm build` — SSR build, emits `.vercel/output` (Vercel Build Output API v3)
- `pnpm preview` — preview built output locally
- `pnpm astro check` — primary typecheck (Astro + TypeScript). No separate lint script.
- **Tests** (vitest, no `pnpm test` script defined): `npx vitest` / `npx vitest run` / `npx vitest watch`. Config in `vitest.config.ts`; tests live next to source as `*.test.ts` under `src/`. Vitest is not in `package.json` deps — if a fresh clone fails, run `pnpm add -D vitest` once. Verify by running after touching `src/i18n/utils.ts` or `src/utils/githubRepos.ts`.

## Build / Deploy (Vercel)

- `astro.config.mjs`: `output: 'server'`, `@astrojs/vercel` adapter, Tailwind via `@tailwindcss/vite`. **Do not switch to `static` output** — `SnakeGame.astro` uses `client:visible` and the home page depends on SSR.
- `pnpm build` writes the serverless bundle to `.vercel/output`. In the Vercel dashboard, leave **Output Directory** empty and **Start Command** empty. Framework preset: Astro. Vercel settings are also pinned in `vercel.json` (`buildCommand`, `installCommand`).
- `vercel.json` defines security headers **and a restrictive CSP**. Any new external resource (CDN, font, image host) must be added to its `Content-Security-Policy` or the resource 403s in production. Current CSP whitelists: `fonts.googleapis.com`, `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`, `api.github.com`, `https:` for `img-src`.
- `astro.config.mjs` has a hardcoded `site` URL (`portafolio-codingspace.vercel.app`) — OG/meta absolute URLs derive from it. Change deliberately, not by accident.
- Vercel ERR_MODULE_NOT_FOUND for `/var/task/dist/server/entry.mjs` = wrong package manager or stale output. Remove `package-lock.json`, clear build cache, redeploy.

## Project Layout

- `src/components/` — PascalCase filenames. Paths are case-sensitive on Linux.
- `src/pages/` — lowercase route filenames (`index`, `about`, `projects`, `contact`, `skills`, `404`).
- `src/layout/base.astro` — wraps every page. Loads Fira Code + Inter (Google Fonts), Material Symbols, Font Awesome 6, Devicon. Skip-link lives here.
- `src/i18n/` — `en.json`, `es.json`, `utils.ts` (`getTranslations`, `Language`).
- `src/utils/` — pure TS helpers (e.g. `githubRepos.ts`). Has paired `*.test.ts`.
- `src/content/about/` — markdown sections; translated variants are paired files (e.g. `bio.md` + `bio.es.md`). Note: this folder is **not** wired up to Content Collections — pages read it manually.
- `src/style/style.css` — Tailwind v4 entry; theme tokens via `@theme` (no `tailwind.config.js`).
- `public/docs/` — CV PDFs in EN/ES.
- `.agents/desing/` — PNG mockups. Visual reference for UI work.
- `.agents/skills/apply-design/` — repo-local skill that guides UI updates; load it before touching layouts.
- `backend/` — Go backend, lives on the `feacture---migrate-logic-to-go` branch. See "Backend (Go)" section below.

## Conventions

- **Component frontmatter order**: layout import → component imports → i18n/util imports → `interface Props {}` → prop destructure → page logic (pages only).
- **Props**: declared via `interface Props {}`, read with `Astro.props`.
- **i18n**: derive `lang` from `Astro.url.searchParams.get('lang')` and cast `as Language`. **Propagate `?lang=…` on every internal `<a href>`** and on the language `<select>` change handler. Skills page namespace is `t.skill` (singular).
- **Script blocks**: wrap DOM code in `document.addEventListener('DOMContentLoaded', () => { … })`. **Omit semicolons** inside `<script>` blocks (matches existing style).
- **Styling**: Tailwind v4 utility classes only. No custom CSS unless a Tailwind utility is missing. Site is **dark-only — do not add dark-mode variants**. Theme tokens are defined in `src/style/style.css` under `@theme` (`primary`, `secondary`, `accent`, `indigo`, `rose`, `background`, `surface`, `surface-elevated`, `border`, `text`, `text-muted`, `text-accent`).
- **TypeScript**: `tsconfig.json` extends `astro/tsconfigs/strict`. Keep code passing `pnpm astro check`.
- **Icons**: three CDNs loaded in `base.astro` (Material Symbols, Font Awesome 6, Devicon). Add new tech icons to `techIcons` in `src/pages/skills.astro` (fallback `fa-solid fa-code`); add new category icons to `categoryIcons` (fallback `"code"`).

## Backend (Go) — migration in progress

WIP on the `feacture---migrate-logic-to-go` branch (triple dash, typo "feacture"; single commit `ff18891` on top of `main`). Not yet merged, not deployed, not wired to the Astro front.

- **Goal**: move some Astro/TS logic to a Go backend, starting with the projects fetcher. `src/utils/githubRepos.ts` (`getRepos()`) is the first function targeted for migration.
- **Layout** (`backend/`): `main.go`, `db/`, `handlers/`, `middleware/`, `models/`, `repositories/`, `services/`, `template/` — clean-architecture style.
- **Stack**: Go 1.26.3, `chi/v5` (router, reserved for later), `jackc/pgx/v5` (Postgres driver), `joho/godotenv` (env loading).
- **Module path has a typo**: `porfolio.dev/backend` (missing the "t" in "portfolio"). Affects every internal import.
- **Current entry point** (`backend/main.go`): a CLI that iterates `services.GetGithubRepos()` and logs them — no HTTP server, no routes, no Astro proxy. `handlers/projects.go` exposes `SearchProjects()` as a thin wrapper.
- **Models** (`backend/models/models.go`, the intended data model — these shapes are the contract):
  - `Repositories` — slim GitHub repo view: `Id`, `Name`, `HTMLURL`, `LanguagesURL`, `ContentsURL`.
  - `Projects` — DB row: `Id`, `Name`, `Description`, `CreatedAt`, `Github_id`, `Starts`, `Topics`, `Features`, `Cached_at`, `URL`.
  - `Contact` — contact form submissions: `Id`, `Name`, `Email`, `Content`, `CreatedAt`, `Status`, `Source`.
  - `admin_users` — auth: `Id`, `Email`, `Password_hash`, `Created_at`.
  - `page_views` — analytics: `Id`, `Page`, `Country`, `Referrer`, `User_agent`, `Visited_at`.
- **Database**: `backend/db/access.go` connects to Postgres via `pgx.Connect`, reading `DATABASE_URL` from `.env`. No migrations, no schema files. No Docker.
- **Stubs** (single-line `package` declarations, awaiting implementation): `handlers/{admin,analytics,contact}.go`, `middleware/auth.go`, `repositories/{analytics,contact}.go`, `template/index.html` (empty file).
- **Things to verify / finish in the WIP** (work in progress, not bugs to file — just unfinished code):
  - `db/access.go` defers `conn.Close()` before returning the connection — caller always gets a closed handle.
  - `repositories/projects.go` → `GetProjects()` uses `QueryRow(...).Scan(&projects)` for a slice — should be `Query` + `Rows`.
  - `services/github.go` calls `log.Fatal` inside a library function — kills the process on any network blip.
  - `repositories/projects.go` → `PostProject()` has an empty `if !exists { }` body (TODO).
  - GitHub fetch is unauthenticated and hardcoded to user `juan1417` (same risk profile as the TS version).

## Known Gotchas

- `src/components/Navegation.astro` is intentionally misspelled — **do not rename** (every internal link breaks).
- `src/components/Card.astro` is an empty placeholder — leave it alone unless you are filling it in.
- SSR is required: `output: 'server'` + `client:visible` on `SnakeGame.astro` is the only client directive in the codebase.
- No API routes, no env vars (`.env` is gitignored but never read), no `<Image />` (no `astro:assets` integration), no extra Astro integrations. Don't add them speculatively.
- `src/utils/githubRepos.ts` calls the GitHub API **unauthenticated** as user `juan1417` (hardcoded). Risk: 60 req/hr rate limit if traffic spikes. Mitigations already in place: 5-min in-memory cache, swallow per-repo errors, exclude forks + a fixed `EXCLUDED_REPOS` set (`Portafolio`, `juan1417`, `stunning-octo-chainsaw`, `effective-octo-spork`). If the page starts returning `fetchError: true`, the rate limit is the most likely cause.
- i18n: any new translation key goes in **both** `en.json` and `es.json`. The vitest suite in `src/i18n/utils.test.ts` checks that top-level keys match — extend tests when adding new top-level sections.
