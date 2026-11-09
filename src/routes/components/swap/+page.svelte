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
	import meta from '#lib/registry/ui/swap/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/swap/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="swap" title="Swap">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="swap" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<p>
			A <code>Swap</code> holds several things on one spot and shows one of them: the
			<code>SwapItem</code> marked <code>active</code>. It is not a button. Put one inside whatever
			changes, once for each part that changes.
		</p>
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="One spot" example={example('one-spot')}>
		All items stay in the layout, stacked in one grid cell, so the box is as wide as the widest and
		the words beside it never move. The ring here only shows the box. Keep exactly one item
		<code>active</code>, however many there are.
	</PlateExample>

	<PlateExample title="Icon only" example={example('icon')}>
		An item that holds an icon directly also shrinks and grows as it turns. Inactive items are
		hidden from screen readers, so give the button an <code>aria-label</code> that follows the state.
	</PlateExample>

	<PlateExample title="Motion" example={example('slowed')}>
		The motion is <a href="https://emilkowal.ski">Emil Kowalski</a>'s icon swap. Both items move at
		once: the outgoing one blurs and fades while the incoming one comes out of the same blur. An
		icon also shrinks to 25% and grows back from it; words only blur, because shrunk words read as a
		glitch. Here it runs ten times slower, with <code>--dur-base</code> set on a parent.
	</PlateExample>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Swap">
				<p>The box: one grid cell that holds the items. Takes every attribute of a <code>span</code>.</p>
				<PlateProps>
					<PlateProp name="children" type="Snippet">The <code>SwapItem</code>s.</PlateProp>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="SwapItem">
				<p>
					One of the things a <code>Swap</code> holds. Takes every attribute of a <code>span</code>.
					An inactive item is hidden from sight and from screen readers, so where the change matters,
					announce it with a live region, as the demo's <code>role="status"</code> does.
				</p>
				<PlateProps>
					<PlateProp name="active" type="boolean" default="false">The item currently shown.</PlateProp>
					<PlateProp name="children" type="Snippet" />
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Box" value="the widest and the tallest item, one grid cell" />
			<PlateMeasure label="Duration" value="220ms (--dur-base), both items at once" />
			<PlateMeasure label="Easing" value="cubic-bezier(0.22, 1, 0.36, 1) (--ease-settle)" />
			<PlateMeasure label="Blur" value="4px (--blur-swap) when inactive" />
			<PlateMeasure label="Icon scale" value="25% when inactive; words stay at 100%" />
			<PlateMeasure label="Reduced motion" value="a 120ms fade, no blur, no scale" />
		</PlateMeasures>
	</PlateSection>
</Plate>
