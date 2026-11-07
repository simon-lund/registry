<script lang="ts">
	import { AgentTree, type Agent } from '#lib/registry/ui/agent-tree/index.js';

	const agents: Agent[] = [
		{ pid: 1, ppid: 0, name: 'You', state: 'waiting' },
		{ pid: 101, ppid: 1, name: 'Lead', state: 'waiting' },
		{ pid: 216, ppid: 101, name: 'Review', state: 'working' },
		{ pid: 260, ppid: 216, name: 'Security', state: 'working' },
		{ pid: 261, ppid: 216, name: 'Patterns', state: 'paused' }
	];
	let selected = $state<number | null>(216);
</script>

<AgentTree {agents} bind:selected />
