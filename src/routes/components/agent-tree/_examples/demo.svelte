<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import {
		AgentTree,
		AgentTreeState,
		type Agent,
		type Collision,
		type Socket
	} from '#lib/registry/ui/agent-tree/index.js';

	const agents: Agent[] = [
		{ pid: 1, ppid: 0, name: 'You', state: 'waiting' },
		{ pid: 101, ppid: 1, name: 'Lead', task: 'waiting for its team', state: 'waiting' },
		{ pid: 214, ppid: 101, name: 'Web app', task: 'building the pages', state: 'working' },
		{ pid: 215, ppid: 101, name: 'API', task: 'asks: run the migration?', state: 'needs-you' },
		{ pid: 216, ppid: 101, name: 'Review', task: 'checked the work', state: 'done', exit: 0 },
		{ pid: 260, ppid: 1, name: 'Security', task: 'scanning for vulnerabilities', state: 'working' },
		{ pid: 261, ppid: 1, name: 'Patterns', task: 'checking conventions', state: 'paused' }
	];
	const sockets: Socket[] = [{ a: 214, b: 215, name: 'web.sock', by: 101 }];
	const collisions: Collision[] = [{ pids: [215, 260], file: 'auth.ts' }];

	// Lead, so its reach shows: the three agents it steers.
	let selected = $state<number | null>(101);
</script>

<!-- Only what applies: a finished agent gets none, a paused one is resumed, not paused. -->
{#snippet actions(agent: Agent)}
	{#if agent.state !== 'done' && agent.state !== 'failed'}
		<Button variant="outline" size="xs" aria-label="{agent.state === 'paused' ? 'Resume' : 'Pause'} {agent.name}">
			{agent.state === 'paused' ? 'Resume' : 'Pause'}
		</Button>
		<Button variant="outline" size="xs" aria-label="Stop {agent.name}">Stop</Button>
		<Button variant="outline" size="xs" aria-label="Message {agent.name}">Message</Button>
	{/if}
{/snippet}

<div class="flex w-full flex-col gap-6 self-start">
	<AgentTree {agents} {sockets} {collisions} bind:selected {actions} />
	<ul class="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm" aria-label="States">
		<li><AgentTreeState state="working" /></li>
		<li><AgentTreeState state="waiting" /></li>
		<li><AgentTreeState state="needs-you" /></li>
		<li><AgentTreeState state="paused" /></li>
		<li><AgentTreeState state="done" exit={0} /></li>
		<li><AgentTreeState state="failed" exit={1} /></li>
	</ul>
</div>
