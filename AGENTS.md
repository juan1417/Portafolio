# AGENTS.md — Portfolio Codebase Guide

This file documents conventions, commands, and patterns for agentic coding agents
operating in this repository.

---

## Project Overview

Personal portfolio site for Juan Manuel Machado. Built with **Astro v5** in SSR
mode, **Tailwind CSS v4**, and **TypeScript strict mode**. Bilingual (EN/ES) via
URL query params (`?lang=en` / `?lang=es`). No React/Vue islands — pure `.astro`
components with vanilla TypeScript in co-located `<script>` blocks.

---

## Commands

Always use **pnpm** (both `pnpm-lock.yaml` and `package-lock.json` exist; pnpm
is authoritative).

```bash
pnpm dev           # Dev server at http://localhost:4321
pnpm build         # Production build → dist/
pnpm preview       # Preview the built output
pnpm astro check   # TypeScript check across all .astro files (use before build)
```

**There is no lint script and no test script.** Do not run `pnpm lint`,
`pnpm test`, or any Jest/Vitest/Playwright command — none exist. To verify
correctness, run `pnpm astro check` then `pnpm build`.

---

## Repository Structure

```
src/
  components/    # Reusable .astro components — PascalCase filenames
  i18n/          # en.json, es.json, utils.ts (getTranslations + Language type)
  layout/        # base.astro — root HTML shell (lowercase filename)
  pages/         # File-based routes — lowercase filenames
  style/         # style.css — Tailwind @import + @theme design tokens
public/          # favicon.svg, CV PDFs (EN + ES)
astro.config.mjs # output: 'server', @tailwindcss/vite plugin
tsconfig.json    # extends astro/tsconfigs/strict, no overrides
```

---

## TypeScript

- `tsconfig.json` extends `astro/tsconfigs/strict`: `strict`, `noImplicitAny`,
  `strictNullChecks`, `useUnknownInCatchVariables` are all enabled.
- Use inline `type` specifier for type-only imports (both forms are acceptable):
  ```ts
  import { getTranslations, type Language } from '../i18n/utils';
  // or
  import type { Language } from '../i18n/utils';
  ```
- Declare component props with `interface Props {}` in the frontmatter.
- Cast URL params with `as Language` (they return `string | null`).
- Cast DOM queries in `<script>` blocks:
  ```ts
  const el = document.getElementById('id') as HTMLSelectElement;
  ```
- Type event handler parameters explicitly:
  ```ts
  const handler = (e: Event) => {
    const target = e.target as HTMLSelectElement;
  };
  ```

---

## Astro Component Conventions

### Frontmatter structure (order)

```astro
---
// 1. Layout import
import Base from '../layout/base.astro';
// 2. Component imports
import Footer from '../components/Footer.astro';
// 3. i18n / utility imports (type specifier inline)
import { getTranslations, type Language } from '../i18n/utils';

// 4a. Props (reusable components only)
interface Props { lang?: Language; }
const { lang = 'en' } = Astro.props;

// 4b. Per-request logic (pages only)
const lang = (Astro.url.searchParams.get('lang') || 'en') as Language;
const t = getTranslations(lang);
---
```

### Script blocks

Wrap all DOM interaction in `DOMContentLoaded`. No semicolons are used in
existing script blocks — follow the surrounding file's style:

```astro
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('my-el') as HTMLElement
    el.addEventListener('click', (e: Event) => {
      // handle
    })
  })
</script>
```

### Template patterns

- Iterate JSON data with `{Object.entries(obj).map(([key, val]) => ( ... ))}`.
- Propagate `lang` on **every** internal link: `href={`/page?lang=${lang}`}`.
- Use `<!-- comment -->` for HTML comments inside templates.
- Use `data-*` attributes for JS hooks; toggle `hidden` / Tailwind classes for
  client-side show/hide (see `projects.astro` filter logic).

---

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Components | PascalCase filename | `Footer.astro`, `Navegation.astro` |
| Layout files | lowercase filename | `base.astro` |
| Pages | lowercase filename | `index.astro`, `projects.astro` |
| TS utilities | camelCase file, named exports | `utils.ts` → `getTranslations()` |
| CSS custom props | kebab-case | `--color-primary` |
| Translation keys | camelCase, dot paths | `t.nav.home`, `t.projects.title` |

Import components with their exact PascalCase filename — paths are
case-sensitive on Linux/WSL: `'../components/Footer.astro'` not `'../components/footer.astro'`.

---

## Styling (Tailwind CSS v4)

