---
name: astro-tailwind-portfolio
description: 'Build and update this Astro v5 + Tailwind v4 portfolio with strict TypeScript, i18n query-param language flow, and utility-first styling. Use when creating pages/components, wiring DOM interactions, translating UI copy, and validating changes with Astro check/build.'
argument-hint: 'Describe the feature/fix, target files, language behavior (en/es), and verification needed.'
---

# Astro Tailwind Portfolio Workflow

## What This Skill Produces
A complete, convention-aligned implementation for this portfolio codebase:
- Correct Astro file structure and import ordering.
- Tailwind utility-based UI changes using existing theme tokens.
- EN/ES translation coverage for user-visible strings.
- Typed DOM script logic with strict TypeScript compatibility.
- Verified output using project-supported checks.

## When To Use
Use this skill for requests involving:
- Astro page/component creation or refactors (`.astro` files).
- Tailwind styling updates in templates.
- Translation and language propagation updates (`?lang=en|es`).
- Navigation/internal link changes that must preserve language state.
- Final verification in this repo (`pnpm astro check`, `pnpm build`).

## Inputs To Gather First
Collect these details before implementation:
1. Goal: new feature, visual change, bug fix, or content update.
2. Scope: page(s), component(s), i18n keys, and style impact.
3. Language behavior: whether new copy must appear in EN/ES.
4. Validation depth: type-check only or type-check plus build.

## Procedure
1. Identify touchpoints.
- Locate relevant files under `src/pages`, `src/components`, `src/i18n`, and `src/style`.
- Prefer small edits in existing structure over introducing new architecture.

2. Apply Astro conventions.
- In frontmatter, follow import order: layout, components, type-only imports, value imports.
- Define props with `interface Props {}` for reusable components.
- For page-level language, derive from query params:
  - `const lang = (Astro.url.searchParams.get('lang') || 'en') as Language;`
  - `const t = getTranslations(lang);`

3. Branch on user-visible text.
- If any text is shown in UI, add/update keys in both `src/i18n/en.json` and `src/i18n/es.json`.
- Do not hardcode translatable strings in templates.

4. Branch on links/navigation.
- For internal links, preserve language state:
  - ``href={`/route?lang=${lang}`}``
- If language switch behavior is touched, ensure URL mutation keeps `lang` query param.

5. Branch on interactivity.
- For DOM logic in `.astro`, wrap setup in `DOMContentLoaded`.
- Type DOM elements and events explicitly in script blocks.
- Keep scripts framework-free (no React/Vue islands).

6. Apply Tailwind styling rules.
- Use utility classes first; avoid custom CSS unless strictly necessary.
- Reuse theme tokens (`bg-primary`, `bg-surface`, `text-text`, etc.).
- Keep mobile-first responsive classes (`sm:`, `md:`, `lg:`).
- Preserve existing dark-theme direction and visual language.

7. Validate with supported commands.
- Run `pnpm astro check`.
- Run `pnpm build` for integration confidence.
- Do not run `pnpm lint` or `pnpm test` (not defined in this repo).

8. Report results.
- Summarize changed files and behavior impact.
- Call out any assumptions, risks, or follow-up tasks.

## Quality Gates
Treat work as complete only when all are true:
- No hardcoded UI copy that should be translated.
- EN/ES keys exist for all new text.
- Internal links preserve `lang` where required.
- Scripted interactions are typed and initialized safely.
- `pnpm astro check` passes.
- `pnpm build` passes (unless user explicitly skips).

## Output Format For Responses
When using this skill, return:
1. What was changed and why.
2. File list with precise paths.
3. Validation performed and outcomes.
4. Open questions or optional next improvements.
