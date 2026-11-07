<script lang="ts">
	import {
		Plate,
		PlateStage,
		PlateNotes,
		PlateSection,
		PlateStates,
		PlateState,
		PlateApi,
		PlatePart,
		PlateProps,
		PlateProp,
		PlateMeasures,
		PlateMeasure
	} from '#lib/book/plate/index.js';
	import { examples } from '#lib/book/examples.js';
	import type { Component } from 'svelte';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<string>('./_examples/*.svelte', { eager: true, import: 'default', query: '?raw' })
	);
</script>

<Plate name="time-wheel" title="Time wheel" kind="Picker · Svelte">
	<PlateStage example={example('demo')} />

	<PlateNotes>
		<PlateSection title="Intention">
			<p>
				A time you set by turning, as the iOS picker does. Turning is how people already set a
				clock: the hand moves, and the value is wherever it stops.
			</p>
			<p>
				Others offer a dropdown of 1440 minutes, where the one you want is eleven screens down, or
				a text field that rejects "9:5" and says nothing about why. The wheel can only ever hold a
				valid time, so there is nothing to reject.
			</p>
			<p>
				Two styles share the one mechanism. Flat, where the neighbours shrink and fade, for a
				sheet on a phone. Drum, where the rows sit on a cylinder, where the picker is the whole
				screen's point.
			</p>
		</PlateSection>

		<PlateSection title="Left out">
			<p>Seconds: nobody sets a meeting to the second.</p>
			<p>A typed field beside the wheel. If typing is the right way in, use a text input and let it parse.</p>
			<p>Haptics: the web has none, and faking ticks with sound was worse than nothing.</p>
		</PlateSection>

		<PlateSection title="States">
			<PlateStates>
				<PlateState label="24 hours, flat" example={example('flat-24')} />
				<PlateState label="12 hours, flat, with am and pm" example={example('flat-12')} />
				<PlateState label="Drum" example={example('drum')} />
				<PlateState label="Keyboard: a focused column shows its ring; the arrows step a row at once" example={example('flat-24')} />
				<PlateState label="Wheel alone: one column, any list" example={example('wheel')} />
			</PlateStates>
		</PlateSection>

		<PlateSection title="API">
			<PlateApi>
				<PlatePart name="TimeWheel">
					<p>The picker: hours and minutes, and am/pm in 12 hours, under one highlight bar.</p>
					<PlateProps>
						<PlateProp name="date" type="Date" default="new Date()" bindable>Only its hours and minutes are read and written; the day stays.</PlateProp>
						<PlateProp name="format" type="'24' | '12'" default="'24'">12 adds the am/pm column.</PlateProp>
						<PlateProp name="variant" type="'flat' | 'drum'" default="'flat'">Flat: the neighbours shrink and fade. Drum: the rows sit on a cylinder.</PlateProp>
						<PlateProp name="onDateChange" type="(date: Date) => void">Called with each new time, as a new Date.</PlateProp>
						<PlateProp name="class" type="string">Merged onto the root.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="Wheel">
					<p>One column. TimeWheel is three of them; on its own it turns through any short list.</p>
					<PlateProps>
						<PlateProp name="items" type="(number | string)[]" required>The rows, top to bottom.</PlateProp>
						<PlateProp name="value" type="number | string" bindable>The selected item.</PlateProp>
						<PlateProp name="loop" type="boolean" default="true">Wrap around at the ends.</PlateProp>
						<PlateProp name="variant" type="'flat' | 'drum'" default="'flat'">As on TimeWheel.</PlateProp>
						<PlateProp name="label" type="string">The column's name, read out, e.g. "Hour".</PlateProp>
						<PlateProp name="onValueChange" type="(value: number | string) => void">Called with each new item.</PlateProp>
						<PlateProp name="class" type="string">Merged onto the root; set the column's width here.</PlateProp>
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
	</PlateNotes>
</Plate>
