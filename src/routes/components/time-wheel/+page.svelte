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
	import meta from '#lib/registry/ui/time-wheel/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/time-wheel/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="time-wheel" title="Time wheel">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="time-wheel" dependencies={meta.dependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="12 hours" example={example('flat-12')}>
		<code>format="12"</code> adds an am/pm column. Only the hours and minutes of <code>date</code>
		change; its day stays.
	</PlateExample>

	<PlateExample title="Drum" example={example('drum')}>
		<code>variant="drum"</code> sets the rows on a cylinder, for a picker that is the whole
		screen's point. Flat, the default, suits a sheet on a phone.
	</PlateExample>

	<PlateExample title="Wheel" example={example('wheel')}>
		<code>Wheel</code> is one column on its own, for any short list. <code>TimeWheel</code> is
		three of them under one highlight bar.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>Each column is a focus stop. <code>ArrowUp</code> and <code>ArrowDown</code> move one row at once.</li>
			<li><code>Home</code> and <code>End</code> go to the first and last row.</li>
			<li>The mouse wheel steps one row; a click on a row turns to it.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="TimeWheel">
				<p>Hours and minutes, and am/pm in 12 hours, under one highlight bar.</p>
				<PlateProps>
					<PlateProp name="date" type="Date" default="new Date()" bindable>Only its hours and minutes are read and written.</PlateProp>
					<PlateProp name="format" type={`"24" | "12"`} default={`"24"`} />
					<PlateProp name="variant" type={`"flat" | "drum"`} default={`"flat"`} />
					<PlateProp name="onDateChange" type="(date: Date) => void" />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="Wheel">
				<p>One column, for any short list.</p>
				<PlateProps>
					<PlateProp name="items" type="(number | string)[]" required />
					<PlateProp name="value" type="number | string" bindable />
					<PlateProp name="loop" type="boolean" default="true">Wrap around at the ends.</PlateProp>
					<PlateProp name="variant" type={`"flat" | "drum"`} default={`"flat"`} />
					<PlateProp name="label" type="string">The column's name, read out, e.g. "Hour".</PlateProp>
					<PlateProp name="onValueChange" type="(value: number | string) => void" />
					<PlateProp name="class" type="string">Set the column's width here.</PlateProp>
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Row, flat" value="34 px" />
			<PlateMeasure label="Row, drum" value="36 px" />
			<PlateMeasure label="Window, flat" value="240 px (7 rows)" />
			<PlateMeasure label="Window, drum" value="260 px" />
			<PlateMeasure label="Highlight bar" value="40 px, radius 6 px" />
			<PlateMeasure label="Column" value="48 px flat · 64 px drum" />
			<PlateMeasure label="Drum radius" value="90 px" />
			<PlateMeasure label="Drum perspective" value="850 px" />
			<PlateMeasure label="Flat scale" value="1.1 centre → 0.95 − 0.08 per row, min 0.7" />
			<PlateMeasure label="Flat opacity" value="1 centre → 1 − 0.35 per row, min 0.05" />
			<PlateMeasure label="Drum fade" value="1 − (angle / 90)³, hidden past 90°" />
			<PlateMeasure label="Settle" value="embla, 20 frames · keyboard instant" />
		</PlateMeasures>
	</PlateSection>
</Plate>
