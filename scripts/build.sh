#!/usr/bin/env bash
# Builds ui.simon-lund.com into storybook-static/: Klementine's screens and the live room finder first
# (into apps/), then Storybook, which copies them beside the stories (.storybook/main.ts). Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH=/home/simon/.local/share/asdf/installs/nodejs/24.13.0/bin:/home/simon/.local/share/asdf/installs/pnpm/11.0.5/bin:$PATH

ROOMFINDER=/home/simon/workspaces/experiments/lmu-maps/lmu.maps.frontend
KLEMENTINE=/home/simon/workspaces/lobsang-ai/klementine/apps/mobile
ZETTEL=/home/simon/.worktrees/zettel/demo-mode
TIMEWHEEL=/home/simon/workspaces/private/time-wheel
INKY=/home/simon/workspaces/experiments/inky-calendar
DESK=/home/simon/workspaces/klementine/klementine.desk/examples/whoowns
MIXTAPE=/home/simon/workspaces/lobsang-ai/mixtape/prototype.html
DESIGN=/home/simon/workspaces/lobsang-ai/thoughts/design

rm -rf apps && mkdir -p apps

# The room finder under /roomfinder (its vite.config.ts reads BASE_PATH). The build lands in its
# own build/, so restore the root build afterwards for anyone using that folder.
(cd "$ROOMFINDER" && BASE_PATH=/roomfinder node_modules/.bin/vite build >/dev/null)
cp -r "$ROOMFINDER/build" apps/roomfinder
(cd "$ROOMFINDER" && node_modules/.bin/vite build >/dev/null)

# Its component book: the room finder's own Storybook (every component as a plate), served at
# /roomfinder-book. A sibling of /roomfinder, not inside it, so it stays apart from the app.
(cd "$ROOMFINDER" && rm -rf storybook-static && node_modules/.bin/storybook build --quiet -o storybook-static >/dev/null)
cp -r "$ROOMFINDER/storybook-static" apps/roomfinder-book

# Klementine: still screens from the app's tests (build/flows, drawn with
# `flutter test --dart-define=FLOWS=true test/screens/`), as WebP. Only the ones the stories use. They
# come from the ui-fix worktree (all UI fixes, e.g. the black headline on Today) until that branch
# is merged into the main checkout; then FLOWS can point back at $KLEMENTINE/build/flows.
FLOWS=/home/simon/.worktrees/klementine/ui-fix/apps/mobile/build/flows
[ -d "$FLOWS" ] || FLOWS="$KLEMENTINE/build/flows"
SCREENS="today.all today.needs-you today.asking today.all-done planner.open planner.week place.open item.task
chat.list chat.conversation chat.job-working chat.job-done journeys.list journey.page journey.done-undo journey.log
firstrun.hello firstrun.name firstrun.something-real firstrun.nice-to-meet-you"
mkdir -p apps/klementine
for s in $SCREENS; do
	convert "$FLOWS/$s.png" -resize 585x -quality 84 "apps/klementine/$s.webp"
done

# zettel: the demo build (example data in the browser instead of Supabase, branch demo-mode),
# a single-page app under /zettel; the Worker answers its deep links with its index.html.
(cd "$ZETTEL" && rm -rf build && ZETTEL_DEMO=1 BASE_PATH=/zettel node_modules/.bin/vite build >/dev/null)
cp -r "$ZETTEL/build" apps/zettel

# UI concepts: the time wheel (static build under /concepts/time-wheel, its svelte.config.js reads
# BASE_PATH) and her faces, a standalone concept page from thoughts/design, with its font.
(cd "$TIMEWHEEL" && rm -rf build && BASE_PATH=/concepts/time-wheel node_modules/.bin/vite build >/dev/null)
mkdir -p apps/concepts/faces/fonts
cp -r "$TIMEWHEEL/build" apps/concepts/time-wheel
cp "$DESIGN/2026-10-27-start-screen/faces.html" apps/concepts/faces/index.html
cp "$DESIGN/2026-10-27-start-screen/fonts/instrument-sans-600.woff2" apps/concepts/faces/fonts/

# The inky calendar: its static demo (example events, drawings in the browser, no API routes),
# a Next.js export under /concepts/inky-calendar; its next.config.ts reads INKY_DEMO and BASE_PATH.
(cd "$INKY" && rm -rf out && INKY_DEMO=1 BASE_PATH=/concepts/inky-calendar NEXT_TELEMETRY_DISABLED=1 node_modules/.bin/next build >/dev/null)
cp -r "$INKY/out" apps/concepts/inky-calendar

# Desk, the refine port: its whoowns example (a single-page app with its backend in the browser)
# under /desk; the Worker answers its deep links with its index.html.
(cd "$DESK" && rm -rf build && BASE_PATH=/desk node_modules/.bin/vite build >/dev/null)
cp -r "$DESK/build" apps/desk

# mixtape: one self-contained page.
mkdir -p apps/concepts/mixtape
cp "$MIXTAPE" apps/concepts/mixtape/index.html

node_modules/.bin/storybook build --quiet -o storybook-static
echo "Built storybook-static/ ($(du -sh storybook-static | cut -f1))."
