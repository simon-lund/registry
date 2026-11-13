<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { MapState, setMap, type AgentCall, type AgentMapNode } from './context.svelte.js';

	/**
	 * AgentMap: what an agent is working on, as a map. The agent sits in the middle, the things it
	 * reaches for (you, the model, files, the shell, the network, other agents) around it, and every
	 * call goes out along a line: running, done or failed. Holds the nodes, the calls and the
	 * selected node, and hands them to its parts: AgentMapGraph (the map, with AgentMapHub in its
	 * middle), AgentMapStatus (one line: what is running) and AgentMapLog (every call, newest first).
	 * Lay the parts out as you like: under each other on a phone, side by side from tablet up.
	 *
	 * @example
	 * <AgentMap {nodes} {calls} context={0.42}>
	 *   <AgentMapGraph {icon}><AgentMapHub>Claude</AgentMapHub></AgentMapGraph>
	 *   <AgentMapStatus />
	 *   <AgentMapLog />
	 * </AgentMap>
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** What sits round the agent, in order from the top, clockwise. */
		nodes: AgentMapNode[];
		/** Every call so far, oldest first. */
		calls?: AgentCall[];
		/** How full the agent's context is, 0 to 1. Shown round the hub. */
		context?: number | null;
		/** The selected node's id: its line in copper, the log only its calls. */
		selected?: string | null;
		onSelect?: (id: string | null) => void;
	}

	let {
		nodes,
		calls = [],
		context = null,
		selected = $bindable(null),
		onSelect,
		class: className,
		children,
		...rest
	}: Props = $props();

	const map = new MapState(
		() => ({ nodes, calls, context, selected }),
		(id) => {
			selected = id;
			onSelect?.(id);
		}
	);
	setMap(map);
</script>

<div data-slot="agent-map" class={cn('text-foreground', className)} {...rest}>
	{@render children?.()}
</div>
