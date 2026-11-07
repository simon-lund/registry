<script lang="ts">
	import { AgentTree, type Agent, type Collision } from '#lib/registry/ui/agent-tree/index.js';

	const agents: Agent[] = [
		{ pid: 215, ppid: 0, name: 'API', state: 'working' },
		{ pid: 260, ppid: 0, name: 'Security', state: 'working' }
	];
	const collisions: Collision[] = [{ pids: [215, 260], file: 'auth.ts' }];
</script>

<AgentTree {agents} {collisions} />
