<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * TerminalStatus: a short state next to the title ("Running", "Done in 4.2 s"), small and tonal,
	 * with an optional Spinner or glyph at 14px. A polite live region (`role="status"`), so a change
	 * is announced once, not every line.
	 *
	 * @example
	 * <TerminalStatus><Spinner aria-hidden="true" class="size-3.5" />Running</TerminalStatus>
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
	role="status"
	data-slot="terminal-status"
	class={cn(
		'flex shrink-0 items-center gap-1.5 text-xs text-(--terminal-dim)',
		"[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
