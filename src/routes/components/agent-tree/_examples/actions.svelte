<script lang="ts">
	import { AgentTree, type Agent } from '#lib/registry/ui/agent-tree/index.js';

	const agents: Agent[] = [
		{ pid: 101, ppid: 0, name: 'Lead', state: 'waiting' },
		{ pid: 214, ppid: 101, name: 'Web app', state: 'working' }
	];
	let selected = $state<number | null>(214);

	const button = 'border-border hover:bg-accent rounded-md border px-2 py-0.5 text-xs text-foreground';
</script>

<AgentTree {agents} bind:selected class="self-start">
	{#snippet actions(agent)}
		<button type="button" class={button} aria-label="Pause {agent.name}">Pause</button>
		<button type="button" class={button} aria-label="Stop {agent.name}">Stop</button>
	{/snippet}
</AgentTree>
