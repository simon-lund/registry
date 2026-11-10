<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { AgentTree, type Agent } from '#lib/registry/ui/agent-tree/index.js';

	const agents: Agent[] = [
		{ pid: 101, ppid: 0, name: 'Lead', state: 'waiting' },
		{ pid: 214, ppid: 101, name: 'Web app', state: 'working' }
	];
	let selected = $state<number | null>(214);
</script>

<AgentTree {agents} bind:selected class="self-start">
	{#snippet actions(agent)}
		<Button variant="outline" size="xs" aria-label="Pause {agent.name}">Pause</Button>
		<Button variant="outline" size="xs" aria-label="Stop {agent.name}">Stop</Button>
	{/snippet}
</AgentTree>
