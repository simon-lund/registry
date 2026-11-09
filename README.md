# ui.simon-lund.com

My component registry: components I designed and use, as a [shadcn-svelte
registry](https://shadcn-svelte.com/docs/registry). An app copies a component into its own source
with the CLI; the site is the book, one page (a plate) per component, shaped like a shadcn docs
page: large and working, how to install it, its examples, its API, its measurements.

```sh
pnpm dlx shadcn-svelte@latest add https://ui.simon-lund.com/r/number-input.json
```

Stack: SvelteKit 3 (`#lib` imports) + Svelte 5 runes, TypeScript, Tailwind v4, on a Cloudflare
Worker (`wrangler.jsonc`). Package manager: pnpm, standalone.

## Foundations

The organising idea: **one plate per component, the component large and working, the words under
it.** Everything on the site sits on:

- **Grid and rhythm:** 8px. The page is one linear column beside the sidebar; on a phone the sidebar
  becomes a row of links. 16px gutters on the phone, 32px from tablet.
- **Type:** Libre Baskerville for titles (two sizes: the plate title and a section title), Inter for
  text in two weights (400, 500), JetBrains Mono for measurements and code. These are
  simon-lund.com's faces, so the three sites read as one; PLAN.md still lists "a typeface that isn't
  Inter" as open, and when that is decided it changes here too.
- **Colour:** cream, ink and stone from the website, as shadcn's token names (`background`,
  `foreground`, `muted-foreground`, …) so an item installs into any shadcn-svelte app unchanged.
  The one colour with one meaning is **copper** (`primary`): the value in your hand, what you act on
  right now. It sits nowhere else.
- **Surfaces:** flat. A set sits flat (the stage is the muted surface, no border); only what floats
  gets a shadow.
- **Motion:** meaning only (where a value came from, what just landed), strong ease-out, short.
  Keyboard moves are instant; reduced motion turns the rest off. The durations and curves are plain
  CSS variables (`--dur-*`, `--ease-*`), in `src/app.css` and shipped to consumers by the item
  `motion`, so change them in both.

## Layout

| Path | What |
| --- | --- |
| `src/lib/registry/ui/<name>/` | one item: one file per part, `index.ts`, and its `meta.json` (title, description, npm and registry dependencies) |
| `src/lib/registry/ui/{button,input,spinner,tooltip}/` | stock shadcn-svelte, added with its CLI so items and pages can import them; never edited and never shipped from here (`STOCK` in the build script and `catalogue.ts`). An item lists one by its bare name, and the consumer's CLI takes it from their own registry |
| `src/lib/utils.ts` | `cn` and the type helpers; the item `utils`, which every item depends on |
| `src/app.css` | the theme: the tokens, the fonts, the base |
| `src/lib/book/` | the book's own parts (the plate with its copyable code block, the sidebar, the theme toggle) and its catalogue (`catalogue.ts`, which the index and the sidebar read); never shipped |
| `src/routes/components/<name>/` | the plate of one component; `_examples/` holds one file per example, rendered as the preview and shown as the code |
| `scripts/build-registry-json.js` | walks the items into `registry.json`; `shadcn-svelte registry build` turns that into `static/r/<item>.json` |

## Run it

asdf shims fail in non-interactive shells on this machine, so use absolute paths:

```sh
cd ~/workspaces/simon-lund/registry
export PATH=/home/simon/.local/share/asdf/installs/nodejs/24.13.0/bin:/home/simon/.local/share/asdf/installs/pnpm/11.0.5/bin:$PATH

pnpm install
pnpm dev                 # http://localhost:5174 (.claude/launch.json)
pnpm registry            # registry.json and static/r/*.json (both generated; static/r is not committed)
pnpm check               # svelte-check
pnpm build               # registry, then the site into .svelte-kit/cloudflare
pnpm deploy              # … and wrangler deploy to ui.simon-lund.com
```

`REGISTRY_HOMEPAGE=<origin> pnpm registry` builds for another origin; every registryDependency URL
is made from it.

## Adding a component

1. `src/lib/registry/ui/<name>/`: the parts, `index.ts`, `meta.json`. Imports between items go
   through `#lib/registry/ui/<other>/index.js`; the CLI rewrites them for the consumer. List what it
   stands on in `registryDependencies`, including `motion` if it uses those variables.
2. `src/routes/components/<name>/_examples/`: `demo.svelte` for the preview under the title,
   `usage.svelte` for Usage, and one file per example section. Each imports from
   `#lib/registry/ui/…`; the Code view shows the path an app installs to, highlighted at build time.
3. `src/routes/components/<name>/+page.svelte`, shaped like a shadcn docs page: the demo,
   Installation (command, or the files by hand), Usage, one `PlateExample` per example with a
   sentence on what to set, Keyboard, API Reference (a `PlatePart` per export, a table of props),
   Measurements.
4. An entry in `src/lib/book/catalogue.ts`: its tagline is the page's description.
5. `pnpm registry && pnpm check`. The check type-checks every example too.
