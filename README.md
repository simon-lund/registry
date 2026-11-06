# ui.simon-lund.com

A private showcase in Storybook: Klementine as screens from the app's tests, and the LMU Room Finder
running live. Only people with the link get in.

- `stories/`: one file per project; `showcase.ts` lays out a story (copy, then a phone, a window or
  still screens). Names are written out in each story, because Storybook reads them from the source.
- `scripts/build.sh`: builds the room finder under `/roomfinder` (its `vite.config.ts` reads
  `BASE_PATH`), converts Klementine's renders to WebP (from the `ui-fix` worktree until that branch
  is merged), then Storybook into `storybook-static/`.
- `worker/index.ts`: the gate. `/k/<key>` sets a cookie (an HMAC of the key) and opens the start
  page; everything else needs that cookie, or gets a short "private" page. Nothing is indexed. Without
  `SHOWCASE_KEY` nobody gets in.

## Deploy (Simon)

The key in `.dev.vars` (not committed) is the one to share; put it into the Worker once:

```bash
cd ~/workspaces/simon-lund/registry && sed -n 's/SHOWCASE_KEY=//p' .dev.vars | pnpm exec wrangler secret put SHOWCASE_KEY
```

```bash
cd ~/workspaces/simon-lund/registry && pnpm run deploy
```

The route `ui.simon-lund.com` (custom domain) needs simon-lund.com in the same Cloudflare account.
The link to share:

```bash
cd ~/workspaces/simon-lund/registry && echo "https://ui.simon-lund.com/k/$(sed -n 's/SHOWCASE_KEY=//p' .dev.vars)"
```
