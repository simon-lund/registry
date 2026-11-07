<script lang="ts">
	import { AgentTree, type Agent } from '#lib/registry/ui/agent-tree/index.js';

	const agents: Agent[] = [
		{ pid: 214, ppid: 0, name: 'Web app', task: 'builds the pages', state: 'working' },
		{ pid: 101, ppid: 0, name: 'Lead', task: 'waits for its team', state: 'waiting' },
		{ pid: 215, ppid: 0, name: 'API', task: 'asks: push to origin?', state: 'needs-you' },
		{ pid: 261, ppid: 0, name: 'Patterns', task: 'checks conventions', state: 'paused' },
		{ pid: 216, ppid: 0, name: 'Review', task: 'checked the work', state: 'done', exit: 0 },
		{ pid: 262, ppid: 0, name: 'Lint', task: '3 errors in apps/ops', state: 'failed', exit: 1 }
	];
</script>

<AgentTree {agents} class="self-start" />
