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
	import meta from '#lib/registry/ui/color-picker/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/color-picker/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="color-picker" title="Color picker">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="color-picker" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Hex" example={example('hex')}>
		<code>ColorPickerInput</code> takes any colour as hex, with a preview at its start. Bind it to the
		same <code>value</code> as the swatches and the two follow each other. Something that is not hex
		shows the field's invalid state after Enter or leaving it; say what to fix beside it.
	</PlateExample>

	<PlateExample title="Form" example={example('form')}>
		Set <code>name</code> to submit the picked colour with the form, and <code>required</code> so
		one must be picked.
	</PlateExample>

	<PlateExample title="Grid" example={example('grid')}>
		A wrapping row by default. Give it a grid class for rows of a set length. White and black keep a
		hairline, so they read on any surface.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')} />

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>The swatches are one tab stop. <code>Tab</code> enters at the picked one.</li>
			<li>The arrows move and pick, in both axes, and wrap at the ends.</li>
			<li>Hex field: <code>Enter</code> tidies the text to <code>#rrggbb</code>. <code>Escape</code> puts the current colour back; with nothing to undo it passes on, so an overlay still closes.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="ColorPicker">
				<p>The row of swatches, a radio group. Other props go to its <code>div</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="string" bindable>The picked swatch's value, exactly as written there. None is picked while it matches no swatch.</PlateProp>
					<PlateProp name="name" type="string">The form field's name. Without it nothing is submitted.</PlateProp>
					<PlateProp name="required" type="boolean" default="false" />
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="onValueChange" type="(value: string) => void" />
					<PlateProp name="aria-label" type="string">Or <code>aria-labelledby</code>. One of them is required.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerSwatch">
				<p>One colour, a radio. Other props go to its <code>button</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="string" required>Any CSS colour. What the picker's value becomes when it is picked.</PlateProp>
					<PlateProp name="aria-label" type="string" required>The colour's name.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerInput">
				<p>The hex field, a stock <code>Input</code> with the preview. Other props go to the <code>input</code>; <code>class</code> to its wrapper.</p>
				<PlateProps>
					<PlateProp name="value" type="string" bindable>The colour. Typing writes <code>#rrggbb</code>; any CSS colour shows in the preview.</PlateProp>
					<PlateProp name="invalid" type="boolean" default="false" bindable>The text cannot be read as hex, after Enter or blur.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="name" type="string">Submits the text with the form.</PlateProp>
					<PlateProp name="aria-label" type="string">Or <code>aria-labelledby</code>. One of them is required.</PlateProp>
					<PlateProp name="ref" type="HTMLInputElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Swatch" value="32px, 44px to touch, 8px apart" />
			<PlateMeasure label="Hairline" value="1px inside, foreground at 10%" />
			<PlateMeasure label="Picked" value="the disc at 70%, a 2px primary ring, 140ms on settle" />
			<PlateMeasure label="Press" value="92% on a free swatch" />
			<PlateMeasure label="Hex preview" value="20px, 6px in from the field's edge, concentric with its corners" />
			<PlateMeasure label="Disabled" value="50% opacity" />
		</PlateMeasures>
	</PlateSection>
</Plate>
