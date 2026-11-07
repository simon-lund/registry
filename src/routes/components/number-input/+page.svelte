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

<Plate name="number-input" title="Number input" kind="Input · Svelte">
	<PlateStage example={example('demo')} />

	<PlateNotes>
		<PlateSection title="Intention">
			<p>
				A number you set by stepping or by typing, in one field. The digits roll to the new value, so
				you see what changed and which way, as an odometer shows a count going up. Most number fields
				get this wrong twice: the browser's own spinner is a pair of arrows a few pixels high that
				appear on hover, and the value changes without a trace. Here the chevrons are a column you
				can hit, and the change is visible.
			</p>
			<p>
				The field never holds an invalid value. What you type is taken the moment it reads as a
				number, and the bounds apply when you leave. Arrow keys step, Shift steps by ten, Home and
				End go to the bounds; a chevron held keeps stepping. Formatting is the locale's, through
				Intl.NumberFormat, so grouping, decimals and currencies come for free.
			</p>
			<p>The rolling digits follow NumberFlow by Maxwell Barvian, written again in Svelte with CSS only.</p>
		</PlateSection>

		<PlateSection title="Left out">
			<p>
				The mouse wheel does not change the value: a scroll over a form is not a decision. No
				slider: a slider is for roughly, this is for exactly. No unit typed into the field; a
				currency or a percent is part of the format, so it sits beside the digits and never gets
				edited away. No error state: a field that cannot hold an invalid value has none to show.
			</p>
		</PlateSection>

		<PlateSection title="States">
			<PlateStates>
				<PlateState label="Default" example={example('default')} />
				<PlateState label="At the upper bound: Increase is off" example={example('upper-bound')} />
				<PlateState label="A price, two decimals, euro" example={example('price')} />
				<PlateState label="Disabled" example={example('disabled')} />
				<PlateState label="AnimatedNumber alone: a count that only shows" example={example('animated-number')} />
			</PlateStates>
		</PlateSection>

		<PlateSection title="API">
			<PlateApi>
				<PlatePart name="NumberInput">
					<p>The field: the rolling number under a text input, and the two chevrons.</p>
					<PlateProps>
						<PlateProp name="value" type="number" default="0" bindable>The number. Always within min and max, rounded to the step.</PlateProp>
						<PlateProp name="min" type="number" default="-Infinity">The lower bound. Decrease turns off at it.</PlateProp>
						<PlateProp name="max" type="number" default="Infinity">The upper bound. Increase turns off at it.</PlateProp>
						<PlateProp name="step" type="number" default="1">One chevron press or arrow key. Shift steps ten. Its decimals set the rounding.</PlateProp>
						<PlateProp name="disabled" type="boolean" default="false">No typing, no stepping, faded.</PlateProp>
						<PlateProp name="locale" type="string">A BCP 47 tag for grouping and the decimal mark. The browser's language when left out.</PlateProp>
						<PlateProp name="format" type="Intl.NumberFormatOptions">How the value is shown, e.g. a currency or a percent.</PlateProp>
						<PlateProp name="size" type="'default' | 'lg'" default="'default'">40px or 56px high.</PlateProp>
						<PlateProp name="name" type="string">The form field's name.</PlateProp>
						<PlateProp name="id" type="string">The input's id, for a label's for.</PlateProp>
						<PlateProp name="aria-label" type="string">The name read out, when no label points at the field.</PlateProp>
						<PlateProp name="aria-labelledby" type="string">The id of the element that names the field.</PlateProp>
						<PlateProp name="onValueChange" type="(value: number) => void">Called with each new value.</PlateProp>
						<PlateProp name="ref" type="HTMLInputElement | null" default="null" bindable>The input element.</PlateProp>
						<PlateProp name="class" type="string">Merged onto the root.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="AnimatedNumber">
					<p>The rolling digits alone, for a count that only shows. NumberInput uses it inside.</p>
					<PlateProps>
						<PlateProp name="value" type="number" required>The number to show. A change rolls the digits.</PlateProp>
						<PlateProp name="locale" type="string">A BCP 47 tag. The browser's language when left out.</PlateProp>
						<PlateProp name="format" type="Intl.NumberFormatOptions">How the value is shown.</PlateProp>
						<PlateProp name="class" type="string">Merged onto the root.</PlateProp>
					</PlateProps>
				</PlatePart>
			</PlateApi>
		</PlateSection>

		<PlateSection title="Measurements">
			<PlateMeasures>
				<PlateMeasure label="Height" value="40px · lg 56px" />
				<PlateMeasure label="Text" value="16px · lg 24px, tabular figures" />
				<PlateMeasure label="Padding" value="12px" />
				<PlateMeasure label="Chevron column" value="32px, two halves" />
				<PlateMeasure label="Radius" value="8px (--radius)" />
				<PlateMeasure label="Focus ring" value="2px ring at 40 %, border to ring" />
				<PlateMeasure label="Roll" value="600ms cubic-bezier(.22, 1, .36, 1)" />
				<PlateMeasure label="Digit mask" value="fades over the top and bottom 25 %" />
				<PlateMeasure label="Hold to repeat" value="after 400ms, every 60ms" />
			</PlateMeasures>
		</PlateSection>
	</PlateNotes>
</Plate>
