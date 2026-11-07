<script lang="ts">
	import { AgentTree, type Agent, type Socket } from '#lib/registry/ui/agent-tree/index.js';

	const agents: Agent[] = [
		{ pid: 214, ppid: 0, name: 'Web app', state: 'working' },
		{ pid: 215, ppid: 0, name: 'API', state: 'working' }
	];
	const sockets: Socket[] = [{ a: 214, b: 215, name: 'web.sock', by: 101 }];
</script>

<AgentTree {agents} {sockets} />
