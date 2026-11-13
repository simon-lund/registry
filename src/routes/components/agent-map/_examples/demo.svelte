<script lang="ts">
	import { AgentMap, AgentMapGraph, AgentMapHub, AgentMapStatus, AgentMapLog } from '#lib/registry/ui/agent-map/index.js';
	import Icon from './icon.svelte';
	import { at, nodes, steps } from './run.js';

	// The run plays a step every 700ms and starts over after a pause. `step` holds it at one moment
	// (the book's checks); under reduced motion it holds where the most is on the map.
	let { step }: { step?: number } = $props();

	let played = $state(0);
	let still = $state(false);
	$effect(() => {
		still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (step !== undefined || still) return;
		const timer = setInterval(() => (played = played >= steps + 4 ? 0 : played + 1), 700);
		return () => clearInterval(timer);
	});
	const run = $derived(at(step ?? (still ? 37 : played)));
	let selected = $state<string | null>(null);
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
			<!-- under the map, the newest five; beside it, ten. The height is kept, so nothing jumps as rows come in -->
			<AgentMapLog limit={10} class="min-h-40 @3xl:min-h-80 [&>li:nth-child(n+6)]:hidden @3xl:[&>li:nth-child(n+6)]:grid" />
		</div>
	</AgentMap>
</div>
