<script lang="ts">
	import {
		ActivityGraph,
		ActivityGraphCaption,
		ActivityGraphCell,
		ActivityGraphColumnLabels,
		ActivityGraphGrid,
		ActivityGraphLegend,
		ActivityGraphLegendScale,
		ActivityGraphRowLabels,
		ActivityGraphViewport,
		type ActivityCell
	} from '#lib/registry/ui/activity-graph/index.js';
	import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#lib/registry/ui/tooltip/index.js';

	// A fixed year from a seeded generator, so the server and the browser draw the same grid.
	let seed = 7;
	const random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32;

	const minutes: Record<string, number> = {};
	for (let i = 0; i < 365; i++) {
		const day = new Date(Date.UTC(2025, 6, 1 + i)).toISOString().slice(0, 10);
		if (random() < 0.7) minutes[day] = Math.round(5 + random() * 55);
	}

	const date = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
	const describe = (cell: ActivityCell) =>
		`${cell.value ? `${cell.value} minutes` : 'No reading'} on ${date.format(cell.start)}`;
</script>

<!-- One tooltip for the whole grid: each trigger hands it its cell as the payload. -->
<TooltipProvider delayDuration={150} skipDelayDuration={400}>
	<Tooltip>
		{#snippet children({ payload })}
			<ActivityGraph data={minutes} granularity="day" locale="en-US" weekStartsOn={1} today="2026-06-30">
				<ActivityGraphRowLabels />
				<ActivityGraphViewport>
					<ActivityGraphColumnLabels />
					<ActivityGraphGrid aria-label="Reading, the last 12 months">
						{#snippet cell({ cell })}
							<TooltipTrigger payload={cell}>
								{#snippet child({ props })}
									<ActivityGraphCell {...props} {cell} aria-label={describe(cell)} />
								{/snippet}
							</TooltipTrigger>
						{/snippet}
					</ActivityGraphGrid>
				</ActivityGraphViewport>
				<ActivityGraphCaption>
					{#snippet children({ cell, label })}{cell ? label : 'Pick a square to see its value.'}{/snippet}
				</ActivityGraphCaption>
				<ActivityGraphLegend>Less <ActivityGraphLegendScale /> More</ActivityGraphLegend>
			</ActivityGraph>
			<TooltipContent sideOffset={6}>
				{payload ? describe(payload as unknown as ActivityCell) : ''}
			</TooltipContent>
		{/snippet}
	</Tooltip>
</TooltipProvider>
