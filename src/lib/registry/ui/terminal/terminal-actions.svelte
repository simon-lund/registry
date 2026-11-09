<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * TerminalActions: the row of icon buttons at the end of the header (TerminalCopyButton,
	 * TerminalClearButton, your own), 4px apart; their 44px touch areas overlap into the gap,
	 * never into the output.
	 *
	 * @example
	 * <TerminalActions>
	 *   <TerminalCopyButton aria-label="Copy output" copiedLabel="Copied" />
	 * </TerminalActions>
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
	data-slot="terminal-actions"
	class={cn('ml-auto flex shrink-0 items-center gap-1', className)}
	{...restProps}
>
	{@render children?.()}
</div>
