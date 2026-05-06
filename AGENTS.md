# AGENTS.md — Quick Reference

## Commands

**Design assets** – PNG mockups are located in `.agents/desing/`. Use them as visual reference when updating UI.

**Design skill** – `apply-design` skill is available under `.agents/skills/apply-design/` to guide UI updates.

## Commands
- Use **pnpm** (repo is pnpm‑only). `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm astro check`.
- No lint or test scripts exist; do not run `pnpm lint`/`pnpm test`.

## Build / Deploy
- Astro config: `output: 'server'` with Vercel adapter (`@astrojs/vercel`).
- `pnpm build` creates a serverless bundle in `.vercel/output`. Vercel expects this; do **not** set a custom output directory.
- Ensure only pnpm is used in CI/Vercel (remove any `package-lock.json`).

## Project Layout
- `src/components/` – PascalCase filenames (e.g., `Footer.astro`). Paths are case‑sensitive on Linux.
- `src/pages/` – lowercase route filenames.
- `src/layout/` – `base.astro` (lowercase).
- `src/i18n/` – `en.json`, `es.json`, `utils.ts`. All UI strings must be in **both** JSON files.

## Component Conventions
- Frontmatter order: layout import → component imports → i18n/util imports → props (`interface Props {}`) → per‑request logic (pages only).
- Props declared via `interface Props {}` and accessed via `Astro.props`.
- Pages read language via `Astro.url.searchParams.get('lang')` and cast `as Language`.
- Propagate `lang` query param on every internal link.

## Script Blocks
- Wrap DOM code in `document.addEventListener('DOMContentLoaded', () => { … })`.
- Omit semicolons inside `<script>` blocks (match existing style).

## Tailwind CSS
- Use only utility classes; no custom CSS unless a Tailwind utility is missing.
- No dark‑mode variants; the site is dark‑only.
- Tokens live in `src/style/style.css` via `@theme`; no `tailwind.config.js`.

## i18n
- Add any new translation key to **both** `en.json` and `es.json`.
- Skills page uses `t.skill` (singular); update `skill.categories` for new categories/technologies.

## Icons
- Three CDNs are loaded in `base.astro`: Material Symbols, Font Awesome 6, Devicon.
- Add new tech icons to `techIcons` map in `src/pages/skills.astro`; fallback: `"fa-solid fa-code"`.
- Add new category icons to `categoryIcons`; fallback: `"code"`.

## Known Gotchas
- `src/components/Navegation.astro` is intentionally miss‑spelled; do not rename.
- `src/components/Card.astro` is an empty placeholder.
- SSR is required; do not switch `output` to `'static'`.
- No API routes, env vars, `<Image />`, or extra Astro integrations.