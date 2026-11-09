<script lang="ts">
	import {
		ActivityGraph,
		ActivityGraphCell,
		ActivityGraphColumnLabels,
		ActivityGraphGrid,
		ActivityGraphLegend,
		ActivityGraphLegendScale,
		ActivityGraphRowLabels,
		ActivityGraphViewport,
		type ActivityCell
	} from '#lib/registry/ui/activity-graph/index.js';

	// Gym sessions, aiming for three a week: the goal is level 3, a fourth session is level 4.
	const pattern = [3, 3, 2, 3, 4, 3, 0, 3, 1, 3, 3, 4];
	const sessions: Record<string, number> = {};
	for (let week = 0; week < 130; week++) {
		for (let n = 0; n < pattern[week % pattern.length]; n++) {
			const day = new Date(Date.UTC(2024, 0, 1 + week * 7 + n * 2)).toISOString().slice(0, 10);
			sessions[day] = 1;
		}
	}

	const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	const describe = (cell: ActivityCell) => `${cell.value} sessions in the week of ${date.format(cell.start)}`;
</script>

<ActivityGraph data={sessions} granularity="week" thresholds={[1, 2, 3, 4]} locale="en-US" weekStartsOn={1} today="2026-06-30">
	<ActivityGraphRowLabels />
	<ActivityGraphViewport>
		<ActivityGraphColumnLabels />
		<ActivityGraphGrid aria-label="Gym sessions per week">
			{#snippet cell({ cell })}
				<ActivityGraphCell {cell} aria-label={describe(cell)} />
			{/snippet}
		</ActivityGraphGrid>
	</ActivityGraphViewport>
	<ActivityGraphLegend>1 <ActivityGraphLegendScale /> 4+</ActivityGraphLegend>
</ActivityGraph>
