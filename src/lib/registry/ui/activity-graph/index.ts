import Root, { activityGraphVariants } from './activity-graph.svelte';
import Viewport from './activity-graph-viewport.svelte';
import Grid from './activity-graph-grid.svelte';
import Cell from './activity-graph-cell.svelte';
import ColumnLabels from './activity-graph-column-labels.svelte';
import RowLabels from './activity-graph-row-labels.svelte';
import Caption from './activity-graph-caption.svelte';
import Legend from './activity-graph-legend.svelte';
import LegendScale from './activity-graph-legend-scale.svelte';
import { activityLevelVariants, ACTIVITY_LEVELS } from './levels.js';
import {
	buildActivityModel,
	levelOf,
	type ActivityCell,
	type ActivityData,
	type ActivityDate,
	type ActivityGranularity,
	type ActivityLabel,
	type ActivityLevel,
	type ActivityModel,
	type ActivityRange,
	type ActivityWeekday
} from './model.js';

export {
	Root,
	Viewport,
	Grid,
	Cell,
	ColumnLabels,
	RowLabels,
	Caption,
	Legend,
	LegendScale,
	//
	Root as ActivityGraph,
	Viewport as ActivityGraphViewport,
	Grid as ActivityGraphGrid,
	Cell as ActivityGraphCell,
	ColumnLabels as ActivityGraphColumnLabels,
	RowLabels as ActivityGraphRowLabels,
	Caption as ActivityGraphCaption,
	Legend as ActivityGraphLegend,
	LegendScale as ActivityGraphLegendScale,
	activityGraphVariants,
	activityLevelVariants,
	ACTIVITY_LEVELS,
	buildActivityModel,
	levelOf,
	type ActivityCell,
	type ActivityData,
	type ActivityDate,
	type ActivityGranularity,
	type ActivityLabel,
	type ActivityLevel,
	type ActivityModel,
	type ActivityRange,
	type ActivityWeekday
};
