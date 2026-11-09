<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import { cn } from '#lib/utils.js';
	import { getScrollMap } from './context.svelte.js';

	/**
	 * ScrollMapPrevious: jumps to the section before the first one in view, a 32px ghost icon button
	 * above the ticks, 44px to touch; disabled at the start.
	 * Icon only: requires an `aria-label` ("Previous section").
	 */
	let {
		ref = $bindable(null),
		class: className,
		onclick,
		...restProps
	}: HTMLButtonAttributes & { ref?: HTMLButtonElement | null; 'aria-label': string } = $props();

	const map = getScrollMap('ScrollMapPrevious');
	const disabled = $derived(map.firstVisible <= 0);
</script>

<button
	bind:this={ref}
	type="button"
	data-slot="scroll-map-previous"
	{disabled}
	class={cn(
		'relative grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground',
		'transition-[color,background-color,scale] duration-(--dur-quick) ease-(--ease-settle) enabled:hover:bg-muted enabled:hover:text-foreground',
		'motion-safe:enabled:active:scale-90 active:duration-(--dur-press) disabled:cursor-default disabled:opacity-40',
		'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
		"before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-1/2 before:rounded-full before:content-['']",
		className
	)}
	onclick={(e) => {
		onclick?.(e);
		if (!e.defaultPrevented) map.jumpBy(-1);
	}}
	{...restProps}
>
	<ChevronUpIcon class="size-4" aria-hidden="true" />
</button>
