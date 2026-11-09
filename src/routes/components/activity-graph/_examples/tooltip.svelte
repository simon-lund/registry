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
	import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#lib/registry/ui/tooltip/index.js';

	const rides: Record<string, number> = {};
	for (let month = 0; month < 30; month++) {
		const day = new Date(Date.UTC(2024, month, 15)).toISOString().slice(0, 10);
		rides[day] = 4 + ((month * 7) % 20);
	}

	const date = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
	const describe = (cell: ActivityCell) => `${cell.value} rides in ${date.format(cell.start)}`;
</script>

<TooltipProvider delayDuration={150} skipDelayDuration={400}>
	<Tooltip>
		{#snippet children({ payload })}
			<ActivityGraph data={rides} granularity="month" locale="en-US" weekStartsOn={1} today="2026-06-30">
				<ActivityGraphRowLabels />
				<ActivityGraphViewport>
					<ActivityGraphColumnLabels />
					<ActivityGraphGrid aria-label="Rides per month">
						{#snippet cell({ cell })}
							<TooltipTrigger payload={cell}>
								{#snippet child({ props })}
									<ActivityGraphCell {...props} {cell} aria-label={describe(cell)} />
								{/snippet}
							</TooltipTrigger>
						{/snippet}
					</ActivityGraphGrid>
				</ActivityGraphViewport>
			</ActivityGraph>
			<TooltipContent sideOffset={6}>
				{payload ? describe(payload as unknown as ActivityCell) : ''}
			</TooltipContent>
		{/snippet}
	</Tooltip>
</TooltipProvider>
