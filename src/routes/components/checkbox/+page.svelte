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
	import meta from '#lib/registry/ui/checkbox/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/checkbox/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="checkbox" title="Checkbox">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>Installing this replaces the stock shadcn-svelte Checkbox, and <code>Checkbox</code> keeps its name.</p>
		<PlateInstall name="checkbox" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Indeterminate" example={example('indeterminate')}>
		Set <code>indeterminate</code> while some of a group are checked: the box shows a dash. Checking
		it then checks all of them.
	</PlateExample>

	<PlateExample title="Form" example={example('form')}>
		Set <code>name</code> to submit it with the form. It always sends a value:
		<code>newsletter=on</code> while checked, <code>newsletter=off</code> while not. Only a disabled
		box sends nothing, so a missing field means no change, never off. A form reset puts it back to
		the state it mounted with.
	</PlateExample>

	<PlateExample title="Invalid" example={example('invalid')}>
		Set <code>aria-invalid</code> for the destructive line and ring, and say what to do beside it.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')} />

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li><code>Space</code> toggles it.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Checkbox">
				<p>The box. It has no label of its own: use <code>label for</code> with an <code>id</code>, or wrap it in the label. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="checked" type="boolean" default="false" bindable />
					<PlateProp name="indeterminate" type="boolean" default="false" bindable>Shows the dash. Checking it clears it.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="name" type="string">The form field's name. Without it nothing is submitted.</PlateProp>
					<PlateProp name="value" type="string" default={`"on"`}>What is submitted while checked.</PlateProp>
					<PlateProp name="uncheckedValue" type="string" default={`"off"`}>What is submitted while not.</PlateProp>
					<PlateProp name="required" type="boolean" default="false" />
					<PlateProp name="onCheckedChange" type="(checked: boolean) => void" />
					<PlateProp name="aria-invalid" type="boolean">The destructive line and ring.</PlateProp>
					<PlateProp name="id" type="string" />
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Box" value="16px, 4px radius, 1px line; 44px to touch" />
			<PlateMeasure label="Mark" value="14px, a 2.25 stroke, round ends" />
			<PlateMeasure label="Fill in" value="from 40% at the centre, 140ms (--dur-quick) on --ease-settle" />
			<PlateMeasure label="Mark in" value="drawn along its stroke, 220ms (--dur-base) on --ease-settle, 70ms after the fill starts" />
			<PlateMeasure label="Out" value="mark and fill together, 140ms on --ease-exit" />
			<PlateMeasure label="Press" value="92%" />
			<PlateMeasure label="Focus ring" value="3px ring at 50%, line to ring, as Input" />
			<PlateMeasure label="Reduced motion" value="the fill and mark cross-fade" />
		</PlateMeasures>
	</PlateSection>
</Plate>
