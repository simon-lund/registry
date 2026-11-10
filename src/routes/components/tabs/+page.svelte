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
	import meta from '#lib/registry/ui/tabs/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/tabs/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="tabs" title="Tabs">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>Installing this replaces the stock shadcn-svelte Tabs, and <code>Tabs</code>, <code>TabsList</code>, <code>TabsTrigger</code> and <code>TabsContent</code> keep their names.</p>
		<PlateInstall name="tabs" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Radio" example={example('radio')}>
		Set <code>mode="radio"</code> for a single choice with no panels. The list becomes a
		radiogroup and each trigger a radio with <code>aria-checked</code>; look, motion and keys stay
		the same.
	</PlateExample>

	<PlateExample title="Icons" example={example('icons')}>
		Put a <code>@lucide/svelte</code> icon inside the trigger. It is 16px unless you give it a size.
	</PlateExample>

	<PlateExample title="Content-sized" example={example('content-sized')}>
		Segments share the width by default. Give the list <code>w-fit</code> and the triggers
		<code>flex-none</code> to size them by their labels.
	</PlateExample>

	<PlateExample title="Overflow" example={example('overflow')}>
		No setting: a segment never shrinks below its label, so the track scrolls sideways. The selected
		segment is scrolled into view, and the edge with more behind it fades where the browser has
		scroll-state container queries.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')}>
		Set <code>disabled</code> on a trigger to dim it and skip it with the arrow keys, or on
		<code>Tabs</code> to dim the whole list once.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li><code>ArrowLeft</code> and <code>ArrowRight</code> move along the segments and select, and loop at the ends.</li>
			<li><code>Home</code> and <code>End</code> go to the first and the last segment.</li>
			<li><code>Enter</code> and <code>Space</code> select the focused segment.</li>
			<li>After a key step the key jumps and the panel switches at once, because the focus ring has already moved.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Tabs">
				<p>The root: holds the selected value and stacks the list above its panels. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="string" default={`""`} bindable>The selected segment.</PlateProp>
					<PlateProp name="mode" type={`"tabs" | "radio"`} default={`"tabs"`}>Tablist with panels, or radiogroup without.</PlateProp>
					<PlateProp name="onValueChange" type="(value: string) => void" />
					<PlateProp name="activationMode" type={`"automatic" | "manual"`} default={`"automatic"`}>Whether an arrow key selects, or only moves focus.</PlateProp>
					<PlateProp name="loop" type="boolean" default="true">Whether focus wraps at the ends.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TabsList">
				<p>The track, holding the triggers and nothing else. It draws the key. Also exported as <code>List</code>.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string">What the segments choose between, read out.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TabsTrigger">
				<p>One segment: its label, with an optional count or icon. Also exported as <code>Trigger</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="string" required />
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TabsCount">
				<p>A quiet tabular count after a segment's label. Also exported as <code>Count</code>.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TabsContent">
				<p>The panel for one value, hidden while its segment is not selected. Also exported as <code>Content</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="string" required />
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="tabsListVariants" kind="function">
				<p>The list's classes, from <code>tailwind-variants</code>, for drawing a track of your own.</p>
			</PlatePart>
			<PlatePart name="tabsTriggerVariants" kind="function">
				<p>The trigger's classes, from <code>tailwind-variants</code>.</p>
			</PlatePart>
			<PlatePart name="TabsMode" kind="type">
				<p>The type of the <code>mode</code> prop: <code>"tabs" | "radio"</code>.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Track" value="44px high, a pill with a 1px border and 3px of padding inside it; segments scroll inside the border" />
			<PlateMeasure label="Segment" value="36px high, 44px to touch, 14px side padding, 2px gap" />
			<PlateMeasure label="Label" value="14px, weight 500; count 12px" />
			<PlateMeasure label="Icon" value="16px, 6px from the label" />
			<PlateMeasure label="Key" value="the selected segment's box, with a 1px line" />
			<PlateMeasure label="Key slide" value="clip-path, 220ms (--dur-base) on --ease-settle" />
			<PlateMeasure label="Panel" value="8px of travel, a fade and the 4px swap blur, 220ms (--dur-base) on --ease-settle" />
			<PlateMeasure label="Label hover" value="140ms (--dur-quick)" />
			<PlateMeasure label="Disabled" value="45% opacity" />
			<PlateMeasure label="Focus ring" value="2px ring colour, 1px out" />
			<PlateMeasure label="Scroll" value="the selection 16px clear of the edge; a 44px fade, solid across the round end, the selection above it" />
		</PlateMeasures>
	</PlateSection>
</Plate>
