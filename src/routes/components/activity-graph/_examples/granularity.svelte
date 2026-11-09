<script lang="ts">
	import {
		ActivityGraph,
		ActivityGraphCell,
		ActivityGraphColumnLabels,
		ActivityGraphGrid,
		ActivityGraphRowLabels,
		ActivityGraphViewport,
		type ActivityCell,
		type ActivityGranularity
	} from '#lib/registry/ui/activity-graph/index.js';
	import { Button } from '#lib/registry/ui/button/index.js';

	const granularities: ActivityGranularity[] = ['day', 'week', 'month', 'year'];
	let granularity = $state<ActivityGranularity>('month');

	// A seeded generator, so the server and the browser draw the same grid.
	let seed = 11;
	const random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32;

	// Thirty months, some busier than others: a coarser cell sums the days it covers.
	const walks: Record<string, number> = {};
	for (let i = 0; i < 912; i++) {
		const day = new Date(Date.UTC(2024, 0, 1 + i)).toISOString().slice(0, 10);
		const busy = 0.15 + ((Math.floor(i / 30) * 5) % 7) / 8;
		if (random() < busy) walks[day] = 1 + Math.round(random() * 9);
	}

	const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	const describe = (cell: ActivityCell) => `${cell.value} km from ${date.format(cell.start)}`;
</script>

<div class="flex w-full flex-col items-center gap-4">
	<div role="group" aria-label="What one square covers" class="flex gap-1">
		{#each granularities as g (g)}
			<Button
				size="sm"
				variant={g === granularity ? 'default' : 'ghost'}
				aria-pressed={g === granularity}
				onclick={() => (granularity = g)}
			>
				{g}
			</Button>
		{/each}
	</div>
	<ActivityGraph data={walks} {granularity} locale="en-US" weekStartsOn={1} today="2026-06-30">
		<ActivityGraphRowLabels />
		<ActivityGraphViewport>
			<ActivityGraphColumnLabels />
			<ActivityGraphGrid aria-label="Walks">
				{#snippet cell({ cell })}
					<ActivityGraphCell {cell} aria-label={describe(cell)} />
				{/snippet}
			</ActivityGraphGrid>
		</ActivityGraphViewport>
	</ActivityGraph>
</div>
