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
	import meta from '#lib/registry/ui/chain-of-thought/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/chain-of-thought/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="chain-of-thought" title="Chain of Thought">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>
			Built on bits-ui's Collapsible. The design is after Vercel's AI Elements, whose Chain of
			Thought it follows, with composed parts in place of its label, description and icon props.
			It has no copy of its own.
		</p>
		<PlateInstall name="chain-of-thought" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Streaming" example={example('streaming')}>
		Append a <code>ChainOfThoughtStep</code> as each step arrives: it fades in and slides 4px into
		place. Mark the one under way <code>status="active"</code> and the others <code>"done"</code>. Its
		glyph is copper and breathes, because it is the one thing happening now. When the run ends, set
		it to <code>"done"</code>.
	</PlateExample>

	<PlateExample title="What a step found" example={example('content')}>
		A <code>ChainOfThoughtStepContent</code> hangs off the rail under its label. Put a paragraph, a
		<code>ChainOfThoughtSearchResults</code> list of links (see the first example) or a
		<code>ChainOfThoughtImage</code> in it.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li><code>Space</code> and <code>Enter</code> on the header fold and unfold the steps.</li>
			<li>The links inside are in the tab order only while it is open.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="ChainOfThought">
				<p>The collapsible root. Closed by default, because the answer matters more. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="open" type="boolean" default="false" bindable />
					<PlateProp name="onOpenChange" type="(open: boolean) => void" />
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ChainOfThoughtHeader">
				<p>The line that folds the steps: your glyph and words, and a caret that turns. Also exported as <code>Header</code>.</p>
			</PlatePart>
			<PlatePart name="ChainOfThoughtContent">
				<p>The ordered list of steps, unfolding and folding as the root does. Folded, it stays in the page as <code>hidden="until-found"</code>. Also exported as <code>Content</code>.</p>
				<PlateProps>
					<PlateProp name="hiddenUntilFound" type="boolean" default="true">Set to false to unmount the steps while folded.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ChainOfThoughtStep">
				<p>One step on the rail. Also exported as <code>Step</code>.</p>
				<PlateProps>
					<PlateProp name="status" type={`"done" | "active" | "pending"`} default={`"done"`} />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ChainOfThoughtStepIcon">
				<p>The step's glyph, or a dot when empty. Decorative. Also exported as <code>StepIcon</code>.</p>
			</PlatePart>
			<PlatePart name="ChainOfThoughtStepLabel">
				<p>The step's short line. Also exported as <code>StepLabel</code>.</p>
			</PlatePart>
			<PlatePart name="ChainOfThoughtStepDescription">
				<p>A quieter line under the label. Also exported as <code>StepDescription</code>.</p>
			</PlatePart>
			<PlatePart name="ChainOfThoughtStepContent">
				<p>What the step found, hanging off the rail. Also exported as <code>StepContent</code>.</p>
			</PlatePart>
			<PlatePart name="ChainOfThoughtSearchResults">
				<p>A wrapping list of sources. Give it an <code>aria-label</code>. Also exported as <code>SearchResults</code>.</p>
			</PlatePart>
			<PlatePart name="ChainOfThoughtSearchResult">
				<p>One source as a link, with an optional glyph or favicon first. Also exported as <code>SearchResult</code>.</p>
				<PlateProps>
					<PlateProp name="href" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ChainOfThoughtImage">
				<p>A figure in a flat frame, at most 320px wide. Also exported as <code>Image</code>.</p>
			</PlatePart>
			<PlatePart name="ChainOfThoughtImageCaption">
				<p>The line under an image. Also exported as <code>ImageCaption</code>.</p>
			</PlatePart>
			<PlatePart name="ChainOfThoughtStepStatus" kind="type">
				<p>The type of <code>status</code>: <code>"done" | "active" | "pending"</code>.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Header" value="36px high, 44px to touch; 14px, weight 500" />
			<PlateMeasure label="Caret turn" value="220ms (--dur-base) on --ease-settle" />
			<PlateMeasure label="Unfold, fold" value="220ms (--dur-base) in, 140ms (--dur-quick) out; height and opacity" />
			<PlateMeasure label="Icon column" value="20px, a 16px glyph; the label sits level on a 20px line" />
			<PlateMeasure label="Rail" value="1px, the border colour, from under one icon to the next" />
			<PlateMeasure label="New step" value="220ms: fades in and slides 4px down" />
			<PlateMeasure label="Active glyph" value="copper, opacity breathing in 1.6s" />
			<PlateMeasure label="Source link" value="32px high, a flat pill; 44px to touch" />
			<PlateMeasure label="Image frame" value="6px around, at most 320px wide" />
			<PlateMeasure label="Reduced motion" value="a fade instead of the unfold, no caret turn, no breathing" />
		</PlateMeasures>
	</PlateSection>
</Plate>
