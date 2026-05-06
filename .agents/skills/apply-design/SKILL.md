---
name: apply-design
description: "Apply the visual design assets from the `.agents/desing/` folder to the Astro + Tailwind portfolio, ensuring component markup, Tailwind utility usage, i18n coverage, and verified build success."
argument-hint: "Specify which page(s) or component(s) need updates, any new UI elements, copy to translate, and desired verification depth."
---

# Apply Design Skill

## What This Skill Produces
- Updated `.astro` component or page files that match the reference screenshots.
- Tailwind utility‑class updates (no custom CSS unless a needed utility is missing).
- New or updated i18n keys in both `src/i18n/en.json` and `src/i18n/es.json` for any added copy.
- Optional image assets copied to `public/` (if the design references bespoke graphics).
- Confirmation that `pnpm astro check` and (optionally) `pnpm build` pass.

## When To Use
- You have design mockups in `.agents/desing/` that need to be implemented in the code.
- A page or component's visual appearance needs to match a specific screenshot.
- Adding or modifying layout sections (header, footer, hero, project cards, contact form, error pages, etc.).
- Updating responsive behavior to match mobile and desktop mockups.
- Introducing new UI states or interactive elements shown in the design files.

## Available Design Assets
Located in `.agents/desing/`:

**Home page (index.astro):**
- `porfolio-home-desktop.png` – desktop hero & intro section
- `porfolio-home-desktop-v2.png` – alternate desktop layout
- `porfolio-home-desktop-play-again.png`, `porfolio-home-desktop-game-over.png` – snake game states
- `mobile-home.png` – responsive mobile view

**About page (about.astro):**
- `porfolio-about-desktop.png` – desktop layout
- `porfolio-about-desktop-code-snippet-showcase.png` – code section
- `mobile-about.png`, `mobile-about-dropdown.png` – mobile with dropdown menu

**Projects page (projects.astro):**
- `porfolio-projects-desktop.png` – main layout
- `porfolio-projects-desktop-two-projects.png`, `porfolio-projects-desktop-multiple-projects.png` – layout variations
- `mobile-projects.png`, `mobile-projects-dropdown.png` – mobile views

**Contact page (contact.astro):**
- `porfolio-contact-desktop.png` – desktop form
- `porfolio-contact-desktop-form-error.png` – error state
- `porfolio-contact-desktop-thank-you.png` – success state
- `porfolio-contact-desktop-code-snippet.png`, `porfolio-contact-desktop-code-snippet-1.png` – code sections
- `mobile-contact.png`, `mobile-contact-dropdown.png` – mobile views
- `mobile-contact-form-focus.png`, `mobile-contact-error.png` – mobile states
- `mobile-contact-submit-message.png`, `mobile-contact-submit-message-1.png`, `mobile-contact-thank-you.png` – submission states

**Navigation & 404:**
- `mobile-menu.png` – mobile navigation
- `404-desktop.png`, `404-mobile.png` – error page

## Inputs To Gather First
1. **Target scope** – which route(s) (`src/pages/*.astro`) or component(s) (`src/components/*.astro`) are being updated? (e.g., "home page", "contact form", "navigation")
2. **Design references** – specify which screenshot(s) from the list above apply to this update.
3. **New textual content** – any copy that does not yet exist in the i18n JSON files.
4. **Verification preference** – type‑check only (`pnpm astro check`) or full build (`pnpm build`).

## Procedure
1. **Open the design asset** – locate the PNG(s) under `.agents/desing/` and note:
   - Layout structure (grid/flex arrangement)
   - Spacing & padding between sections
   - Color usage (primary, accent, text, borders)
   - Typography (heading sizes, line-heights)
   - Interactive elements (buttons, forms, hover/focus states)
   - Icons used and their placement
   - Responsive breakpoints (compare mobile vs desktop versions)

2. **Map UI elements to code** – identify which Astro component or page renders the region:
   - Review the current `.astro` file structure
   - Note differences between current state and the design screenshot
   
3. **Edit markup**
   - Adjust HTML structure in the `.astro` file to match the layout
   - Add/remove/reorder elements as shown in the screenshot
   - Ensure all internal links preserve the `lang` query param (`href={`/page?lang=${lang}`}`)
   - Update component props if needed to support new UI states (e.g., error states, loading)

4. **Apply Tailwind utilities**
   - Use the design tokens from `src/style/style.css` (e.g., `bg-primary`, `text-text`, `border-border`)
   - Reference desktop and mobile screenshots to apply responsive breakpoints (`sm:`, `md:`, `lg:`)
   - Add utility classes for hover/focus states visible in the design mockups
   - Match spacing from the screenshots (padding, margins, gaps)

5. **Update icons**
   - If a new technology/icon appears in the design, add the mapping to `techIcons` or `categoryIcons` in `src/pages/skills.astro` (fallbacks already defined)
   - Verify icons from Material Symbols, Font Awesome 6, or Devicon CDNs

6. **Add i18n keys**
   - Insert any new UI strings visible in the screenshots into both `src/i18n/en.json` and `src/i18n/es.json`
   - Organize under the appropriate namespace (e.g., `t.home.title`, `t.contact.email_label`)
   - Run `src/i18n/utils.ts` to verify the keys are typed correctly

7. **Copy static assets** (if needed)
   - If the design references custom graphics (not UI text/icons), place them in `public/`
   - Preserve original filenames and reference them in the `.astro` files

8. **Verification**
   - Open the page in a browser and visually compare side‑by‑side with the design screenshot
   - Test responsive behavior by resizing to mobile/tablet/desktop sizes
   - Run `pnpm astro check`; fix any TypeScript errors
   - If the user requested a full build, run `pnpm build` and ensure it completes without errors

## Quality Gates
- **Visual match** – The rendered UI in the browser closely matches the reference screenshot(s) from `.agents/desing/`.
- **Responsive** – Mobile, tablet, and desktop layouts render correctly (compare against mobile-*.png and desktop screenshots).
- **No hardcoded copy** – Every new UI string lives in both i18n JSON files.
- **Tailwind compliance** – All styling uses design tokens from `src/style/style.css`; no custom CSS unless absolutely required.
- **Navigation** – All internal links preserve the `lang` query param.
- **Type safety** – `pnpm astro check` passes with no TypeScript errors.
- **Build success** – `pnpm build` completes without errors (run on request or for full validation).

## Output Format For Responses
When using this skill, return:
1. **Summary** – which page(s)/component(s) were updated and which design screenshot(s) were used as reference.
2. **Changes made** – list of specific files modified (e.g., `src/pages/contact.astro`, `src/i18n/en.json`) with brief description of changes.
3. **Responsive coverage** – which breakpoints were tested (mobile, tablet, desktop).
4. **Verification results** – output of `pnpm astro check` and (if performed) `pnpm build`.
5. **Visual confirmation** – statement that the rendered page matches the reference screenshot.
6. **Open questions** – any ambiguous design details, missing assets, or optional next improvements.
