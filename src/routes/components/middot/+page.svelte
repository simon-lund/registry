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
	import meta from '#lib/registry/ui/middot/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/middot/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="middot" title="Middot">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="middot" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<p>Put it between two pieces of text, with no spaces around it. It takes the colour of the text.</p>
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="In a flex row" example={example('flex-row')}>
		Set <code>class="mx-0"</code> and let the row's gap space it.
	</PlateExample>

	<PlateExample title="Drawn, not typed" example={example('drawn-typed')}>
		A typed <code>·</code> gets whatever space the font's word spaces give it. Middot gets 0.4em on
		both sides at every size. Copying the text still gives "Tomorrow · 09:00 · Laundry", and screen
		readers still hear the separation.
	</PlateExample>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Middot">
				<p>The drawn dot, with the typed one as visually hidden text. Takes every attribute of a <code>span</code>.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Dot" value="0.2em, round" />
			<PlateMeasure label="Space" value="0.4em on both sides" />
			<PlateMeasure label="Colour" value="currentColor at 80%" />
			<PlateMeasure label="Position" value="vertical-align: middle; align-self: center in a flex row" />
		</PlateMeasures>
	</PlateSection>
</Plate>
