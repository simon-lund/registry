<script lang="ts">
	import {
		ActivityGraph,
		ActivityGraphCell,
		ActivityGraphColumnLabels,
		ActivityGraphGrid,
		ActivityGraphRowLabels,
		ActivityGraphViewport,
		type ActivityCell
	} from '#lib/registry/ui/activity-graph/index.js';

	// A seeded generator, so the server and the browser draw the same grid.
	let seed = 23;
	const random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32;

	const hours: Record<string, number> = {};
	for (let i = 0; i < 91; i++) {
		const day = new Date(Date.UTC(2026, 3, 1 + i)).toISOString().slice(0, 10);
		if (random() < 0.7) hours[day] = 1 + Math.round(random() * 7);
	}

	const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
	const describe = (cell: ActivityCell) => `${cell.value} hours on ${date.format(cell.start)}`;
</script>

<ActivityGraph
	data={hours}
	granularity="day"
	range={{ start: '2026-04-01', end: '2026-06-30' }}
	locale="en-US"
	weekStartsOn={1}
>
	<ActivityGraphRowLabels />
	<ActivityGraphViewport>
		<ActivityGraphColumnLabels />
		<ActivityGraphGrid aria-label="Garden hours, second quarter">
			{#snippet cell({ cell })}
				<ActivityGraphCell {cell} aria-label={describe(cell)} />
			{/snippet}
		</ActivityGraphGrid>
	</ActivityGraphViewport>
</ActivityGraph>
