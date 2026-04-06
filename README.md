# Juan Manuel Machado - Portfolio

Personal portfolio built with Astro v5, Tailwind CSS v4, and TypeScript.

## Stack

- Astro (SSR mode)
- Tailwind CSS v4
- TypeScript
- Astro Vercel adapter (`@astrojs/vercel`)

## Commands

Run all commands from the project root using `pnpm`.

| Command | Description |
| :------ | :---------- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server at `http://localhost:4321` |
| `pnpm astro check` | Run Astro + TypeScript checks |
| `pnpm build` | Build production output (SSR) |
| `pnpm preview` | Preview built output locally |

## SSR Build and Deploy (Vercel)

This project uses `output: 'server'` and requires an Astro adapter for production builds.
The adapter is already configured in `astro.config.mjs`:

- `adapter: vercel()`

### Deploy steps

1. Push your changes to GitHub.
2. Import the repository in Vercel.
3. Build settings (also set in [`vercel.json`](vercel.json)):
   - Install command: `pnpm install`
   - Build command: `pnpm build`
   - **Output directory**: leave **empty** (default). Do **not** set `dist` or `.vercel/output` manually — Astro + `@astrojs/vercel` emit the [Build Output API](https://vercel.com/docs/build-output-api/v3) under `.vercel/output` during `pnpm build`, and Vercel picks that up when the framework preset is Astro.
4. Deploy.

The adapter writes the serverless bundle under `.vercel/output` at build time. You do not need to point “Output Directory” at that folder in the dashboard.

### Troubleshooting: `ERR_MODULE_NOT_FOUND` for `/var/task/dist/server/entry.mjs`

That path is the **handler** inside the SSR function bundle (`dist/server/entry.mjs` relative to the function). It usually means the install/build on Vercel did not match a clean Astro + pnpm build (wrong lockfile / wrong output overrides).

1. **Use one package manager**: this repo is **pnpm** (`pnpm-lock.yaml` + [`package.json`](package.json) `packageManager`). If you also keep `package-lock.json` in the repo, remove it or Vercel may run `npm` and break tracing.
2. In **Project → Settings → Build & Output**: clear **Output Directory** and **Start Command**; Framework **Astro**.
3. Redeploy with **Clear build cache**.

## Local behavior

Local development remains unchanged after SSR adapter setup:

- `pnpm dev` still runs the site locally at `http://localhost:4321`.
