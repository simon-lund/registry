<script lang="ts">
	import {
		ActivityGraph,
		ActivityGraphColumnLabels,
		ActivityGraphGrid,
		ActivityGraphCell,
		ActivityGraphRowLabels,
		ActivityGraphViewport,
		type ActivityCell
	} from '#lib/registry/ui/activity-graph/index.js';

	const runs = { '2026-06-01': 5, '2026-06-03': 8, '2026-06-05': 3 };
	const describe = (cell: ActivityCell) => `${cell.value} km on ${cell.key}`;
</script>

<ActivityGraph data={runs} granularity="day" locale="en-US" weekStartsOn={1}>
	<ActivityGraphRowLabels />
	<ActivityGraphViewport>
		<ActivityGraphColumnLabels />
		<ActivityGraphGrid aria-label="Runs, the last 12 months">
			{#snippet cell({ cell })}
				<ActivityGraphCell {cell} aria-label={describe(cell)} />
			{/snippet}
		</ActivityGraphGrid>
	</ActivityGraphViewport>
</ActivityGraph>
