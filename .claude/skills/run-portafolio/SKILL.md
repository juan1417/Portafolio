---
name: run-portafolio
description: Run and screenshot the portfolio web app. Use when asked to "run the portfolio", "screenshot the home page", or "verify a change in the browser".
---

# Run: Portafolio

Astro v5 + Tailwind v4 portfolio site served at `http://localhost:4321`. Driven by `chromium-cli` with a heredoc smoke script.

## Prerequisites

No extra OS packages needed — this is a web app, not a desktop GUI. It runs headless via `chromium-cli`.

## Build

```bash
pnpm install
pnpm build
```

## Run (agent path)

Start the dev server, then verify with `curl` smoke checks:

```bash
pnpm dev --host 0.0.0.0 --port 4321 &
sleep 5

# Verify pages return HTTP 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/          # home (EN)
curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321/?lang=es"  # home (ES)
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/about
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/projects
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/contact
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/skills
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/nonexistent # 404

# Verify page titles
curl -s http://localhost:4321/ | grep -o '<title>[^<]*</title>'

# Kill dev server
kill %1
```

If `chromium-cli` is available, use it for visual verification instead:

```bash
chromium-cli --browser --viewport=1280,800 --url http://localhost:4321/ --screenshot .claude/skills/run-portafolio/home-en.png
```

## Run (human path)

```bash
pnpm dev
# → http://localhost:4321 opens in your browser
```

Then Ctrl-C to stop.

## Gotchas

- The Astro dev server binds to `0.0.0.0` so processes on the same machine can reach it. If port 4321 is in use, Astro auto-selects the next available port — check the startup output for the actual URL.
- `sleep 5` before the first request gives Astro time to initialize — without it, the first few requests may return connection refused.
- The Vercel adapter in `astro.config.mjs` sets `output: 'server'`, but `pnpm dev` runs the SSR dev server correctly — no adapter configuration change needed.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `pnpm dev` fails with "port already in use" | Another process is on 4321: `pkill -f "astro dev"` or use `--port 4322` |
| Screenshot is blank | Increase `sleep 5` to `sleep 8` — Astro's HMR websocket takes time to settle |
| Build fails with "esbuild" ignored | Run `pnpm approve-builds` and select esbuild, or ignore — the dev server works without it |