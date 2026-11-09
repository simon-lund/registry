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
	import meta from '#lib/registry/ui/stepper/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/stepper/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="stepper" title="Stepper">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="stepper" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Vertical" example={example('vertical')}>
		Set <code>orientation="vertical"</code>. A <code>StepperContent</code> may sit inside its item,
		under the trigger.
	</PlateExample>

	<PlateExample title="Bars" example={example('bars')}>
		Set <code>variant="bars"</code> on the list for a tight spot. The form has no words, so put them
		beside it and hide the list from screen readers.
	</PlateExample>

	<PlateExample title="Dots" example={example('dots')}>
		<code>variant="dots"</code> is the same with a dot per step. The current one is a quarter larger.
	</PlateExample>

	<PlateExample title="Free navigation" example={example('free')}>
		Set <code>linear={'{false}'}</code> and every step that is not disabled can be reached.
	</PlateExample>

	<PlateExample title="Done" example={example('done')}>
		By default the steps before the furthest one reached are done. Pass <code>done</code> on an item
		to say it yourself.
	</PlateExample>

	<PlateExample title="Icons" example={example('icons')}>
		Children of <code>StepperIndicator</code> replace the number until the step is done.
	</PlateExample>

	<PlateExample title="Loading" example={example('loading')}>
		Set <code>loading</code> on the item for a spinner in the indicator, and on
		<code>StepperNext</code> for one over its label. <code>validate</code> may return a promise.
	</PlateExample>

	<PlateExample title="Invalid" example={example('invalid')}>
		Set <code>invalid</code> on the item for the red dot, and say what is wrong in a
		<code>StepperDescription</code>. Set <code>--stepper-cutout</code> on a surface other than the
		background.
	</PlateExample>

	<PlateExample title="Disabled step" example={example('disabled')}>
		Set <code>disabled</code> on the item. It is never a button, and the next and previous buttons
		skip it.
	</PlateExample>

	<PlateExample title="In a form" example={example('form')}>
		Give the fields native constraints. <code>StepperNext</code> checks the current panel before it
		moves on, and <code>validate</code> adds your own rules. A submit with an invalid field in a
		hidden panel goes to that step first.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex flex-col gap-1 pl-5">
			<li>The triggers that are buttons share one tab stop: the current step, or the last one focused.</li>
			<li><code>ArrowLeft</code> and <code>ArrowRight</code> move the focus along a horizontal list, <code>ArrowUp</code> and <code>ArrowDown</code> along a vertical one. They wrap around, and they do not switch steps.</li>
			<li><code>Home</code> and <code>End</code> go to the first and last trigger.</li>
			<li><code>Enter</code> and <code>Space</code> go to the focused step.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Stepper">
				<p>The root: holds the current step and lays out the list and the panels. It is a size container, so inside a flex row give it a width.</p>
				<PlateProps>
					<PlateProp name="value" type="number" default="1" bindable>The current step, from 1.</PlateProp>
					<PlateProp name="orientation" type="StepperOrientation" default={`"horizontal"`} />
					<PlateProp name="linear" type="boolean" default="true">Forward only past done steps. false: any step that is not disabled.</PlateProp>
					<PlateProp name="onValueChange" type="(value: number) => void">Called whenever a part inside changes the step.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperList">
				<p>The steps, an <code>ol</code>. Name it with <code>aria-label</code> or <code>aria-labelledby</code>.</p>
				<PlateProps>
					<PlateProp name="variant" type="StepperListVariant" default={`"default"`} />
					<PlateProp name="ref" type="HTMLOListElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperItem">
				<p>One step, an <code>li</code>. Its look is its <code>data-state</code>: active wins over done, everything else is pending.</p>
				<PlateProps>
					<PlateProp name="value" type="number" required>The step's place, from 1.</PlateProp>
					<PlateProp name="done" type="boolean">By default, whether the step lies before the furthest one reached.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false">Dimmed, never a button, skipped by the next and previous buttons.</PlateProp>
					<PlateProp name="loading" type="boolean" default="false">A spinner in the indicator, <code>aria-busy</code> on the trigger.</PlateProp>
					<PlateProp name="invalid" type="boolean" default="false">A small red dot on the indicator.</PlateProp>
					<PlateProp name="ref" type="HTMLLIElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperTrigger">
				<p>Holds the indicator, title and description. A button while the step can be reached, otherwise plain text. Named by its title, described by its description.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperIndicator">
				<p>The step's circle, or its bar or dot in the inline lists. Decoration, hidden from screen readers. Children replace the number. Set <code>--stepper-cutout</code> to the surface's colour for the invalid dot's ring.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperTitle">
				<p>The step's name, a word or two. It names the trigger and the step's panel. To say "done" to a screen reader, put it here in an <code>sr-only</code> span.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperDescription">
				<p>A short line under the title. It describes the trigger.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperSeparator">
				<p>The line to the next step. Put it in every item but the last. Not drawn in the inline lists.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperContent">
				<p>What one step holds. The others stay in the page, hidden, so what was typed survives and still submits.</p>
				<PlateProps>
					<PlateProp name="value" type="number" required>The step this panel belongs to.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperPrevious">
				<p>A stock Button that goes one step back, skipping disabled steps. On the first step it dims and keeps focus. Takes every Button prop.</p>
				<PlateProps>
					<PlateProp name="variant" type="ButtonVariant" default={`"outline"`} />
					<PlateProp name="loading" type="boolean" default="false">A Spinner over the label, <code>aria-busy</code>, clicks do nothing.</PlateProp>
					<PlateProp name="disabled" type="boolean">The native attribute: focus is lost.</PlateProp>
					<PlateProp name="onclick" type="(event: MouseEvent) => void">Call <code>preventDefault</code> to stay.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="StepperNext">
				<p>A stock Button that goes one step on, once the current panel passes. On the last step it dims and keeps focus. Takes every Button prop. It ignores linear navigation.</p>
				<PlateProps>
					<PlateProp name="validate" type="(panel: HTMLElement, step: number) => boolean | void | Promise<boolean | void>">Runs first. Set messages with <code>setCustomValidity</code>, or return false to stay.</PlateProp>
					<PlateProp name="novalidate" type="boolean" default="false">Skip the check of the panel's fields. <code>validate</code> still runs.</PlateProp>
					<PlateProp name="variant" type="ButtonVariant" default={`"outline"`}><code>"default"</code> is the copper one.</PlateProp>
					<PlateProp name="loading" type="boolean" default="false">A Spinner over the label, <code>aria-busy</code>, clicks do nothing.</PlateProp>
					<PlateProp name="disabled" type="boolean">The native attribute: focus is lost.</PlateProp>
					<PlateProp name="onclick" type="(event: MouseEvent) => void">Call <code>preventDefault</code> to stay.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="stepperListVariants" kind="function">
				<p>The list's classes, from <code>variant</code> and <code>orientation</code>.</p>
			</PlatePart>
			<PlatePart name="stepperItemVariants" kind="function">
				<p>The item's classes, from <code>layout</code>: <code>"horizontal"</code>, <code>"vertical"</code> or <code>"inline"</code>.</p>
			</PlatePart>
			<PlatePart name="StepperOrientation" kind="type">
				<p><code>"horizontal" | "vertical"</code></p>
			</PlatePart>
			<PlatePart name="StepperListVariant" kind="type">
				<p><code>"default" | "bars" | "dots"</code></p>
			</PlatePart>
			<PlatePart name="StepperItemState" kind="type">
				<p><code>"active" | "done" | "pending"</code></p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Indicator" value="32px circle, 1.5px ring when pending" />
			<PlateMeasure label="Done disc" value="foreground at 12%" />
			<PlateMeasure label="Hit area" value="44px tall around the 32px row" />
			<PlateMeasure label="Title" value="14px, medium · active semibold" />
			<PlateMeasure label="Description" value="12px" />
			<PlateMeasure label="Separator" value="2px, at least 16px long" />
			<PlateMeasure label="Separator fill" value="220ms" />
			<PlateMeasure label="Glyph swap" value="220ms blurred cross-fade (Swap)" />
			<PlateMeasure label="Done disc grows" value="220ms from the centre, shrinks in 140ms" />
			<PlateMeasure label="Press" value="94% in 80ms" />
			<PlateMeasure label="Invalid dot" value="10px, 2px cutout, centred on the edge at 45°" />
			<PlateMeasure label="Bars" value="24 × 6px, 4px apart" />
			<PlateMeasure label="Dots" value="8px, 8px apart · current 125%" />
			<PlateMeasure label="Disabled step" value="45% opacity" />
			<PlateMeasure label="Narrow" value="under 30rem: only the current title shows" />
		</PlateMeasures>
	</PlateSection>
</Plate>
