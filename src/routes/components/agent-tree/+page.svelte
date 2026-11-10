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
	import meta from '#lib/registry/ui/agent-tree/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/agent-tree/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="agent-tree" title="Agent tree">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="agent-tree" dependencies={meta.dependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="States" example={example('states')}>
		Every agent has exactly one state, with the letter Linux gives it: working is R, waiting S,
		needs you S with weight, paused T. Done and failed carry an exit code and a dashed line.
	</PlateExample>

	<PlateExample title="Selection" example={example('selected')}>
		Selecting an agent shows its reach: the agents below it, which it steers, in copper, and the
		ones above, which it reports to. Bind <code>selected</code> to read or set it.
	</PlateExample>

	<PlateExample title="Actions" example={example('actions')}>
		The <code>actions</code> snippet renders inside the selected row. Pause, Stop and Message
		belong to the app, which knows what they do.
	</PlateExample>

	<PlateExample title="Sockets" example={example('socket')}>
		Siblings talk only through a socket a shared ancestor opened. Pass it in <code>sockets</code>;
		both rows show its name.
	</PlateExample>

	<PlateExample title="Collisions" example={example('collision')}>
		When two agents have the same file open, both rows say so, before it becomes a merge conflict.
	</PlateExample>

	<PlateExample title="Orphans" example={example('orphans')}>
		When a parent finishes before its children, hand them to process 1, as Linux does. They stay in
		the tree, under you.
	</PlateExample>

	<PlateExample title="State marks" example={example('state-marks')}>
		<code>AgentTreeState</code> on its own makes a legend. <code>markOnly</code> drops the word;
		give it an <code>aria-label</code>.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>The tree is one focus stop. <code>ArrowUp</code> and <code>ArrowDown</code> move between agents.</li>
			<li><code>Home</code> and <code>End</code> go to the first and last agent.</li>
			<li><code>Enter</code> or <code>Space</code> selects the focused agent.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="AgentTree">
				<p>A list with the tree role, one row per agent, children under their parent.</p>
				<PlateProps>
					<PlateProp name="agents" type="Agent[]" required>An agent whose parent is not in the list is a root.</PlateProp>
					<PlateProp name="sockets" type="Socket[]" default="[]" />
					<PlateProp name="collisions" type="Collision[]" default="[]" />
					<PlateProp name="selected" type="number | null" default="null" bindable>The selected agent's pid.</PlateProp>
					<PlateProp name="onSelect" type="(pid: number | null) => void" />
					<PlateProp name="actions" type="Snippet<[Agent]>">Rendered inside the selected row.</PlateProp>
					<PlateProp name="class" type="string">Any other attribute of a ul is passed on.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="AgentTreeState">
				<p>A state's mark with its word. The tree uses it in every row.</p>
				<PlateProps>
					<PlateProp name="state" type="AgentState" required />
					<PlateProp name="exit" type="number">Shown for done and failed.</PlateProp>
					<PlateProp name="markOnly" type="boolean" default="false">Give it an aria-label.</PlateProp>
					<PlateProp name="class" type="string">Any other attribute of a span is passed on.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="AgentTreeNode">
				<p>One row and the group under it. <code>AgentTree</code> renders these; it works only inside one.</p>
				<PlateProps>
					<PlateProp name="agent" type="Agent" required />
					<PlateProp name="level" type="number" default="0" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="Agent" kind="type">
				<p>One agent, as a process.</p>
				<PlateProps head="Field">
					<PlateProp name="pid" type="number" required />
					<PlateProp name="ppid" type="number" required>Its parent's pid.</PlateProp>
					<PlateProp name="name" type="string" required />
					<PlateProp name="task" type="string">One line under the name.</PlateProp>
					<PlateProp name="state" type="AgentState" required />
					<PlateProp name="exit" type="number">0 once done, not 0 once failed.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="AgentState" kind="type">
				<p><code>"working" | "waiting" | "needs-you" | "paused" | "done" | "failed"</code></p>
			</PlatePart>
			<PlatePart name="Socket" kind="type">
				<p>A line between two siblings, opened by an ancestor of both.</p>
				<PlateProps head="Field">
					<PlateProp name="a" type="number" required>One end's pid.</PlateProp>
					<PlateProp name="b" type="number" required>The other end's pid.</PlateProp>
					<PlateProp name="name" type="string" required>Shown on both rows.</PlateProp>
					<PlateProp name="by" type="number" required>The ancestor that opened it.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="Collision" kind="type">
				<p>Two or more agents in one file.</p>
				<PlateProps head="Field">
					<PlateProp name="pids" type="number[]" required />
					<PlateProp name="file" type="string" required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="letter" kind="function">
				<p>
					<code>letter(agent: Pick&lt;Agent, "state" | "exit"&gt;): string</code>. Linux's letter for a
					state: R, S or T, or "exit n".
				</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Row" value="40px min, 8px rhythm" />
			<PlateMeasure label="Indent" value="24px per level (8px to the line, 16px past it)" />
			<PlateMeasure label="Mark" value="16px, 1.5px stroke, on the row's centre line" />
			<PlateMeasure label="Mark to name" value="12px" />
			<PlateMeasure label="Name" value="16px / 400 (needs you: 500)" />
			<PlateMeasure label="pid · state" value="12px mono, tabular" />
			<PlateMeasure label="Tree line" value="1px border, copper below the selected agent" />
			<PlateMeasure label="Selection" value="instant: a cut, no ease" />
			<PlateMeasure label="Working mark" value="one turn in 3s, linear; still under reduced motion" />
		</PlateMeasures>
	</PlateSection>
</Plate>
