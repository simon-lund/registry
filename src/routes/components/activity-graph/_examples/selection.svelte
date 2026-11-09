<script lang="ts">
	import {
		ActivityGraph,
		ActivityGraphCaption,
		ActivityGraphCell,
		ActivityGraphColumnLabels,
		ActivityGraphGrid,
		ActivityGraphRowLabels,
		ActivityGraphViewport,
		type ActivityCell
	} from '#lib/registry/ui/activity-graph/index.js';

	let selected = $state<string | null>(null);

	// A seeded generator, so the server and the browser draw the same grid.
	let seed = 31;
	const random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32;

	const pages: Record<string, number> = {};
	for (let i = 0; i < 91; i++) {
		const day = new Date(Date.UTC(2026, 3, 1 + i)).toISOString().slice(0, 10);
		if (random() < 0.7) pages[day] = 10 + Math.round(random() * 40);
	}

	const date = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
	const describe = (cell: ActivityCell) =>
		`${cell.value ? `${cell.value} pages` : 'No pages'} on ${date.format(cell.start)}`;
</script>

<div class="flex w-full flex-col items-center gap-3">
	<ActivityGraph
		data={pages}
		granularity="day"
		range={{ start: '2026-04-01', end: '2026-06-30' }}
		bind:selected
		locale="en-US"
		weekStartsOn={1}
	>
		<ActivityGraphRowLabels />
		<ActivityGraphViewport>
			<ActivityGraphColumnLabels />
			<ActivityGraphGrid aria-label="Pages read, second quarter">
				{#snippet cell({ cell })}
					<ActivityGraphCell {cell} aria-label={describe(cell)} />
				{/snippet}
			</ActivityGraphGrid>
		</ActivityGraphViewport>
		<ActivityGraphCaption>
			{#snippet children({ cell, label })}{cell ? label : 'Tap a square.'}{/snippet}
		</ActivityGraphCaption>
	</ActivityGraph>
	<p class="text-muted-foreground font-mono text-xs">selected: {selected ?? 'null'}</p>
</div>
