<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getTerminal } from './context.js';

	/**
	 * TerminalTitle: what the output is ("Build output"), in foreground, with an optional leading
	 * glyph (drawn 18px in muted-foreground, decorative). It names the log for screen readers
	 * (TerminalContent is labelled by it).
	 *
	 * @example
	 * <TerminalTitle><SquareTerminalIcon />Build output</TerminalTitle>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();

	const terminal = getTerminal('TerminalTitle');
	$effect(() => {
		terminal.hasTitle = true;
		return () => (terminal.hasTitle = false);
	});
</script>

<div
	bind:this={ref}
	id={terminal.titleId}
	data-slot="terminal-title"
	class={cn(
		/* A block, not a flex row, so a long title ends in an ellipsis; the glyph sits inline. */
		'min-w-0 flex-1 truncate text-xs font-medium text-foreground',
		"[&_svg]:mr-2 [&_svg]:inline-block [&_svg]:align-[-0.25em] [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4.5",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
