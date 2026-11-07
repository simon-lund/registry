<script lang="ts">
	import { AgentTree, type Agent } from '#lib/registry/ui/agent-tree/index.js';

	const agents: Agent[] = [
		{ pid: 1, ppid: 0, name: 'You', state: 'waiting' },
		{ pid: 2, ppid: 1, name: 'Lead', state: 'working' }
	];
	let selected = $state<number | null>(null);
</script>

<AgentTree {agents} bind:selected />
