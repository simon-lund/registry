<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import AgentTreeNode from './agent-tree-node.svelte';
	import { cn } from '#lib/utils.js';
	import { setTree, TreeState, type Agent, type Collision, type Socket } from './context.svelte.js';

	/**
	 * Coding agents as a process tree, with the rules Linux uses: every agent sees the tree, steers
	 * only the agents below it, reports up, and talks to a sibling only through a socket a shared
	 * ancestor opened. You are process 1. Selecting an agent shows its reach.
	 */
	interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
		agents: Agent[];
		sockets?: Socket[];
		collisions?: Collision[];
		/** The selected agent's pid; null for none. */
		selected?: number | null;
		onSelect?: (pid: number | null) => void;
		/** Rendered inside the selected row: the app's own Pause, Stop, Message. */
		actions?: Snippet<[Agent]>;
	}

	let {
		agents,
		sockets = [],
		collisions = [],
		selected = $bindable(null),
		onSelect,
		actions,
		class: className,
		...rest
	}: Props = $props();

	const tree = new TreeState();
	setTree(tree);
	// The first render's state, set here as well as in the effects below, because effects never run
	// on the server: without it the tree is sent empty and its rows pop in once the page hydrates.
	const seed = () => {
		tree.agents = agents;
		tree.sockets = sockets;
		tree.collisions = collisions;
		tree.actions = actions;
		tree.selected = selected;
	};
	seed();
	$effect.pre(() => {
		tree.agents = agents;
		tree.sockets = sockets;
		tree.collisions = collisions;
		tree.actions = actions;
	});
	$effect.pre(() => {
		tree.selected = selected;
	});
	tree.onSelect = (pid) => {
		selected = pid;
		onSelect?.(pid);
	};
</script>

<ul
	role="tree"
	aria-label="Agents"
	class={cn('text-foreground m-0 w-full p-0 text-base', className)}
	{...rest}
>
	{#each tree.roots as agent (agent.pid)}
		<AgentTreeNode {agent} />
	{/each}
</ul>
