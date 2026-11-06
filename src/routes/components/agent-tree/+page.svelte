<script lang="ts">
	import {
		Plate,
		PlateStage,
		PlateNotes,
		PlateSection,
		PlateStates,
		PlateState,
		PlateMeasures,
		PlateMeasure
	} from '#lib/book/plate/index.js';
	import {
		AgentTree,
		AgentTreeState,
		type Agent,
		type Collision,
		type Socket
	} from '#lib/registry/ui/agent-tree/index.js';

	// The blueprint's example (manifest, sheet B-001): names and states are an example.
	const agents: Agent[] = [
		{ pid: 1, ppid: 0, name: 'You', task: 'process 1', state: 'waiting' },
		{ pid: 101, ppid: 1, name: 'Lead', task: 'the agent you asked', state: 'waiting' },
		{ pid: 214, ppid: 101, name: 'Web app', task: 'builds the pages', state: 'working' },
		{ pid: 215, ppid: 101, name: 'API', task: 'builds the routes', state: 'needs-you' },
		{ pid: 216, ppid: 101, name: 'Review', task: 'checked the work', state: 'done', exit: 0 },
		{ pid: 260, ppid: 1, name: 'Security', task: 'looks for holes', state: 'working' },
		{ pid: 261, ppid: 1, name: 'Patterns', task: 'checks conventions', state: 'paused' }
	];
	const sockets: Socket[] = [{ a: 214, b: 215, name: 'web.sock', by: 101 }];
	const collisions: Collision[] = [{ pids: [215, 260], file: 'auth.ts' }];

	let selected: number | null = $state(216);

	const one = (agent: Agent): Agent[] => [agent];
	const buttonClass =
		'border-border hover:bg-accent rounded-md border px-2 py-0.5 text-xs text-foreground';
</script>

{#snippet actions(agent: Agent)}
	<button type="button" class={buttonClass} aria-label="Pause {agent.name}">Pause</button>
	<button type="button" class={buttonClass} aria-label="Stop {agent.name}">Stop</button>
	<button type="button" class={buttonClass} aria-label="Message {agent.name}">Message</button>
{/snippet}

<Plate name="agent-tree" title="Agent tree" kind="Tree · Svelte">
	<PlateStage class="items-start justify-stretch">
		<div class="flex w-full flex-col gap-6 lg:flex-row lg:gap-10">
			<AgentTree {agents} {sockets} {collisions} bind:selected {actions} class="min-w-0 flex-1" />
			<ul class="m-0 flex shrink-0 list-none flex-col gap-2 p-0 text-sm lg:w-44" aria-label="States">
				<li><AgentTreeState state="working" /></li>
				<li><AgentTreeState state="waiting" /></li>
				<li><AgentTreeState state="needs-you" /></li>
				<li><AgentTreeState state="paused" /></li>
				<li><AgentTreeState state="done" exit={0} /></li>
				<li><AgentTreeState state="failed" exit={1} /></li>
			</ul>
		</div>
	</PlateStage>

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
				<PlateState label="Working: R running">
					<AgentTree agents={one({ pid: 214, ppid: 0, name: 'Web app', task: 'builds the pages', state: 'working' })} />
				</PlateState>
				<PlateState label="Waiting: S sleeping">
					<AgentTree agents={one({ pid: 101, ppid: 0, name: 'Lead', task: 'waits for its team', state: 'waiting' })} />
				</PlateState>
				<PlateState label="Needs you: S, with weight">
					<AgentTree agents={one({ pid: 215, ppid: 0, name: 'API', task: 'asks: push to origin?', state: 'needs-you' })} />
				</PlateState>
				<PlateState label="Paused: T stopped">
					<AgentTree agents={one({ pid: 261, ppid: 0, name: 'Patterns', task: 'checks conventions', state: 'paused' })} />
				</PlateState>
				<PlateState label="Done: exit 0, dashed">
					<AgentTree agents={one({ pid: 216, ppid: 0, name: 'Review', task: 'checked the work', state: 'done', exit: 0 })} />
				</PlateState>
				<PlateState label="Failed: exit 1, dashed">
					<AgentTree agents={one({ pid: 262, ppid: 0, name: 'Lint', task: '3 errors in apps/ops', state: 'failed', exit: 1 })} />
				</PlateState>
				<PlateState label="Selected: steers down, reports up">
					<AgentTree
						agents={[
							{ pid: 1, ppid: 0, name: 'You', state: 'waiting' },
							{ pid: 101, ppid: 1, name: 'Lead', state: 'waiting' },
							{ pid: 216, ppid: 101, name: 'Review', state: 'working' },
							{ pid: 260, ppid: 216, name: 'Security', state: 'working' },
							{ pid: 261, ppid: 216, name: 'Patterns', state: 'paused' }
						]}
						selected={216}
					/>
				</PlateState>
				<PlateState label="A socket, opened by a shared ancestor">
					<AgentTree
						agents={[
							{ pid: 214, ppid: 0, name: 'Web app', state: 'working' },
							{ pid: 215, ppid: 0, name: 'API', state: 'working' }
						]}
						sockets={[{ a: 214, b: 215, name: 'web.sock', by: 101 }]}
					/>
				</PlateState>
				<PlateState label="A collision: both edit one file">
					<AgentTree
						agents={[
							{ pid: 215, ppid: 0, name: 'API', state: 'working' },
							{ pid: 260, ppid: 0, name: 'Security', state: 'working' }
						]}
						collisions={[{ pids: [215, 260], file: 'auth.ts' }]}
					/>
				</PlateState>
				<PlateState label="Orphans: re-parented to 1">
					<AgentTree
						agents={[
							{ pid: 1, ppid: 0, name: 'You', state: 'waiting' },
							{ pid: 216, ppid: 1, name: 'Review', state: 'done', exit: 0 },
							{ pid: 260, ppid: 1, name: 'Security', state: 'working' },
							{ pid: 261, ppid: 1, name: 'Patterns', state: 'paused' }
						]}
					/>
				</PlateState>
			</PlateStates>
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
		<PlateSection title="The concept it was built from">
		<p>
			The earlier drawing, before the blueprint: the tree with its states, beside what one agent can
			reach. The build is compared with it side by side; what differs is in the measurements.
		</p>
		<img
			src="/agents-tree.webp"
			alt="A tree of coding agents with their states, beside what one agent can reach and the Linux rules it follows."
			class="bg-muted w-full rounded-lg"
			loading="lazy"
		/>
	</PlateSection>
</PlateNotes>
</Plate>
