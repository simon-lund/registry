<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	/**
	 * The track is a pill with 4px padding and a fine line, so it shows on any surface, and the
	 * key inside is a pill too (concentric). The line is an inset ring, not a border: a border
	 * would move the box the key is measured from.
	 * Segments share the width equally by default; give the list `w-fit` and the triggers
	 * `flex-none` for content-sized segments. A segment never shrinks below its label: when they
	 * do not fit, the track scrolls sideways (no scrollbar; touch, shift-wheel, the arrow keys).
	 */
	export const tabsListVariants = tv({
		base: [
			'bg-muted relative isolate flex w-full items-center gap-0.5 rounded-full p-1 ring-1 ring-(--tabs-line) ring-inset [--tabs-line:var(--border)] [--tabs-track:var(--muted)]',
			'overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
			'supports-[container-type:scroll-state]:[container-type:scroll-state]',
			'data-disabled:opacity-45'
		]
	});
</script>

<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import { getTabsRoot, setTabsList } from './context.js';
	import { TabsGeometry } from './tabs-geometry.svelte.js';
	import TabsCopy from './tabs-copy.svelte';

	/**
	 * TabsList: the segmented control's track, holding TabsTriggers (and nothing else).
	 *
	 * The segments are one of a set, so they are flat: a label on the track. The selected one
	 * carries the control's one moving piece, its key. It is not drawn per trigger. The list
	 * renders its triggers a second time as an inert, active-styled copy (the key's face, labels in
	 * foreground) and clips that copy to the selected trigger's box. Selecting animates the clip, so
	 * the key and the label colour move as one shape and can never drift apart. The key's fine line
	 * is one more clipped layer underneath, moved by the same transition.
	 *
	 * Resizes and font swaps re-measure without animating. Reduced motion switches instantly.
	 *
	 * Too many segments for the width: the track scrolls sideways and the key, measured in the
	 * track's scroll coordinates, scrolls with its segment. The selected segment is scrolled into
	 * view (16px clear of the edge) when it is chosen and when the track first lays out, never
	 * scrolling the page. Where the browser has scroll-state container queries, the edge with more
	 * segments behind it fades into the track (44px); elsewhere there is no hint.
	 *
	 * @example
	 * <TabsList aria-label="Tasks">…</TabsList>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: TabsPrimitive.ListProps = $props();

	const root = getTabsRoot('TabsList');

	let indicator: HTMLElement | null = $state(null);
	// Measuring, sliding vs jumping, scrolling the selection into view: tabs-geometry.svelte.ts.
	const geo = new TabsGeometry({
		list: () => ref,
		indicator: () => indicator,
		selected: () => root.value
	});

	setTabsList({
		get rects() {
			return geo.rects;
		},
		register: (value, el) => geo.register(value, el)
	});

	$effect(() => {
		const list = ref;
		if (!list) return;
		return geo.mount(list);
	});

	// A new selection: scrolled into view, a resize it causes still slides, and the root learns
	// which way it went (by the segments' boxes, not their order), so its panel comes from there.
	// A key step reports no side: the key jumps, the panel switches at once.
	let previous: string | undefined;
	$effect(() => {
		const next = root.value;
		const byKey = geo.select();
		const prev = previous;
		previous = next;
		if (prev === undefined || prev === next) return;
		const rects = untrack(() => geo.rects);
		const a = rects[prev];
		const b = rects[next];
		root.moved(!byKey && a && b ? (b.x > a.x ? 'right' : 'left') : undefined);
	});

	onDestroy(() => geo.destroy());

	const active = $derived(geo.rects[root.value]);

	// The key's box as clip insets from each side of the list.
	const insets = $derived(
		active &&
			`width:${geo.size.w}px;--t:${active.y}px;--l:${active.x}px;` +
				`--r:${geo.size.w - active.x - active.w}px;--b:${geo.size.h - active.y - active.h}px`
	);
</script>

<TabsPrimitive.List
	bind:ref
	data-slot="tabs-list"
	class={cn(tabsListVariants(), className)}
	{...restProps}
>
	{#snippet child({ props })}
		<!-- Radio mode: the same element as a radiogroup (bits-ui always says tablist). -->
		<div
			{...props}
			role={root.mode === 'radio' ? 'radiogroup' : 'tablist'}
			aria-orientation={root.mode === 'radio'
				? undefined
				: (props['aria-orientation'] as 'horizontal' | 'vertical' | undefined)}
		>
			{@render body()}
		</div>
	{/snippet}
</TabsPrimitive.List>

{#snippet body()}
	<!-- Scroll hints: zero-width, stuck to the track's edges; shown by scroll-state queries only. -->
	<span class="hint hint-start" aria-hidden="true"></span>
	{@render children?.()}
	<span class="hint hint-end" aria-hidden="true"></span>
	<div
		bind:this={indicator}
		data-slot="tabs-indicator"
		data-ready={active ? '' : undefined}
		aria-hidden="true"
		inert
		class="indicator pointer-events-none absolute inset-y-0 left-0 z-[3]"
		style={insets}
	>
		<!-- The key's fine line, then the face: a sheet with every label in foreground, clipped to the selected segment. -->
		<span class="layer edge"></span>
		<div class="layer face bg-background">
			<TabsCopy>{@render children?.()}</TabsCopy>
		</div>
	</div>
{/snippet}

<style>
	/*
	 * Two stacked sheets, each clipped to the selected trigger's box (--t/--r/--b/--l) and
	 * transitioned together, so they are one rigid key in motion. The key lies above the scroll
	 * hints: they fade the labels behind them, never the selection:
	 *   edge: the box grown by 1px → the fine line around the face
	 *   face: the box itself       → the key, labels in foreground
	 */
	.indicator {
		--line: 1px;
		/* a pill, as the track */
		--round: 9999px;
		visibility: hidden;
	}
	.indicator[data-ready] {
		visibility: visible;
	}

	.layer {
		position: absolute;
		inset: 0;
		transition-property: clip-path;
		/* The slide is the base 220ms on settle: quick off the mark, a long calm landing, no overshoot. */
		transition-duration: var(--dur-base);
		transition-timing-function: var(--ease-settle);
	}

	.face {
		clip-path: inset(var(--t) var(--r) var(--b) var(--l) round var(--round));
	}
	.edge {
		background: var(--border);
		clip-path: inset(
			calc(var(--t) - var(--line)) calc(var(--r) - var(--line)) calc(var(--b) - var(--line))
				calc(var(--l) - var(--line)) round var(--round)
		);
	}

	/*
	 * Scroll hints. Zero-width flex items (their gap taken back) stuck to the scrollport's edges,
	 * each covering the track's round end and fading into the track colour inward. Only where `scroll-state` queries
	 * exist (the list is then a scroll-state container), and only while that way can scroll.
	 */
	.hint {
		display: none;
	}
	@supports (container-type: scroll-state) {
		.hint {
			display: block;
			position: sticky;
			z-index: 2;
			align-self: stretch;
			flex: none;
			width: 0;
			pointer-events: none;
			opacity: 0;
			transition: opacity var(--dur-quick) var(--ease-settle);
		}
		.hint-start {
			left: 0;
			margin-inline-end: calc(var(--spacing, 4px) * -0.5);
		}
		.hint-end {
			right: 0;
			margin-inline-start: calc(var(--spacing, 4px) * -0.5);
		}
		/*
		 * A sticky item stops at the track's padding, not its edge, so the fade reaches back across
		 * the padding to the track's edge and takes the end's shape: round, wider than the end's
		 * 22px radius (narrower, the rounding would be squashed and leave slivers at the curve).
		 * It covers the whole end, so it draws that stretch of the fine line itself (the track's line
		 * is a shadow under the labels, which would paint over it). Solid across the curve, then
		 * 22px of fade: no letter shows inside the round end.
		 */
		.hint::before {
			--reach: var(--spacing, 4px);
			content: '';
			position: absolute;
			box-sizing: border-box;
			inset-block: calc(-1 * var(--reach));
			width: calc(var(--spacing, 4px) * 10 + var(--reach));
			border: 1px solid var(--tabs-line);
		}
		.hint-start::before {
			left: calc(-1 * var(--reach));
			border-inline-end-width: 0;
			border-radius: 9999px 0 0 9999px;
			background: linear-gradient(
				to right,
				var(--tabs-track) calc(var(--spacing, 4px) * 5.5),
				transparent
			);
		}
		.hint-end::before {
			right: calc(-1 * var(--reach));
			border-inline-start-width: 0;
			border-radius: 0 9999px 9999px 0;
			background: linear-gradient(
				to left,
				var(--tabs-track) calc(var(--spacing, 4px) * 5.5),
				transparent
			);
		}
		@container scroll-state(scrollable: inline-start) {
			.hint-start {
				opacity: 1;
			}
		}
		@container scroll-state(scrollable: inline-end) {
			.hint-end {
				opacity: 1;
			}
		}
	}

	/* Reduced motion: the key is simply where it is. */
	@media (prefers-reduced-motion: reduce) {
		.layer {
			transition: none;
		}
	}
</style>
