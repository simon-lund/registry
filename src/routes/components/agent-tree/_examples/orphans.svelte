<script lang="ts">
	import { AgentTree, type Agent } from '#lib/registry/ui/agent-tree/index.js';

	// Their parent finished first, so they belong to process 1: you.
	const agents: Agent[] = [
		{ pid: 1, ppid: 0, name: 'You', state: 'waiting' },
		{ pid: 216, ppid: 1, name: 'Review', state: 'done', exit: 0 },
		{ pid: 260, ppid: 1, name: 'Security', state: 'working' },
		{ pid: 261, ppid: 1, name: 'Patterns', state: 'paused' }
	];
</script>

<AgentTree {agents} />
