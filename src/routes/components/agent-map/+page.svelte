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
	import meta from '#lib/registry/ui/agent-map/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/agent-map/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="agent-map" title="Agent map">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>
			After <a href="https://www.reddit.com/r/ClaudeAI/comments/1xst2qe/">a Claude Code mod shared on
			r/ClaudeAI</a> that draws a live map of what the agent is doing, redrawn in this registry's ink and
			copper: the agent in the middle, what it reaches for round it, every call going out along a line,
			and the log of calls beside it. The run on this page is made up; your app turns the agent's
			events into calls and passes them in.
		</p>
		<PlateInstall name="agent-map" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Selection" example={example('selected')}>
		Select a node to read its calls: its line turns copper and the log keeps only its rows. Bind
		<code>selected</code> to read or set it. Here the shell has failed twice, and the hook blocked
		a recursive delete; the failed calls sit as a number on each node's corner.
	</PlateExample>

	<PlateExample title="Subagents" example={example('subagents')}>
		A call with <code>from</code> came from another node, not the agent: two subagents asking the
		model and reading files. It draws its own curve, bent round the agent, and the dot travels
		along it.
	</PlateExample>

	<PlateExample title="Before the first call" example={example('empty')}>
		Every node is drawn from the start, quiet, so the map never rearranges as the agent reaches
		for something new.
	</PlateExample>

	<PlateSection title="What it leaves out">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>
				A call is running, done or failed. A blocked call is a failed one with its reason in the
				label. A model switch is a call to the model, with the switch as its label.
			</li>
			<li>No colour per node and no red: ink says something is in use, copper only what you selected, as in the agent tree.</li>
			<li>It keeps nothing. The app turns the agent's events into calls and passes them in.</li>
		</ul>
	</PlateSection>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>Each node is a button: <code>Tab</code> moves between them, <code>Enter</code> or <code>Space</code> selects one, again to let go.</li>
			<li>The status line is read out as it changes; the log is not, so a busy run does not talk over you.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="AgentMap">
				<p>Holds the nodes, the calls and the selection for its parts. Lay the parts out as you like.</p>
				<PlateProps>
					<PlateProp name="nodes" type="AgentMapNode[]" required>From the top, clockwise.</PlateProp>
					<PlateProp name="calls" type="AgentCall[]" default="[]">Oldest first.</PlateProp>
					<PlateProp name="context" type="number | null" default="null">How full the context is, 0 to 1.</PlateProp>
					<PlateProp name="selected" type="string | null" default="null" bindable>The selected node's id.</PlateProp>
					<PlateProp name="onSelect" type="(id: string | null) => void" />
					<PlateProp name="class" type="string">Any other attribute of a div is passed on.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="AgentMapGraph">
				<p>The map: square, as wide as it may be up to 448px. Put AgentMapHub inside.</p>
				<PlateProps>
					<PlateProp name="icon" type="Snippet<[string]>">A node's icon, by its id.</PlateProp>
					<PlateProp name="aria-label" type="string">Name the group.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="AgentMapHub">
				<p>The agent in the middle. Its name is your children; the context ring is drawn round it.</p>
			</PlatePart>
			<PlatePart name="AgentMapStatus">
				<p>One line: the newest running call and how many more run beside it, or that nothing runs.</p>
			</PlatePart>
			<PlatePart name="AgentMapLog">
				<p>Every call, newest first; the selected node's only, when one is selected.</p>
				<PlateProps>
					<PlateProp name="limit" type="number">Show at most this many.</PlateProp>
					<PlateProp name="class" type="string">Give it a height and overflow to keep it short.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="AgentMapNode" kind="type">
				<PlateProps head="Field">
					<PlateProp name="id" type="string" required />
					<PlateProp name="label" type="string" required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="AgentCall" kind="type">
				<PlateProps head="Field">
					<PlateProp name="id" type="string | number" required />
					<PlateProp name="node" type="string" required>The node it went to.</PlateProp>
					<PlateProp name="label" type="string" required>What it does, in a few words.</PlateProp>
					<PlateProp name="state" type={'"running" | "done" | "failed"'} required />
					<PlateProp name="ms" type="number">How long it took, once ended.</PlateProp>
					<PlateProp name="from" type="string">The node it came from, when not the agent.</PlateProp>
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Map" value="square, up to 448px; nodes evenly round the centre, 37% across and 36% down, the first at the top" />
			<PlateMeasure label="Node" value="40px circle, 1px border, 16px icon; name 12px and count 11px mono, tabular, on one line, 6px off the circle: above it for the nodes at the top, under it for the rest" />
			<PlateMeasure label="Hub" value="96px; context ring 1.5px track, 2px arc in ink; name 14px / 500" />
			<PlateMeasure label="Phone" value="a map under 352px: 36px nodes, an 80px hub, the names without their counts; under 296px, that map scaled down" />
			<PlateMeasure label="Line" value="1px; 1.5px while a call on it runs or its node is selected" />
			<PlateMeasure label="Running" value="the agent tree's working mark round the node, one turn in 3s; a dot travels out in 6 × --dur-calm; under reduced motion the ring holds still and there is no dot" />
			<PlateMeasure label="Failed" value="a 16px inverted count on the node's top left" />
			<PlateMeasure label="Selected" value="2px copper outline, 2px off the node; its line copper" />
			<PlateMeasure label="Log row" value="32px; 12px mark, 72px node column, 12px mono duration" />
		</PlateMeasures>
	</PlateSection>
</Plate>
