<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getScrollMap } from './context.svelte.js';

	/**
	 * ScrollMapTicks: the column of ScrollMapTick, with the band behind the ticks in view: a
	 * rounded strip of foreground at 10% (it reads on any surface), 24px wide from the ticks' side
	 * so it sits evenly around the long ticks, 4px clear on both sides. It glides and stretches to
	 * the new range as the reader scrolls (a clip-path, base 220ms, settle; it simply moves under
	 * reduced motion). One tab stop; ArrowUp, ArrowDown, Home and End move between the ticks.
	 */
	let {
		ref = $bindable(null),
		class: className,
		onkeydown,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();

	const map = getScrollMap('ScrollMapTicks');

	// The band's clip, from the first to the last tick in view (in this column's own px).
	let clip = $state('inset(50% 0 50% 0 round 9999px)');
	$effect(() => {
		const el = ref;
		const first = map.firstVisible;
		const last = map.lastVisible;
		if (!el || first < 0) {
			clip = 'inset(50% 0 50% 0 round 9999px)';
			return;
		}
		const a = map.ticks[first]?.button;
		const b = map.ticks[last]?.button;
		if (!a || !b) return;
		const h = el.clientHeight;
		const top = Math.max(0, a.offsetTop - 2);
		const bottom = Math.max(0, h - (b.offsetTop + b.offsetHeight) - 2);
		clip = `inset(${top}px 0 ${bottom}px 0 round 9999px)`;
	});

	function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onkeydown?.(e);
		if (e.defaultPrevented) return;
		const i = map.ticks.findIndex((t) => t.button === document.activeElement);
		if (i < 0) return;
		const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: map.ticks.length - 1 }[e.key];
		if (to === undefined) return;
		e.preventDefault();
		void map.focusAt(to);
	}
</script>

<div
	bind:this={ref}
	data-slot="scroll-map-ticks"
	role="group"
	class={cn('relative flex w-full min-h-0 flex-1 flex-col items-stretch overflow-hidden py-1', className)}
	onkeydown={handleKeydown}
	{...restProps}
>
	<span
		aria-hidden="true"
		data-slot="scroll-map-band"
		class="bg-foreground/10 pointer-events-none absolute inset-y-0 w-6 rounded-full transition-[clip-path] duration-(--dur-base) ease-(--ease-settle) group-data-[side=left]/scroll-map:left-0.5 group-data-[side=right]/scroll-map:right-0.5"
		style:clip-path={clip}
	></span>
	{@render children?.()}
</div>
