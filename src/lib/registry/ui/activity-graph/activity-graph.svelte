<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	// Cell size and gap per granularity: the day view is GitHub-small; coarser views have fewer
	// cells and room to grow.
	export const activityGraphVariants = tv({
		base: 'group/activity-graph grid w-full max-w-max grid-cols-[auto_minmax(0,1fr)] items-start gap-y-3 [--ag-band:1rem] [--ag-radius:calc(var(--ag-cell)*0.25)]',
		variants: {
			granularity: {
				day: '[--ag-cell:calc(var(--spacing)*3)] [--ag-gap:calc(var(--spacing)*0.75)]',
				week: '[--ag-cell:calc(var(--spacing)*3)] [--ag-gap:calc(var(--spacing)*0.75)]',
				month: '[--ag-cell:calc(var(--spacing)*5)] [--ag-gap:var(--spacing)]',
				year: '[--ag-cell:calc(var(--spacing)*8)] [--ag-gap:calc(var(--spacing)*1.5)]'
			}
		}
	});
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { setActivityGraph } from './context.js';
	import {
		buildActivityModel,
		toDay,
		type ActivityCell,
		type ActivityData,
		type ActivityDate,
		type ActivityGranularity,
		type ActivityRange,
		type ActivityWeekday
	} from './model.js';

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		/** Values per calendar day, keyed `YYYY-MM-DD` (a count or any value); coarser cells sum their days. */
		data: ActivityData;
		/** What one cell covers. */
		granularity: ActivityGranularity;
		/** First and last day shown (inclusive). Default per granularity, ending today: day = the last 12 months, week = this and last year, month = three years, year = five. */
		range?: ActivityRange;
		/** BCP 47 locale for the month, weekday and year labels (`en-US`). */
		locale: string;
		/** First day of the week: 0 = Sunday … 6 = Saturday (Monday = 1). No default. */
		weekStartsOn: ActivityWeekday;
		/** The lowest value of levels 1–4, ascending (e.g. `[1, 2, 3, 4]` for times per week). Default: four equal steps up to the largest value in view. */
		thresholds?: readonly number[];
		/** The day the default range ends on (default: now). */
		today?: ActivityDate;
		/**
		 * The selected cell's key (`YYYY-MM-DD`), bindable; `null` until the reader picks one. Only
		 * drawn and exposed while an ActivityGraphCaption is in the graph.
		 */
		selected?: string | null;
	};

	/**
	 * ActivityGraph: a contribution graph for habits and routines (GitHub's grid of small rounded
	 * squares), one square per day, week, month or year, its tint the level of what happened there.
	 *
	 * The root owns the data and the layout; compose the parts inside it:
	 * - ActivityGraphRowLabels: weekdays (day view, every second one) or years, beside the rows;
	 * - ActivityGraphViewport: the horizontal scroller, opened at its newest (right) edge, holding
	 *   - ActivityGraphColumnLabels: months above the weeks, months or years above the columns,
	 *   - ActivityGraphGrid: the cells (ARIA grid, one tab stop, arrow keys), drawing each through
	 *     its `cell` snippet, in which the consumer renders an ActivityGraphCell with its words
	 *     (`aria-label`) and, if wanted, a TooltipTrigger around it;
	 * - ActivityGraphCaption (optional): a line under the grid with the selected cell's words. With
	 *   it, a tap on a cell (or near one) or the roving focus selects that cell (`aria-selected`, a
	 *   2px copper ring), so touch, where a tooltip never opens, gets the value too;
	 * - ActivityGraphLegend with ActivityGraphLegendScale: the five swatches between the consumer's
	 *   words ("Less" and "More").
	 *
	 * Forced colours: the levels keep their own fills (the colour is the data) and every cell gets
	 * a 1px CanvasText ring, so the grid and its empty days still read.
	 *
	 * Layouts: `day` = a column per week, a row per weekday (from `weekStartsOn`); `week` = a row
	 * per year, a column per week (the year of the week's fourth day); `month` = a row per year,
	 * twelve columns; `year` = one row. Oldest at the top left, newest at the bottom right.
	 *
	 * Levels: five tonal steps of ink, from a faint step above muted (nothing) to full foreground,
	 * darker for more in light, lighter in dark. Switching granularity fades the grid in (opacity
	 * only). No copy, no default locale or week start.
	 *
	 * @example
	 * <ActivityGraph data={days} granularity="day" locale="en-US" weekStartsOn={1}>
	 *   <ActivityGraphRowLabels />
	 *   <ActivityGraphViewport>
	 *     <ActivityGraphColumnLabels />
	 *     <ActivityGraphGrid aria-label="Reading, the last 12 months">
	 *       {#snippet cell({ cell })}<ActivityGraphCell {cell} aria-label={describe(cell)} />{/snippet}
	 *     </ActivityGraphGrid>
	 *   </ActivityGraphViewport>
	 *   <ActivityGraphCaption />
	 *   <ActivityGraphLegend>Less <ActivityGraphLegendScale /> More</ActivityGraphLegend>
	 * </ActivityGraph>
	 */
	let {
		ref = $bindable(null),
		class: className,
		data,
		granularity,
		range,
		locale,
		weekStartsOn,
		thresholds,
		today,
		selected = $bindable(null),
		children,
		...restProps
	}: Props = $props();

	const model = $derived(
		buildActivityModel({
			data,
			granularity,
			range,
			weekStartsOn,
			thresholds,
			today: today === undefined ? undefined : toDay(today)
		})
	);
	const byKey = $derived(new Map(model.cells.map((c) => [c.key, c])));

	let picked = $state<string | null>(null);
	// The tab stop: the cell the reader last moved to, or the newest when that one is gone.
	const activeKey = $derived(
		picked !== null && byKey.has(picked) ? picked : (model.cells[model.cells.length - 1]?.key ?? null)
	);

	let selectedLabel = $state<string | null>(null);
	let captions = $state(0);
	// A selection whose cell left the view (another range or granularity) is no selection.
	const selectedKey = $derived(selected !== null && byKey.has(selected) ? selected : null);
	// The words follow the cell when the consumer's labels change (new data, same cell).
	$effect(() => {
		void model;
		const key = selectedKey;
		if (!key || !ref) return;
		const label = ref
			.querySelector(`[data-slot="activity-graph-cell"][data-key="${key}"]`)
			?.getAttribute('aria-label');
		if (label !== undefined) selectedLabel = label;
	});

	setActivityGraph({
		get model() {
			return model;
		},
		get locale() {
			return locale;
		},
		get activeKey() {
			return activeKey;
		},
		cell: (key: string): ActivityCell | undefined => byKey.get(key),
		setActive(key: string) {
			picked = key;
		},
		get selecting() {
			return captions > 0;
		},
		get selectedKey() {
			return selectedKey;
		},
		get selectedLabel() {
			return selectedKey ? selectedLabel : null;
		},
		select(key: string, label: string | null) {
			selected = key;
			selectedLabel = label;
		},
		registerCaption() {
			untrack(() => captions++);
			return () => untrack(() => captions--);
		}
	});
</script>

<div
	bind:this={ref}
	data-slot="activity-graph"
	data-granularity={granularity}
	data-empty={model.total === 0 ? '' : undefined}
	style:--ag-cols={model.cols}
	class={cn(activityGraphVariants({ granularity }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
