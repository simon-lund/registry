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
	import meta from '#lib/registry/ui/rating/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/rating/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="rating" title="Rating">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>
			Built on bits-ui's RatingGroup. The design is after Klementine's Rating. It has no label or
			value text of its own: you give the name and the words for the value.
		</p>
		<PlateInstall name="rating" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Size" example={example('size')}>
		<code>size="sm"</code> is 16px, for a score in a list row; use it with <code>readonly</code>,
		which draws it in ink.
		The default is 32px stars in 44px cells. <code>"lg"</code> is for the one question on a screen.
	</PlateExample>

	<PlateExample title="Half stars" example={example('half')}>
		Set <code>allowHalf</code> to stop at halves: the left half of a star fills. The arrow keys then
		move by a half.
	</PlateExample>

	<PlateExample title="Read only" example={example('readonly')}>
		<code>readonly</code> shows a score without taking one. Its stars are ink, not copper: a score
		on display is not a value in your hand. It stays focusable, so a screen reader can read it, and
		carries <code>aria-readonly</code>.
	</PlateExample>

	<PlateExample title="Form" example={example('form')}>
		Set <code>name</code> to submit the value. A form reset puts it back to the value it mounted
		with, drawn and submitted alike, and does not call <code>onValueChange</code>.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')} />

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>It is one tab stop with the slider role.</li>
			<li><code>←</code> <code>→</code> (and <code>↑</code> <code>↓</code>) move by one star, or a half with <code>allowHalf</code>.</li>
			<li><code>Home</code> and <code>End</code> go to the ends.</li>
			<li>A digit sets that many stars: <code>2</code> <code>.</code> <code>5</code> for 2.5.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Rating">
				<p>The row. It draws <code>max</code> stars unless given children. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="number" bindable>May be bound to an undefined value, which reads as 0.</PlateProp>
					<PlateProp name="max" type="number" default="5" />
					<PlateProp name="allowHalf" type="boolean" default="false" />
					<PlateProp name="size" type={`"sm" | "default" | "lg"`} default={`"default"`} />
					<PlateProp name="readonly" type="boolean" default="false" />
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="aria-label" type="string">Required, or <code>aria-labelledby</code>.</PlateProp>
					<PlateProp name="aria-valuetext" type="string | (value, max) => string">Required: what the value says, in your words.</PlateProp>
					<PlateProp name="name" type="string">The form field's name. Without it nothing is submitted.</PlateProp>
					<PlateProp name="onValueChange" type="(value: number) => void" />
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="RatingItem">
				<p>One star, for the <code>index</code> the row's children hand out. Use it to draw your own stars. Also exported as <code>Item</code>.</p>
				<PlateProps>
					<PlateProp name="index" type="number">Required.</PlateProp>
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ratingVariants" kind="function">
				<p>The row's classes and its <code>size</code> variant, from <code>tailwind-variants</code>.</p>
			</PlatePart>
			<PlatePart name="ratingItemVariants" kind="function">
				<p>The cell's classes and its <code>size</code> variant.</p>
			</PlatePart>
			<PlatePart name="RatingSize" kind="type">
				<p>The type of the <code>size</code> prop.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Star" value="16px · 32px · 40px" />
			<PlateMeasure label="Cell" value="16px · 44px · 48px, so 44px to touch from the default up" />
			<PlateMeasure label="Fill" value="140ms (--dur-quick) on --ease-settle, clip-path only" />
			<PlateMeasure label="Sweep" value="35ms between stars, filling left to right and emptying right to left" />
			<PlateMeasure label="Hover" value="110% where the device can hover; 92% while pressed (--dur-press)" />
			<PlateMeasure label="Preview" value="copper at 50%" />
			<PlateMeasure label="Read only" value="ink" />
			<PlateMeasure label="Focus ring" value="2px ring colour, 2px out, round the whole row" />
			<PlateMeasure label="Disabled" value="45% opacity" />
			<PlateMeasure label="Reduced motion" value="no scale, no sweep" />
		</PlateMeasures>
	</PlateSection>
</Plate>
