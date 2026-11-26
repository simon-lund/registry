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
			many things lie in it. You compose it from parts, as shadcn's Table. It has no copy of its own:
			the counts and the words are yours.
		</p>
		<PlateInstall name="filter-matrix" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
		<p>
			<code>value</code> is the list of picked cells, each <code>&#123; row, column &#125;</code>, and nothing
			picked means no filter. Filter your own list with <code>matches(value, area, status)</code>. Give
			the root the ids of its <code>rows</code> and <code>columns</code> in order: the totals, the arrow
			keys and the tab stop are worked out from them.
		</p>
	</PlateSection>

	<PlateExample title="Picking" example={example('picking')}>
		A click toggles a cell, so the filter can be several cells at once: here <code>Work · Open</code>
		and <code>Home · Open</code>. A <code>FilterMatrixTotal</code> at the end of a row, or at the foot of
		a column, toggles that whole line, and the corner toggles everything. The second click of a
		double-click picks only that cell, or that line, and drops the rest. A picked cell is copper; a
		total is copper when its whole line is picked and full ink when some of it is.
	</PlateExample>

	<PlateSection title="A way to clear">
		<p>
			The keyboard has <code>Escape</code>, and a pointer has the double-click. A finger has neither for
			certain, so give the filter a button that clears it, as the example at the top does:
			<code>onclick=&#123;() =&gt; (value = [])&#125;</code>. Clearing and then picking one cell is also how
			you pick only that one by touch.
		</p>
	</PlateSection>

	<PlateExample title="More columns" example={example('columns')}>
		The table scrolls sideways inside its own box when the columns do not fit, and the page stays
		put. To keep the row names in sight, make them sticky with your own classes, on the surface the
		table sits on: <code>class="bg-card sticky left-0 z-10"</code>. The totals are parts too, so
		leave them out when you do not want them.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>It is one tab stop: the cell you were last on, or the first one.</li>
			<li><code>←</code> <code>→</code> <code>↑</code> <code>↓</code> move over every cell and total.</li>
			<li><code>Home</code> and <code>End</code> go to the start and the end of the row.</li>
			<li><code>Space</code> toggles, like a click.</li>
			<li><code>Enter</code> picks only this one, like a double-click.</li>
			<li><code>Escape</code> clears everything picked.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="FilterMatrix">
				<p>The table, in a box that scrolls sideways. It holds the value. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="rows" type="string[]">Required. The ids of the rows, in order.</PlateProp>
					<PlateProp name="columns" type="string[]">Required. The ids of the columns, in order.</PlateProp>
					<PlateProp name="value" type={`{ row: string; column: string }[]`} default="[]" bindable>The picked cells. Empty means no filter. A row or column that goes takes its picked cells with it.</PlateProp>
					<PlateProp name="onValueChange" type="(value) => void" />
					<PlateProp name="aria-label" type="string">Name the table, for example "Filter tasks".</PlateProp>
					<PlateProp name="ref" type="HTMLTableElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="FilterMatrixHeader">
				<p>The row of column names, a <code>thead</code>. <code>FilterMatrixBody</code> is the <code>tbody</code> and <code>FilterMatrixFooter</code> the <code>tfoot</code> for the column totals. Also exported as <code>Header</code>, <code>Body</code> and <code>Footer</code>.</p>
			</PlatePart>
			<PlatePart name="FilterMatrixRow">
				<p>One line, a <code>tr</code>. Also exported as <code>Row</code>.</p>
			</PlatePart>
			<PlatePart name="FilterMatrixHead">
				<p>The name of a row or of a column, a <code>th</code>. Every cell in that line is named by it for assistive tech. Without children it is an empty corner. Also exported as <code>Head</code>.</p>
				<PlateProps>
					<PlateProp name="row" type="string">The id of the row it names.</PlateProp>
					<PlateProp name="column" type="string">The id of the column it names. Give one of the two, or neither for a corner.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="FilterMatrixCell">
				<p>One cell, a toggle button. Its children are what it shows. It carries <code>data-state</code>: <code>active</code> or <code>inactive</code>. Also exported as <code>Cell</code>.</p>
				<PlateProps>
					<PlateProp name="row" type="string">Required. The id of its row.</PlateProp>
					<PlateProp name="column" type="string">Required. The id of its column.</PlateProp>
					<PlateProp name="aria-label" type="string">Without it, the cell is named by its two heads and its content.</PlateProp>
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="FilterMatrixTotal">
				<p>The end of a line, a toggle button for everything in it. Its children are what it shows. It carries <code>data-state</code>: <code>active</code>, <code>partial</code> or <code>inactive</code>. Also exported as <code>Total</code>.</p>
				<PlateProps>
					<PlateProp name="row" type="string">The id of the row it stands for.</PlateProp>
					<PlateProp name="column" type="string">The id of the column it stands for. Give one of the two, or neither for the whole grid.</PlateProp>
					<PlateProp name="aria-label" type="string">Required. What it stands for, in your words.</PlateProp>
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="matches" kind="function">
				<p><code>matches(value, row, column)</code> says whether a thing passes the filter. With nothing picked, everything does.</p>
			</PlatePart>
			<PlatePart name="filterMatrixCellVariants" kind="function">
				<p>The classes of a cell's and a total's button, with the variant <code>cell</code> or <code>total</code>, from <code>tailwind-variants</code>.</p>
			</PlatePart>
			<PlatePart name="FilterMatrixValue" kind="type">
				<p>One picked cell: <code>&#123; row: string; column: string &#125;</code>.</p>
			</PlatePart>
			<PlatePart name="FilterMatrixState" kind="type">
				<p>The type of <code>data-state</code>: <code>"active" | "partial" | "inactive"</code>.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Cell" value="36px high · 44px where the pointer is coarse; at least 44px wide; 4px apart" />
			<PlateMeasure label="Cell fill" value="a 6% tint of the text colour, 12% on hover; copper when picked" />
			<PlateMeasure label="Total" value="no fill; muted, full ink when some of its line is picked, copper when all of it is" />
			<PlateMeasure label="Change" value="140ms (--dur-quick) on --ease-settle, colour only" />
			<PlateMeasure label="Focus ring" value="2px ring colour, 2px out" />
		</PlateMeasures>
	</PlateSection>
</Plate>
