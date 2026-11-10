<script lang="ts">
	import Self from './agent-tree-node.svelte';
	import AgentTreeState from './agent-tree-state.svelte';
	import { cn } from '#lib/utils.js';
	import { finished, getTree, stateText, type Agent } from './context.svelte.js';

	/** One agent as a row, then its children as a group under it. */
	let { agent, level = 0 }: { agent: Agent; level?: number } = $props();

	const tree = getTree();
	const children = $derived(tree.childrenOf.get(agent.pid) ?? []);
	const selected = $derived(tree.selected === agent.pid);
	const steered = $derived(tree.steers.has(agent.pid));
	const above = $derived(tree.reportsTo.has(agent.pid));
	const ended = $derived(finished(agent.state));
	// The one state that wants you: it stands out by contrast, not colour (copper is the reach).
	const needsYou = $derived(agent.state === 'needs-you');
	const sockets = $derived(tree.socketsOf(agent.pid));
	const collisions = $derived(tree.collisionsOf(agent.pid));
	// Other agents are named, never numbered: a pid means nothing until you look it up.
	const nameOf = (pid: number) => tree.byPid.get(pid)?.name ?? String(pid);
	// The first row holds the tab stop until a key or a click moves it.
	const tabbable = $derived((tree.focused ?? tree.order[0]) === agent.pid);

	let row: HTMLElement | undefined = $state();

	function focusPid(pid: number | null) {
		if (pid === null) return;
		const node = row?.closest('[role="tree"]')?.querySelector<HTMLElement>(`[data-pid="${pid}"]`);
		node?.focus();
	}

	// Tree items nest, so a key or a click is handled by the row it landed on and by no ancestor,
	// and never by the row when it landed on one of the app's actions inside it.
	const mine = (e: Event) => {
		const target = e.target as Element;
		return target.closest('[role="treeitem"]') === row && !target.closest('[data-slot="agent-tree-actions"]');
	};

	function onkeydown(e: KeyboardEvent) {
		if (!mine(e)) return;
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				focusPid(tree.move(agent.pid, 1));
				break;
			case 'ArrowUp':
				e.preventDefault();
				focusPid(tree.move(agent.pid, -1));
				break;
			case 'Home':
				e.preventDefault();
				focusPid(tree.move(agent.pid, -tree.order.length));
				break;
			case 'End':
				e.preventDefault();
				focusPid(tree.move(agent.pid, tree.order.length));
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				tree.select(selected ? null : agent.pid);
				break;
		}
	}

	function onclick(e: MouseEvent) {
		if (!mine(e)) return;
		tree.focused = agent.pid;
		tree.select(selected ? null : agent.pid);
	}
</script>

<li
	role="treeitem"
	aria-selected={selected}
	aria-expanded={children.length ? true : undefined}
	aria-level={level + 1}
	aria-label="{agent.name}, {agent.pid}, {agent.state === 'needs-you' ? 'needs you' : agent.state}"
	data-pid={agent.pid}
	data-selected={selected || undefined}
	data-steered={steered || undefined}
	data-above={above || undefined}
	data-finished={ended || undefined}
	tabindex={tabbable ? 0 : -1}
	bind:this={row}
	{onkeydown}
	{onclick}
	class={cn(
		// the focus ring sits on the row (the first child), not around the whole subtree
		'list-none outline-none [&:focus-visible>div]:ring-ring [&:focus-visible>div]:ring-2',
		'[&>ul]:border-border [&>ul]:ml-2 [&>ul]:border-l [&>ul]:pl-4',
		// the selected agent's reach: the lines down to everything it steers
		(selected || steered) && '[&>ul]:border-primary'
	)}
>
	<div
		class={cn(
			'-ml-2 flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2',
			// selection is a quiet, neutral step up from hover; the copper is the reach below it
			'hover:bg-foreground/4',
			selected && 'bg-foreground/8 hover:bg-foreground/8',
			ended && 'text-muted-foreground'
		)}
	>
		<AgentTreeState
			state={agent.state}
			exit={agent.exit}
			markOnly
			class={cn(steered && 'text-primary')}
		/>
		<span class="flex min-w-0 flex-1 items-baseline gap-2">
			<!-- the name stays ink: copper at text size fails contrast on cream, so the reach is on the mark and the line -->
			<!-- the name keeps its room; the task gives way first -->
			<span class={cn('max-w-full shrink-0 truncate', needsYou && 'font-medium')}>{agent.name}</span>
			{#if agent.task}
				<!-- what it is doing: kept on a phone, where the pid and the state go -->
				<span class={cn('min-w-0 truncate text-sm', needsYou ? 'text-foreground' : 'text-muted-foreground')}
					>{agent.task}</span
				>
			{/if}
		</span>
		{#if selected && tree.actions}
			<!-- the app's own actions, in the row from tablet up, so selecting moves nothing below it;
			     it renders none where none apply (a finished agent) -->
			<span data-slot="agent-tree-actions" class="hidden shrink-0 items-center gap-1.5 empty:hidden sm:flex"
				>{@render tree.actions(agent)}</span
			>
		{/if}
		{#if needsYou}
			<!-- inverted, so it is the darkest thing on the row in both themes; kept on a phone too -->
			<span class="bg-foreground text-background shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">needs you</span>
		{/if}
		<span class="text-muted-foreground hidden shrink-0 font-mono text-xs tabular-nums sm:inline">
			{needsYou ? agent.pid : `${agent.pid} · ${stateText(agent)}`}
		</span>
	</div>

	{#if selected && tree.actions}
		<!-- a phone has no room for them in the row: they take a line under it -->
		<div data-slot="agent-tree-actions" class="mb-1 ml-7 flex items-center gap-1.5 py-1 empty:hidden sm:hidden">
			{@render tree.actions(agent)}
		</div>
	{/if}
	{#if sockets.length || collisions.length}
		<div class="mb-1 ml-7 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
			{#each sockets as s (s.name + s.a + s.b)}
				<span class="text-muted-foreground inline-flex items-center gap-1.5 font-mono">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M1.5 4h8M7 1.5 9.5 4 7 6.5M10.5 8h-8M5 5.5 2.5 8 5 10.5" /></svg>
					{s.name}
					<span class="font-sans">with {nameOf(s.a === agent.pid ? s.b : s.a)}, opened by {nameOf(s.by)}</span>
				</span>
			{/each}
			{#each collisions as c (c.file)}
				<span class="inline-flex items-center gap-1.5">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M6 1.5 11 10.5H1z" /><path d="M6 5v2.5M6 9v.01" stroke-linecap="round" /></svg>
					<span class="font-mono">{c.file}</span>
					<span class="text-muted-foreground">also open in {c.pids.filter((p) => p !== agent.pid).map(nameOf).join(', ')}</span>
				</span>
			{/each}
		</div>
	{/if}

	{#if children.length}
		<ul role="group" class="m-0 p-0">
			{#each children as child (child.pid)}
				<Self agent={child} level={level + 1} />
			{/each}
		</ul>
	{/if}
</li>
