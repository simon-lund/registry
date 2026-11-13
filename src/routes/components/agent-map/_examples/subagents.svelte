<script lang="ts">
	import { AgentMap, AgentMapGraph, AgentMapHub } from '#lib/registry/ui/agent-map/index.js';
	import Icon from './icon.svelte';
	import { at, nodes } from './run.js';

	// Two subagents at work: their calls to the model and to files come from Agents, not from Claude.
	const run = at(24);
</script>

<AgentMap {nodes} calls={run.calls} context={run.context} class="w-full max-w-md">
	<AgentMapGraph aria-label="What the agent is using">
		{#snippet icon(id)}<Icon {id} />{/snippet}
		<AgentMapHub>Claude</AgentMapHub>
	</AgentMapGraph>
</AgentMap>
