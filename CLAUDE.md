# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro v5 + Tailwind v4 portfolio website for Juan Manuel Machado. Server-side rendered with Vercel adapter, featuring i18n (EN/ES), a playable Snake game on the home page, and dynamic GitHub project fetching.

## Commands

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # Production build
pnpm preview    # Preview production build locally
pnpm astro check # Type-check Astro files
```

Tests use vitest (see `src/utils/githubRepos.test.ts`, `src/i18n/utils.test.ts`).

## Architecture

### i18n Flow
Language is determined by `?lang=en|es` query parameter (not URL segment). Every page receives a `lang` prop.

```typescript
// Page-level language derivation
const lang = (Astro.url.searchParams.get('lang') || 'en') as Language;
const t = getTranslations(lang);
```

Translation files: `src/i18n/en.json` and `src/i18n/es.json`. All user-visible strings must be added to both.

### Theme / Styling
Tailwind v4 with custom theme tokens defined in `src/style/style.css` via `@theme` directive:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#FEA55F` | Orange accent |
| `secondary` | `#43D9AD` | Teal accent |
| `accent` | `#C98BDF` | Purple accent |
| `indigo` | `#4D5BCE` | Indigo accent |
| `rose` | `#E99287` | Rose accent |
| `background` | `#01080E` | Page background |
| `surface` | `#011221` | Card/panel background |
| `text` | `#E5E9F0` | Primary text |

### Component Patterns
- **Props**: Use `interface Props {}` with TypeScript types
- **Scripts**: Vanilla JS in `<script>` tags, wrapped in `DOMContentLoaded`
- **No React/Vue islands** — pure Astro components
- Internal links always preserve language: ``href={`/route?lang=${lang}`}``

### Layout
`src/layout/base.astro` wraps all pages. It imports the global CSS, fonts (Fira Code + Inter), Material Symbols icons, Font Awesome, and Devicon.

### Pages
- `/` — Home with Snake game
- `/about` — Bio, experience, skills, education (from `src/content/about/*.md`)
- `/projects` — Fetches repos from GitHub API (`src/utils/githubRepos.ts`)
- `/contact` — Contact form (UI only, no backend)
- `/skills` — Skills page
- `/404` — Custom 404 page

### Content
Markdown files in `src/content/about/` include translated variants (e.g., `bio.md` + `bio.es.md`) for some sections.

## Key Files

- `astro.config.mjs` — Astro config with Vercel SSR adapter and Tailwind plugin
- `src/i18n/utils.ts` — `getTranslations()`, `Language` type
- `src/utils/githubRepos.ts` — Fetches and filters GitHub repos (excludes forks, `Portafolio`, `juan1417`)
- `.agents/skills/astro-tailwind-portfolio/SKILL.md` — Skill defining the workflow for this repo

## Deployment

Vercel build: `pnpm install && pnpm build` (see `vercel.json`).