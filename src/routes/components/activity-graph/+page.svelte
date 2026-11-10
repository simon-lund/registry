<script lang="ts">
	import {
		Plate,
		PlateStage,
		PlateSection,
		PlateInstall,
		PlateExample,
		PlateApi,
		PlatePart,
		PlateProps,
		PlateProp,
		PlateMeasures,
		PlateMeasure,
		PlateCode
	} from '#lib/book/plate/index.js';
	import { examples, files, type Source } from '#lib/book/examples.js';
	import type { Component } from 'svelte';
	import meta from '#lib/registry/ui/activity-graph/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/activity-graph/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="activity-graph" title="Activity graph">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="activity-graph" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Granularity" example={example('granularity')}>
		Set <code>granularity</code> to <code>day</code>, <code>week</code>, <code>month</code> or
		<code>year</code>. A coarser square sums the days it covers, and the grid fades in on a switch.
	</PlateExample>

	<PlateExample title="Thresholds" example={example('thresholds')}>
		Pass the lowest value of levels 1 to 4 to <code>thresholds</code>, so a level means the same
		thing every week. Without it, the levels divide the largest value in view into four equal parts.
	</PlateExample>

	<PlateExample title="Range" example={example('range')}>
		Set <code>range</code> to the first and last day shown. Without it, the range ends on
		<code>today</code>: the last 12 months for days, this and last year for weeks, three years for
		months, five for years.
	</PlateExample>

	<PlateExample title="Selection" example={example('selection')}>
		Add <code>ActivityGraphCaption</code> to turn selection on. A tap or the arrow keys select a
		square and the line shows its words, so touch, where a tooltip never opens, gets the value too.
		<code>bind:selected</code> holds its key.
	</PlateExample>

	<PlateExample title="Tooltip" example={example('tooltip')}>
		Wrap each cell in a <code>TooltipTrigger</code> with the cell as its <code>payload</code>, under
		one <code>Tooltip</code>. The cell keeps its own tab stop, so the grid stays one stop.
	</PlateExample>

	<PlateExample title="Empty" example={example('empty')}>
		With no data every square sits at level 0, and the root has <code>data-empty</code>. Say what
		will appear in your own words.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>The grid is one tab stop. <code>Tab</code> enters on the newest square, or the last one visited.</li>
			<li><code>ArrowLeft</code> and <code>ArrowRight</code> move along a row; <code>ArrowUp</code> and <code>ArrowDown</code> move within a column. No wrap, and gaps are skipped.</li>
			<li><code>Home</code> and <code>End</code> go to the ends of the row.</li>
			<li><code>Ctrl+Home</code> and <code>Ctrl+End</code> go to the oldest and the newest square.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="ActivityGraph">
				<p>The root. It owns the data and the layout. Compose the other parts inside it.</p>
				<PlateProps>
					<PlateProp name="data" type="Record<string, number> | Map<string, number>" required>Values per day, keyed YYYY-MM-DD. A coarser cell sums its days.</PlateProp>
					<PlateProp name="granularity" type={`"day" | "week" | "month" | "year"`} required>What one cell covers.</PlateProp>
					<PlateProp name="locale" type="string" required>A BCP 47 tag for the labels. No default.</PlateProp>
					<PlateProp name="weekStartsOn" type="0 | 1 | 2 | 3 | 4 | 5 | 6" required>0 is Sunday, 1 is Monday. No default.</PlateProp>
					<PlateProp name="range" type={`{ start: string | Date; end: string | Date }`}>First and last day shown, both inclusive. Default per granularity, ending on today.</PlateProp>
					<PlateProp name="thresholds" type="readonly number[]">The lowest value of levels 1 to 4, ascending. Default: four equal steps up to the largest value in view.</PlateProp>
					<PlateProp name="today" type="string | Date" default="new Date()">The day the default range ends on. Fix it when the page is server-rendered.</PlateProp>
					<PlateProp name="selected" type="string | null" default="null" bindable>The selected cell's key. Only drawn while a caption is in the graph.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityGraphRowLabels">
				<p>Beside the rows, outside the scroller. Every second weekday in the day view, years in the week and month views, nothing in the year view. Place it first.</p>
				<PlateProps>
					<PlateProp name="format" type="(label: ActivityLabel) => string">Replaces the default: short weekday, numeric year.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityGraphViewport">
				<p>The sideways scroller around the column labels and the grid. It opens at the newest edge, and again whenever the layout changes.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityGraphColumnLabels">
				<p>The band above the grid: months over weeks, the twelve months over the month view, years over the year view.</p>
				<PlateProps>
					<PlateProp name="format" type="(label: ActivityLabel) => string">Replaces the default: short month, narrow month in the month view, numeric year.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityGraphGrid">
				<p>The cells, as an ARIA grid with one roving tab stop. It draws nothing itself: its <code>cell</code> snippet renders each one. Name it with one of the two ARIA props.</p>
				<PlateProps>
					<PlateProp name="cell" type={`Snippet<[{ cell: ActivityCell }]>`} required />
					<PlateProp name="aria-label" type="string">What the grid shows.</PlateProp>
					<PlateProp name="aria-labelledby" type="string">The id of a visible title that names it.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityGraphCell">
				<p>One rounded square, tinted by its level. It exposes <code>data-level</code>, <code>data-key</code> and, when selected, <code>data-selected</code>.</p>
				<PlateProps>
					<PlateProp name="cell" type="ActivityCell" required>The cell from the grid's snippet.</PlateProp>
					<PlateProp name="aria-label" type="string" required>What the cell holds, in words: its only name for assistive tech.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityGraphCaption">
				<p>The line under the grid with the selected cell's words. Placing it turns selection on. It keeps its height while empty.</p>
				<PlateProps>
					<PlateProp name="children" type={`Snippet<[{ cell: ActivityCell | null; label: string | null }]>`}>What the line says. Default: the cell's <code>aria-label</code>, nothing before a selection.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityGraphLegend">
				<p>The line that reads the scale, right-aligned. Put your words around an <code>ActivityGraphLegendScale</code>.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityGraphLegendScale">
				<p>The five level swatches, at the day view's cell size. Decorative: the cells carry their values in words.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="activityGraphVariants" kind="function">
				<p>The root's classes: cell size and gap per <code>granularity</code>.</p>
			</PlatePart>
			<PlatePart name="activityLevelVariants" kind="function">
				<p>The fill of a <code>level</code> from 0 to 4, for drawing your own swatch.</p>
			</PlatePart>
			<PlatePart name="ACTIVITY_LEVELS" kind="constant">
				<p>The levels in order, <code>[0, 1, 2, 3, 4]</code>, for a legend.</p>
			</PlatePart>
			<PlatePart name="buildActivityModel" kind="function">
				<p>The layout as a pure function, no DOM: takes <code>data</code>, <code>granularity</code>, <code>weekStartsOn</code> and optional <code>range</code>, <code>thresholds</code>, <code>today</code> (a Date). Returns an <code>ActivityModel</code>.</p>
			</PlatePart>
			<PlatePart name="levelOf" kind="function">
				<p><code>levelOf(value, max, thresholds?)</code> returns the level of a value. Zero and below is always level 0.</p>
			</PlatePart>
			<PlatePart name="ActivityCell" kind="type">
				<PlateProps head="Field">
					<PlateProp name="key" type="string">YYYY-MM-DD of the unit's first day, unique in the grid.</PlateProp>
					<PlateProp name="granularity" type="ActivityGranularity" />
					<PlateProp name="start" type="Date">First day counted: the unit's start, or the range start if later.</PlateProp>
					<PlateProp name="end" type="Date">Last day counted: the unit's end, or the range end if earlier.</PlateProp>
					<PlateProp name="value" type="number">The sum of the days' values.</PlateProp>
					<PlateProp name="level" type="ActivityLevel" />
					<PlateProp name="row" type="number" />
					<PlateProp name="col" type="number" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityLabel" kind="type">
				<PlateProps head="Field">
					<PlateProp name="date" type="Date">The date the label names.</PlateProp>
					<PlateProp name="index" type="number">The column or row it starts at.</PlateProp>
					<PlateProp name="span" type="number">How many columns or rows it may take.</PlateProp>
					<PlateProp name="unit" type={`"month" | "weekday" | "year"`} />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityModel" kind="type">
				<PlateProps head="Field">
					<PlateProp name="granularity" type="ActivityGranularity" />
					<PlateProp name="rows" type="(ActivityCell | null)[][]">Row by row; null is a position outside the range.</PlateProp>
					<PlateProp name="cols" type="number" />
					<PlateProp name="cells" type="ActivityCell[]">In time order, oldest first.</PlateProp>
					<PlateProp name="columnLabels" type="ActivityLabel[]" />
					<PlateProp name="rowLabels" type="ActivityLabel[]" />
					<PlateProp name="total" type="number">The sum over every cell.</PlateProp>
					<PlateProp name="max" type="number">The largest cell value, 0 when empty.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ActivityData" kind="type">
				<p><code>Record&lt;string, number&gt; | Map&lt;string, number&gt;</code></p>
			</PlatePart>
			<PlatePart name="ActivityDate" kind="type">
				<p><code>string | Date</code>. A longer ISO string is cut to its first 10 characters.</p>
			</PlatePart>
			<PlatePart name="ActivityRange" kind="type">
				<p><code>{`{ start: ActivityDate; end: ActivityDate }`}</code></p>
			</PlatePart>
			<PlatePart name="ActivityGranularity" kind="type">
				<p><code>"day" | "week" | "month" | "year"</code></p>
			</PlatePart>
			<PlatePart name="ActivityLevel" kind="type">
				<p><code>0 | 1 | 2 | 3 | 4</code>. 0 is nothing in this cell.</p>
			</PlatePart>
			<PlatePart name="ActivityWeekday" kind="type">
				<p><code>0 | 1 | 2 | 3 | 4 | 5 | 6</code>. Sunday is 0, as <code>Date.getDay()</code>.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Day and week cell" value="12px, gap 3px" />
			<PlateMeasure label="Month cell" value="20px, gap 4px" />
			<PlateMeasure label="Year cell" value="32px, gap 6px" />
			<PlateMeasure label="Cell radius" value="25% of the cell" />
			<PlateMeasure label="Levels 0 to 4" value="foreground mixed into muted in oklab: 10, 30, 50, 75, 100%" />
			<PlateMeasure label="Selected" value="2px outline in primary, 1px offset" />
			<PlateMeasure label="Focus" value="2px outline in ring, 1px offset" />
			<PlateMeasure label="Hover" value="1px outline in muted-foreground, 1px offset" />
			<PlateMeasure label="Column labels" value="16px band, 6px above the grid" />
			<PlateMeasure label="Row labels" value="8px from the grid" />
			<PlateMeasure label="Legend swatch" value="12px, radius 3px, gap 3px" />
			<PlateMeasure label="Fade on a switch" value="220ms (--dur-base), opacity only" />
		</PlateMeasures>
	</PlateSection>
</Plate>
