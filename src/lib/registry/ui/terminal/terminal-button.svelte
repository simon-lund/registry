<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { cn } from '#lib/utils.js';

	/**
	 * TerminalButton: an icon action in the header, a stock ghost icon Button: drawn 36px
	 * (muted-foreground, a tonal square and full foreground on hover, since the stock hover is the
	 * terminal's own surface), still 44 × 44 to touch. Icon only: requires an `aria-label`.
	 * TerminalCopyButton and TerminalClearButton are built on it; use it for your own ("Restart",
	 * "Download").
	 *
	 * @example
	 * <TerminalButton aria-label="Restart" onclick={restart}><RotateCcwIcon /></TerminalButton>
	 */
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof Button> & { 'aria-label': string } = $props();
</script>

<Button
	bind:ref
	data-slot="terminal-button"
	variant="ghost"
	size="icon-lg"
	class={cn(
		'text-muted-foreground hover:bg-foreground/10 hover:text-foreground dark:hover:bg-foreground/10',
		"[&_svg:not([class*='size-'])]:size-4.5",
		"relative before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-1/2 before:rounded-full before:content-['']",
		className
	)}
	{...restProps}
/>
