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
	import meta from '#lib/registry/ui/number-input/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/number-input/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="number-input" title="Number input">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="number-input" dependencies={meta.dependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Bounds" example={example('upper-bound')}>
		Set <code>min</code> and <code>max</code>. A chevron turns off at its bound, and a typed value
		is clamped when the field loses focus.
	</PlateExample>

	<PlateExample title="Format" example={example('price')}>
		Pass <code>Intl.NumberFormat</code> options to <code>format</code> for a currency, a percent or
		a unit. A <code>step</code> of 0.1 rounds to one decimal, so the value never drifts.
	</PlateExample>

	<PlateExample title="Size" example={example('size')}>
		<code>size="lg"</code> makes the field 56px high, for a number that is the point of the screen.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')} />

	<PlateExample title="Animated number" example={example('animated-number')}>
		<code>AnimatedNumber</code> is the rolling digits on their own, for a count that only shows.
		It follows NumberFlow by Maxwell Barvian, written again in Svelte with CSS only.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex flex-col gap-1 pl-5">
			<li><code>ArrowUp</code> and <code>ArrowDown</code> step; with <code>Shift</code>, ten steps.</li>
			<li><code>PageUp</code> and <code>PageDown</code> step ten.</li>
			<li><code>Home</code> and <code>End</code> go to <code>min</code> and <code>max</code>.</li>
			<li><code>Enter</code> takes what was typed. A chevron held keeps stepping.</li>
			<li>The mouse wheel does nothing: a scroll over a form is not a decision.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="NumberInput">
				<p>The field: the rolling number under a text input, and the two chevrons.</p>
				<PlateProps>
					<PlateProp name="value" type="number" default="0" bindable>Always within min and max, rounded to the step.</PlateProp>
					<PlateProp name="min" type="number" default="-Infinity" />
					<PlateProp name="max" type="number" default="Infinity" />
					<PlateProp name="step" type="number" default="1">Its decimals set the rounding.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="locale" type="string">A BCP 47 tag; the browser's language when left out.</PlateProp>
					<PlateProp name="format" type="Intl.NumberFormatOptions" />
					<PlateProp name="size" type={`"default" | "lg"`} default={`"default"`} />
					<PlateProp name="name" type="string">The form field's name.</PlateProp>
					<PlateProp name="id" type="string" />
					<PlateProp name="aria-label" type="string" />
					<PlateProp name="aria-labelledby" type="string" />
					<PlateProp name="onValueChange" type="(value: number) => void" />
					<PlateProp name="ref" type="HTMLInputElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="AnimatedNumber">
				<p>The rolling digits alone. <code>NumberInput</code> uses it inside.</p>
				<PlateProps>
					<PlateProp name="value" type="number" required />
					<PlateProp name="locale" type="string" />
					<PlateProp name="format" type="Intl.NumberFormatOptions" />
					<PlateProp name="class" type="string" />
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
</Plate>
