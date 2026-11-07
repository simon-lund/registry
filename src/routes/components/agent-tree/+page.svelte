<script lang="ts">
	import {
		Plate,
		PlateStage,
		PlateNotes,
		PlateSection,
		PlateStates,
		PlateState,
		PlateApi,
		PlatePart,
		PlateProps,
		PlateProp,
		PlateMeasures,
		PlateMeasure
	} from '#lib/book/plate/index.js';
	import { examples } from '#lib/book/examples.js';
	import type { Component } from 'svelte';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<string>('./_examples/*.svelte', { eager: true, import: 'default', query: '?raw' })
	);
</script>


<Plate name="agent-tree" title="Agent tree" kind="Tree · Svelte">
	<PlateStage example={example('demo')} />

	<PlateNotes>
		<PlateSection title="Intention">
			<p>
				You give a coding agent a task and get back a result. What happens in between is mostly
				hidden: the agent plans, runs commands, edits files, and more and more often starts helpers
				of its own. Inside, the agent you asked leads a small team, and most tools show you only
				the lead. The rest runs out of sight, and you can’t steer what you can’t see.
			</p>
			<p>
				So treat the agents like processes on Linux. Each has an id, a parent and exactly one
				state: working, waiting, needs you, paused, done or failed. You sit at the top as process
				1, and every agent can see the whole tree, names and states only, as <code>ps</code> shows
				every process.
			</p>
			<p>
				Select an agent and you see its reach. It steers only the agents below it: pause, stop or
				message one of them, or all at once. It reports up, and it can’t steer upwards. Siblings
				don’t talk behind their lead’s back: when two need to agree on a contract, the lead opens a
				socket between them, named, visible in the tree. When two agents open the same file, it
				shows here before it becomes a merge conflict. And when a parent finishes before its
				children do, they don’t vanish: like orphaned processes, they are handed to process 1.
				You. Nothing runs where you can’t see it.
			</p>
		</PlateSection>

		<PlateSection title="Left out">
			<p>
				The buttons. Pause, Stop and Message belong to the app, which knows what they do; the tree
				only gives them a place, inside the selected row, through the <code>actions</code> snippet.
			</p>
			<p>
				Transcripts and durations. The tree is what <code>ps</code> shows: names and states. Reading
				an agent’s work as it happens is the ancestors’ view, and a view of its own.
			</p>
			<p>
				A second colour. Copper marks the selected agent’s reach and nothing else; needs-you gets
				weight, not colour. Collapsing: every agent is always somewhere in this tree, so the tree
				shows all of it.
			</p>
			<p>
				Motion. A change of state is a cut, except the working mark, which turns slowly so a
				glance tells running from waiting; under reduced motion it stands still.
			</p>
		</PlateSection>

		<PlateSection title="States">
			<PlateStates>
				<PlateState label="Working: R running" example={example('working')} />
				<PlateState label="Waiting: S sleeping" example={example('waiting')} />
				<PlateState label="Needs you: S, with weight" example={example('needs-you')} />
				<PlateState label="Paused: T stopped" example={example('paused')} />
				<PlateState label="Done: exit 0, dashed" example={example('done')} />
				<PlateState label="Failed: exit 1, dashed" example={example('failed')} />
				<PlateState label="Selected: steers down, reports up" example={example('selected')} />
				<PlateState label="A socket, opened by a shared ancestor" example={example('socket')} />
				<PlateState label="A collision: both edit one file" example={example('collision')} />
				<PlateState label="Orphans: re-parented to 1" example={example('orphans')} />
				<PlateState label="AgentTreeState alone: the marks, with the word or without" example={example('state-marks')} />
			</PlateStates>
		</PlateSection>

		<PlateSection title="API">
			<PlateApi>
				<PlatePart name="AgentTree">
					<p>The tree: a list with the tree role, one row per agent, children under their parent.</p>
					<PlateProps>
						<PlateProp name="agents" type="Agent[]" required>Every agent. An agent whose parent is not in the list is a root.</PlateProp>
						<PlateProp name="sockets" type="Socket[]" default="[]">Named lines between siblings.</PlateProp>
						<PlateProp name="collisions" type="Collision[]" default="[]">Agents that have the same file open.</PlateProp>
						<PlateProp name="selected" type="number | null" default="null" bindable>The selected agent's pid. Its reach is drawn in copper.</PlateProp>
						<PlateProp name="onSelect" type="(pid: number | null) => void">Called when the selection changes.</PlateProp>
						<PlateProp name="actions" type="Snippet<[Agent]>">Rendered inside the selected row: the app's own Pause, Stop, Message.</PlateProp>
						<PlateProp name="class" type="string">Merged onto the list. Any other attribute of a ul is passed on.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="AgentTreeState">
					<p>A state's mark, with its word. The tree uses it in every row; on its own it makes a legend.</p>
					<PlateProps>
						<PlateProp name="state" type="AgentState" required>Which mark.</PlateProp>
						<PlateProp name="exit" type="number">The exit code, shown for done and failed.</PlateProp>
						<PlateProp name="markOnly" type="boolean" default="false">The mark without the word. Give it an aria-label.</PlateProp>
						<PlateProp name="class" type="string">Merged onto the root. Any other attribute of a span is passed on.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="AgentTreeNode">
					<p>One row and the group under it. AgentTree renders these; it works only inside one.</p>
					<PlateProps>
						<PlateProp name="agent" type="Agent" required>The row's agent.</PlateProp>
						<PlateProp name="level" type="number" default="0">How deep the row sits.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="Agent" kind="type">
					<p>One agent, as a process.</p>
					<PlateProps>
						<PlateProp name="pid" type="number" required>Its id.</PlateProp>
						<PlateProp name="ppid" type="number" required>Its parent's id.</PlateProp>
						<PlateProp name="name" type="string" required>What the row says.</PlateProp>
						<PlateProp name="task" type="string">One line under the name.</PlateProp>
						<PlateProp name="state" type="AgentState" required>Exactly one state.</PlateProp>
						<PlateProp name="exit" type="number">The exit code once done (0) or failed (not 0).</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="AgentState" kind="type">
					<PlateProps>
						<PlateProp name="AgentState" type="'working' | 'waiting' | 'needs-you' | 'paused' | 'done' | 'failed'">R, S, S with weight, T, then an exit code.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="Socket" kind="type">
					<p>A line between two siblings, opened by an ancestor of both.</p>
					<PlateProps>
						<PlateProp name="a" type="number" required>One end's pid.</PlateProp>
						<PlateProp name="b" type="number" required>The other end's pid.</PlateProp>
						<PlateProp name="name" type="string" required>Shown on both rows, e.g. "web.sock".</PlateProp>
						<PlateProp name="by" type="number" required>The pid of the ancestor that opened it.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="Collision" kind="type">
					<p>Two or more agents in one file: a conflict waiting to happen.</p>
					<PlateProps>
						<PlateProp name="pids" type="number[]" required>The agents that have it open.</PlateProp>
						<PlateProp name="file" type="string" required>The file, as the rows show it.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="letter" kind="function">
					<PlateProps>
						<PlateProp name="letter(agent)" type="(agent: Pick<Agent, 'state' | 'exit'>) => string">Linux's letter for a state: R, S or T, or "exit n".</PlateProp>
					</PlateProps>
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
	</PlateNotes>
</Plate>
