<script lang="ts">
	import FileIcon from '@lucide/svelte/icons/file';
	import TerminalIcon from '@lucide/svelte/icons/terminal';
	import {
		AgentMap,
		AgentMapGraph,
		AgentMapHub,
		AgentMapStatus,
		AgentMapLog,
		type AgentCall,
		type AgentMapNode
	} from '#lib/registry/ui/agent-map/index.js';

	const nodes: AgentMapNode[] = [
		{ id: 'files', label: 'Files' },
		{ id: 'shell', label: 'Shell' }
	];
	// Yours to keep up to date, from the agent's events: a call starts running, then ends.
	let calls = $state<AgentCall[]>([
		{ id: 1, node: 'files', label: 'tests/setup.ts', state: 'done', ms: 300 },
		{ id: 2, node: 'shell', label: 'Run the test suite', state: 'running' }
	]);
</script>

<AgentMap {nodes} {calls} context={0.42}>
	<AgentMapGraph aria-label="What the agent is using">
		{#snippet icon(id)}
			{#if id === 'files'}<FileIcon />{:else}<TerminalIcon />{/if}
		{/snippet}
		<AgentMapHub>Claude</AgentMapHub>
	</AgentMapGraph>
	<AgentMapStatus />
	<AgentMapLog />
</AgentMap>
