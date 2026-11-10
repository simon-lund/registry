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
	import meta from '#lib/registry/ui/scroll-map/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/scroll-map/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="scroll-map" title="Scroll map">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="scroll-map" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<p>
			Set <code>target</code> to the element that scrolls, and each tick's <code>value</code> to the
			<code>id</code> of its section.
		</p>
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Side" example={example('side')}>
		<code>side="left"</code> puts the map before the scroll: the ticks hang from the left edge and
		the tooltips open to the right.
	</PlateExample>

	<PlateExample title="Size and dot" example={example('size-and-dot')}>
		<code>size="sm"</code> draws a shorter tick for a short turn. <code>dot</code> marks a section
		that carries attachments. The tooltip takes a title and a description.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>The ticks are one tab stop. <code>Tab</code> enters on the first tick in view.</li>
			<li><code>ArrowUp</code> and <code>ArrowDown</code> move between the ticks.</li>
			<li><code>Home</code> and <code>End</code> go to the first and the last tick.</li>
			<li><code>Enter</code> jumps to the section. Focus shows the tooltip.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="ScrollMap">
				<p>
					The map, a <code>nav</code>. While it shows, the target's own scrollbar is hidden and scrolling
					stays as it was. It hides itself where the primary pointer is coarse, phones and touch tablets,
					and the scrollbar comes back.
				</p>
				<PlateProps>
					<PlateProp name="target" type="HTMLElement | null | undefined" required>The scrolling element the map follows.</PlateProp>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="side" type={`"left" | "right"`} default={`"right"`}>The side of the scroll it stands on.</PlateProp>
					<PlateProp name="scrollMargin" type="number" default="16">Px left free above a section it jumps to.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ScrollMapTicks">
				<p>The column of ticks, with the band behind the ones in view. One tab stop.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ScrollMapTick">
				<p>One section. Hover or focus shows its children in a tooltip; a press or <code>Enter</code> jumps there. In view it has <code>data-in-view</code> and <code>aria-current="location"</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="string" required>The <code>id</code> of its section, looked up inside the target first.</PlateProp>
					<PlateProp name="aria-label" type="string" required>The section's title, as the tooltip is not always there.</PlateProp>
					<PlateProp name="size" type={`"default" | "sm"`} default={`"default"`} />
					<PlateProp name="dot" type="boolean" default="false">The section carries attachments.</PlateProp>
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ScrollMapTickTitle">
				<p>The section's title in the tooltip, two lines at most.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ScrollMapTickDescription">
				<p>A quieter line under the title.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ScrollMapPrevious">
				<p>Jumps to the section before the first one in view. Turned off at the start.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ScrollMapNext">
				<p>Jumps to the section after the first one in view. Turned off once the last section is in view.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="ref" type="HTMLButtonElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Map width" value="32px" />
			<PlateMeasure label="Tick row" value="10px high, 12px to press" />
			<PlateMeasure label="Tick line" value="16px · sm 10px, 2px thick" />
			<PlateMeasure label="Dot" value="4px, 4px from the line" />
			<PlateMeasure label="Band" value="foreground at 10%, 24px from the ticks' side: 4px around a long tick, 2px past the ticks in view" />
			<PlateMeasure label="Band glide" value="220ms (--dur-base), --ease-settle" />
			<PlateMeasure label="Tick colour" value="140ms (--dur-quick); hover stretches it to 125%" />
			<PlateMeasure label="Previous and next" value="32px, 44px to press; 90% on press, 80ms" />
			<PlateMeasure label="Tooltip" value="after 200ms, 8px away, at most 256px wide" />
			<PlateMeasure label="Jump" value="smooth; instant under reduced motion" />
		</PlateMeasures>
	</PlateSection>
</Plate>
