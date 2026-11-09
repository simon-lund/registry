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
	import meta from '#lib/registry/ui/view-change/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/view-change/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="view-change" title="View change">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="view-change" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<p>
			Wrap what changes and pass its <code>key</code>. When the key changes, the old content is gone
			at once and the new content comes in from <code>from</code>. <code>sideOf</code> gives the side
			from the entries' order: the next one from the right, an earlier one from the left.
		</p>
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="From a sidebar" example={example('sidebar')}>
		Set <code>from</code> to <code>"left"</code> when a page is opened from a sidebar on the left:
		every page comes from that side. Leave it unset until then, or the first render moves too.
	</PlateExample>

	<PlateExample title="Without motion" example={example('no-motion')}>
		Leave <code>from</code> undefined and the content is simply replaced. A keyboard shortcut is
		never animated.
	</PlateExample>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="ViewChange">
				<p>The wrapper, re-created on every new key. Takes every attribute of a <code>div</code>.</p>
				<PlateProps>
					<PlateProp name="key" type="unknown" required>What is shown; a change re-creates the content.</PlateProp>
					<PlateProp name="from" type="ViewSide">
						The side the new content comes from; none: no motion. Read when the key changes, so set it
						as the navigation starts (SvelteKit's <code>beforeNavigate</code>) and the content still
						showing stays put.
					</PlateProp>
					<PlateProp name="children" type="Snippet" />
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="sideOf" kind="function">
				<p>
					<code>sideOf(order: readonly string[], prev: string | null | undefined, next: string): ViewSide</code>.
					The side the view for <code>next</code> arrives from, given the entries' order from left to
					right. A later entry comes from the right. An earlier entry, an entry not in the order, or no
					change at all gives <code>"left"</code>.
				</p>
			</PlatePart>
			<PlatePart name="ViewSide" kind="type">
				<p><code>"left" | "right"</code>. The side a view comes in from.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Travel" value="8px, from the side" />
			<PlateMeasure label="Fade" value="opacity 0 to 1, with the travel" />
			<PlateMeasure label="Duration" value="220ms (--dur-base)" />
			<PlateMeasure label="Easing" value="cubic-bezier(0.22, 1, 0.36, 1) (--ease-settle)" />
			<PlateMeasure label="Reduced motion" value="a 120ms fade, no travel" />
		</PlateMeasures>
	</PlateSection>
</Plate>
