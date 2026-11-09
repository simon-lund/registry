<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { TooltipProvider } from '#lib/registry/ui/tooltip/index.js';
	import { cn } from '#lib/utils.js';
	import { ScrollMapState, setScrollMap } from './context.svelte.js';

	/**
	 * ScrollMap: a slim map of a long scroll beside it: one tick per turn of a conversation (or
	 * per section of a document), the ticks of what is in view lifted as a band, so the reader
	 * sees where they are and how much there is. Compose ScrollMapPrevious, ScrollMapTicks
	 * holding a ScrollMapTick per section (ScrollMapTickTitle / -Description for its tooltip,
	 * `dot` on a tick for one with attachments) and ScrollMapNext.
	 *
	 * - `target`: the scrolling element. Each tick's `value` is the `id` of its section. What is in
	 *   view comes from an IntersectionObserver on `target`, so the band follows the real scroll
	 *   position.
	 * - A tick jumps there (smooth; instant under reduced motion), `scrollMargin` px below the top.
	 * - `side`: which side of the scroll it stands on (`right` default, or `left`); ticks hang
	 *   from that edge and the tooltips open away from it.
	 * - Keys: ArrowUp / ArrowDown move between ticks (one tab stop), Home / End to the ends, Enter
	 *   jumps.
	 *
	 * While it shows, it is the scroll's only indicator: the target's own scrollbar is hidden;
	 * scrolling stays as it was. Where the map is hidden, the scrollbar comes back.
	 *
	 * For a pointer and room to spare: the ticks are 10px apart, too fine for a finger, so it hides
	 * itself where the primary pointer is coarse (`pointer-coarse:hidden`: phones and touch
	 * tablets). In a narrow column leave it out too. Requires an `aria-label` ("Sections").
	 *
	 * @example
	 * <ScrollMap target={viewport} aria-label="Sections">
	 *   <ScrollMapPrevious aria-label="Previous section" />
	 *   <ScrollMapTicks>
	 *     {#each sections as s (s.id)}
	 *       <ScrollMapTick value={s.id} aria-label={s.title}><ScrollMapTickTitle>{s.title}</ScrollMapTickTitle></ScrollMapTick>
	 *     {/each}
	 *   </ScrollMapTicks>
	 *   <ScrollMapNext aria-label="Next section" />
	 * </ScrollMap>
	 */
	let {
		ref = $bindable(null),
		class: className,
		target,
		side = 'right',
		scrollMargin = 16,
		children,
		...restProps
	}: HTMLAttributes<HTMLElement> & {
		ref?: HTMLElement | null;
		'aria-label': string;
		/** The scrolling element the map follows. */
		target: HTMLElement | null | undefined;
		/** The side of the scroll it stands on. Default `right`. */
		side?: 'left' | 'right';
		/** Px left free above a section it jumps to. Default 16. */
		scrollMargin?: number;
	} = $props();

	const map = setScrollMap(new ScrollMapState(() => ({ target, scrollMargin, side })));

	$effect(() => {
		// Re-observe when the target or the set of ticks changes.
		void target;
		void map.ticks.length;
		return map.observe();
	});

	// While the map is on screen it is the scroll's indicator: the target's own scrollbar goes
	// (styles below). Measured from the map's box, so wherever it is hidden (a coarse pointer, a
	// narrow column the consumer leaves it out of) the scrollbar comes back.
	$effect(() => {
		const el = ref;
		const t = target;
		if (!el || !t || typeof ResizeObserver === 'undefined') return;
		const sync = () => t.toggleAttribute('data-scroll-map-target', el.getClientRects().length > 0);
		const ro = new ResizeObserver(sync);
		ro.observe(el);
		sync();
		return () => {
			ro.disconnect();
			t.removeAttribute('data-scroll-map-target');
		};
	});
</script>

<TooltipProvider delayDuration={200} skipDelayDuration={400}>
	<nav
		bind:this={ref}
		data-slot="scroll-map"
		data-side={side}
		class={cn('group/scroll-map flex w-8 shrink-0 flex-col items-center gap-1 py-1 pointer-coarse:hidden', className)}
		{...restProps}
	>
		{@render children?.()}
	</nav>
</TooltipProvider>

<style>
	/* The map replaces the scrollbar. Only hidden, never removed: the target keeps scrolling by
	   wheel, touch and keys. */
	:global([data-scroll-map-target]) {
		scrollbar-width: none;
	}
	:global([data-scroll-map-target])::-webkit-scrollbar {
		display: none;
	}
</style>
