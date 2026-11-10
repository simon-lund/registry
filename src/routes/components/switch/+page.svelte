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
	import meta from '#lib/registry/ui/switch/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/switch/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="switch" title="Switch">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>Installing this replaces the stock shadcn-svelte Switch, and <code>Switch</code> keeps its name.</p>
		<PlateInstall name="switch" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Size" example={example('size')}>
		<code>size="sm"</code> is 40 by 24 for a dense row. Both sizes are 44px to touch.
	</PlateExample>

	<PlateExample title="Form" example={example('form')}>
		Set <code>name</code> to submit it with the form. A form reset puts it back to the state it
		mounted with, drawn and submitted alike, and does not call <code>onCheckedChange</code>.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')} />

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li><code>Space</code> and <code>Enter</code> toggle it.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Switch">
				<p>The track, the copper fill and the knob. It has no label of its own: use <code>label for</code> with an <code>id</code>, or <code>aria-labelledby</code>. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="checked" type="boolean" bindable>May be bound to an undefined value, which reads as off.</PlateProp>
					<PlateProp name="size" type={`"default" | "sm"`} default={`"default"`} />
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="name" type="string">The form field's name. Without it nothing is submitted.</PlateProp>
					<PlateProp name="value" type="string">What is submitted while on.</PlateProp>
					<PlateProp name="required" type="boolean" default="false" />
					<PlateProp name="onCheckedChange" type="(checked: boolean) => void" />
					<PlateProp name="id" type="string" />
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="switchVariants" kind="function">
				<p>The switch's classes and its <code>size</code> variant, from <code>tailwind-variants</code>.</p>
			</PlatePart>
			<PlatePart name="SwitchSize" kind="type">
				<p>The type of the <code>size</code> prop: <code>"default" | "sm"</code>.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Track" value="52 × 32px · sm 40 × 24px, with a 1px line" />
			<PlateMeasure label="Knob" value="24px · sm 16px, 4px from the edge" />
			<PlateMeasure label="Stretch" value="6px · sm 4px, toward where it will go" />
			<PlateMeasure label="Hit area" value="at least 44 × 44px" />
			<PlateMeasure label="Slide and fill" value="220ms (--dur-base) on --ease-settle" />
			<PlateMeasure label="Stretch opens" value="140ms (--dur-quick) on --ease-settle" />
			<PlateMeasure label="Line on hover" value="140ms (--dur-quick)" />
			<PlateMeasure label="Disabled" value="45% opacity" />
			<PlateMeasure label="Focus ring" value="2px ring colour, 2px out" />
			<PlateMeasure label="Reduced motion" value="the knob jumps, no stretch; the fill fades in 120ms" />
		</PlateMeasures>
	</PlateSection>
</Plate>
