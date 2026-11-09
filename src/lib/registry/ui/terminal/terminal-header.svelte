<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * TerminalHeader: the bar above the output, the title at the start and the actions at the
	 * end. No rule under it: space keeps it apart from the output. The 36px actions sit 6px in
	 * from the block's edge.
	 *
	 * @example
	 * <TerminalHeader>
	 *   <TerminalTitle><SquareTerminalIcon />Build output</TerminalTitle>
	 *   <TerminalActions>…</TerminalActions>
	 * </TerminalHeader>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();
</script>

<div
	bind:this={ref}
	data-slot="terminal-header"
	class={cn('flex min-h-12 items-center gap-3 py-1.5 pr-1.5 pl-4', className)}
	{...restProps}
>
	{@render children?.()}
</div>
