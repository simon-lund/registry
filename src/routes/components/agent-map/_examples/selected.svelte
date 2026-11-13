<script lang="ts">
	import { AgentMap, AgentMapGraph, AgentMapHub, AgentMapStatus, AgentMapLog } from '#lib/registry/ui/agent-map/index.js';
	import Icon from './icon.svelte';
	import { at, nodes } from './run.js';

	// After the hook blocked a delete: Shell is selected, so the log shows its calls only.
	const run = at(36);
	let selected = $state<string | null>('shell');
</script>

<!-- side by side once the space it sits in is wide enough for both, whatever the window -->
<div class="@container w-full">
	<AgentMap {nodes} calls={run.calls} context={run.context} bind:selected class="grid w-full items-start gap-x-10 gap-y-6 @3xl:grid-cols-2">
		<AgentMapGraph aria-label="What the agent is using">
			{#snippet icon(id)}<Icon {id} />{/snippet}
			<AgentMapHub>Claude</AgentMapHub>
		</AgentMapGraph>
		<div class="flex min-w-0 flex-col gap-3 @3xl:pt-6">
			<AgentMapStatus />
			<AgentMapLog />
		</div>
	</AgentMap>
</div>
