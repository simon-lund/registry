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
	import meta from '#lib/registry/ui/filter-matrix/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/filter-matrix/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="filter-matrix" title="Filter matrix">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>
			Two filters, such as an area and a status, are usually two dropdowns. Here they are one grid: the
			areas are the rows, the statuses the columns (usually the shorter list), and every cell says how
			many things lie in it. It has no dependencies and no copy of its own: you give the words.
		</p>
		<PlateInstall name="filter-matrix" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
		<p>
			<code>value</code> is the list of cells picked, and nothing picked means no filter. Filter your own
			list with <code>matches(value, area, status)</code>. The counts are yours to keep up to date.
		</p>
	</PlateSection>

	<PlateExample title="Picking" example={example('gestures')}>
		A click toggles a cell, so the filter can be several cells at once: here <code>Work · Open</code>
		and <code>Home · Open</code>. The number at the end of a row, or at the foot of a column, picks that
		whole line, and drops it again when all of it is picked. The corner picks everything. A
		double-click drops all that is picked and picks only that cell, or that line. Picked cells are
		copper, and a total is copper when its whole line is picked.
	</PlateExample>

	<PlateExample title="More statuses" example={example('few')}>
		The columns scroll sideways inside the grid when they do not fit, and the row labels stay at the
		left. It is meant for a few columns, so keep the shorter list as the columns.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>It is one tab stop. <code>←</code> <code>→</code> <code>↑</code> <code>↓</code> move over every cell and total.</li>
			<li><code>Home</code> and <code>End</code> go to the start and the end of the row.</li>
			<li><code>Space</code> toggles, like a click.</li>
			<li><code>Enter</code> picks only this one, like a double-click.</li>
			<li><code>Escape</code> clears everything picked.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="FilterMatrix">
				<p>The grid, with its totals. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="rows" type={`{ id: string; label: string }[]`}>One dimension, down the side.</PlateProp>
					<PlateProp name="columns" type={`{ id: string; label: string }[]`}>The other, along the top; usually the shorter.</PlateProp>
					<PlateProp name="counts" type="Record<string, number>">How many things lie in each cell, by <code>cellKey(row, column)</code>. A missing cell is 0.</PlateProp>
					<PlateProp name="value" type="string[]" default="[]" bindable>The cells picked, as cell keys. Empty means no filter.</PlateProp>
					<PlateProp name="cellLabel" type="(info) => string">Required. What a cell holds, in your words, for the screen reader and the tooltip. <code>info</code> has <code>row</code> and <code>column</code> for a cell, one of them for a total, neither for the corner, and always <code>count</code>.</PlateProp>
					<PlateProp name="onValueChange" type="(value: string[]) => void" />
					<PlateProp name="aria-label" type="string">Name the grid, for example "Filter tasks".</PlateProp>
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="cellKey" kind="function">
				<p><code>cellKey(row, column)</code> is the key of one cell, <code>"row|column"</code>.</p>
			</PlatePart>
			<PlatePart name="matches" kind="function">
				<p><code>matches(value, row, column)</code> says whether a thing falls inside the filter. With nothing picked, everything does.</p>
			</PlatePart>
			<PlatePart name="selectedCount" kind="function">
				<p><code>selectedCount(value, counts)</code> says how many things the filter lets through: all of them when nothing is picked.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Cell" value="36px high · 44px where the pointer is coarse; at least 44px wide; 4px apart" />
			<PlateMeasure label="Fill" value="a 6% tint of the text colour, 12% on hover; copper when picked" />
			<PlateMeasure label="Totals" value="no fill; muted, copper when the whole line is picked" />
			<PlateMeasure label="Change" value="140ms (--dur-quick) on --ease-settle, colour only" />
			<PlateMeasure label="Double-click on a phone" value="touch-action: manipulation, so the page does not zoom" />
			<PlateMeasure label="Row labels" value="sticky at the left, on --filter-ground" />
		</PlateMeasures>
	</PlateSection>
</Plate>
