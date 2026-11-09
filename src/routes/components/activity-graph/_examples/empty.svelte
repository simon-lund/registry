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

	const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
	const describe = (cell: ActivityCell) => `Nothing on ${date.format(cell.start)}`;
</script>

<div class="flex w-full flex-col items-center gap-3">
	<ActivityGraph data={{}} granularity="month" locale="en-US" weekStartsOn={1} today="2026-06-30">
		<ActivityGraphRowLabels />
		<ActivityGraphViewport>
			<ActivityGraphColumnLabels />
			<ActivityGraphGrid aria-label="Reading, nothing yet">
				{#snippet cell({ cell })}
					<ActivityGraphCell {cell} aria-label={describe(cell)} />
				{/snippet}
			</ActivityGraphGrid>
		</ActivityGraphViewport>
	</ActivityGraph>
	<p class="text-muted-foreground text-sm">Nothing yet. Every day you read fills a square.</p>
</div>
