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
3. Keep default build settings:
   - Install command: `pnpm install`
   - Build command: `pnpm build`
4. Deploy.

Vercel will use the generated `.vercel/output` server artifacts during deployment.

## Local behavior

Local development remains unchanged after SSR adapter setup:

- `pnpm dev` still runs the site locally at `http://localhost:4321`.