- **Utility classes only.** No custom CSS unless a Tailwind utility is absent.
  Scoped `<style>` blocks are allowed only for vendor-prefixed rules (e.g.
  `-webkit-line-clamp`, as in `projects.astro`).
- No `tailwind.config.js` — tokens live in `src/style/style.css` under `@theme`.
- Available custom tokens (use as Tailwind utilities):
  ```
  bg-primary  bg-secondary  bg-accent
  bg-background  bg-surface  bg-surface-elevated
  text-text  text-text-muted
  border-primary  border-primary/50
  text-success  text-warning  text-error
  ```
- **Dark theme only** — do not add `dark:` variants or a light mode.
- **Mobile-first** — use `sm:`, `md:`, `lg:` prefixes.
- Font: `font-['Inter']` (loaded from Google Fonts in `base.astro`).

---

## i18n

- All user-visible strings must live in `src/i18n/en.json` **and** `src/i18n/es.json`.
  Never hardcode UI text in templates.
- `Language` is `keyof typeof languages` — stays in sync automatically.
- When adding a key, add it to **both** JSON files.
- Language switching: `url.searchParams.set('lang', newLang)` then navigate.

---

## Skills Page (`src/pages/skills.astro`)

The Skills page renders categories and technologies entirely from the i18n JSON.
There is **no separate data file** — `t.skill.categories` drives everything.

### Adding a new technology

1. Add the tech name string to the correct category's `technologies` array in
   **both** `src/i18n/en.json` and `src/i18n/es.json` under `skill.categories`.
2. Add a matching entry to the `techIcons` map in `skills.astro`:
   ```ts
   "TechName": "devicon-techname-plain",   // Devicon class
   // or for non-Devicon techs:
   "TechName": "fa-solid fa-icon-name",    // Font Awesome class
   ```
   If no entry exists, the fallback `"fa-solid fa-code"` is used automatically.

### Adding a new category

1. Add a new key under `skill.categories` in **both** JSON files:
   ```json
   "newcat": { "title": "Category Name", "technologies": ["Tech1"] }
   ```
2. Add the matching Material Symbol icon name to `categoryIcons` in `skills.astro`:
   ```ts
   newcat: "icon_name"
   ```
   If omitted, the fallback `"code"` icon is used.

### Current category keys and their icons

| JSON key | Material Symbol | Title (EN) |
|---|---|---|
| `backend` | `terminal` | Back End |
| `frontend` | `web` | Front End |
| `database` | `storage` | Databases |
| `tools` | `build` | Tools |
| `devops` | `cloud_upload` | DevOps & Deployments |
| `others` | `code` | Others |

The i18n key for the Skills section is **`skill`** (singular), not `skills`.
Access it as `t.skill.title`, `t.skill.categories`, etc.

---

## Icons (three CDN libraries, loaded in `base.astro`)

| Library | Purpose | Syntax |
|---|---|---|
| Material Symbols Outlined | UI controls, category icons | `<span class="material-symbols-outlined">icon_name</span>` |
| Font Awesome 6 | Actions, social links, downloads | `<i class="fa-solid fa-download"></i>` |
| Devicon | Tech/language logos | `<i class="devicon-vuejs-plain colored"></i>` |

Do not add new CDN icon libraries without a strong reason.

---

## Formatting

No formatter is enforced. Follow the dominant style in each file:

- **Indentation:** 2 spaces everywhere.
- **Quotes:** double quotes in HTML attributes; single quotes in TS/JS.
- **Semicolons:** omitted in most `<script>` blocks (Navegation, projects);
  included in frontmatter TS. Match the file you are editing.
- **Trailing commas:** include in multi-line objects/arrays in frontmatter TS.
- Config files (`astro.config.mjs`) use double quotes, no trailing semicolons.

---

## Error Handling

- `getTranslations()` falls back to English: `return languages[lang] || languages.en`.
  Follow this pattern for any new fallback logic.
- No try/catch anywhere — acceptable for a portfolio with no async data fetching.
  Do not add error boundaries without explicit instruction.

---

## Known Gotchas

- **`Navegation.astro`** is intentionally spelled with a Spanish "v". Do not rename it.
- **`Card.astro`** is an empty placeholder — not yet implemented.
- **SSR is required.** `output: 'server'` in `astro.config.mjs` enables
  `Astro.url.searchParams` at request time. Do not switch to `'static'`.
- **No API routes, no env vars, no `<Image />`, no extra `@astrojs/` integrations.**
  Do not add them without explicit instruction.
