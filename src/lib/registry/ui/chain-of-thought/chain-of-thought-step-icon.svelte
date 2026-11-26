<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * ChainOfThoughtStepIcon: the step's glyph in the left column, 16px in a 20px cell. Muted when
	 * done or pending; copper when active, and it breathes (opacity, 1.6s; still under reduced
	 * motion). Empty, it is a small dot: a plain note. Decorative.
	 *
	 * @example
	 * <ChainOfThoughtStepIcon><SearchIcon /></ChainOfThoughtStepIcon>
	 * <ChainOfThoughtStepIcon />
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();
</script>

<span
	bind:this={ref}
	data-slot="chain-of-thought-step-icon"
	aria-hidden="true"
	class={cn(
		'cot-icon col-start-1 row-span-2 row-start-1 grid size-5 place-items-center self-start text-muted-foreground',
		'group-data-[status=pending]/cot-step:opacity-60',
		'group-data-[status=active]/cot-step:text-primary',
		"[&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{#if children}{@render children()}{:else}<span class="size-1.5 rounded-full bg-current"></span>{/if}
</span>

<style>
	@media (prefers-reduced-motion: no-preference) {
		:global([data-status='active']) > .cot-icon {
			animation: cot-breathe 1.6s ease-in-out infinite;
		}
	}
	@keyframes cot-breathe {
		50% {
			opacity: 0.45;
		}
	}
</style>
