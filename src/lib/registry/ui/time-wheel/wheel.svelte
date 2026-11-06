<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
	import { cn } from '#lib/utils.js';

	type Item = number | string;

	interface Props {
		/** The selected item. */
		value?: Item;
		items: Item[];
		/** Wrap around at the ends (hours and minutes do, am/pm does not). */
		loop?: boolean;
		/** Flat, as on iOS: the neighbours shrink and fade. Drum: the items sit on a cylinder. */
		variant?: 'flat' | 'drum';
		/** Read to assistive tech, e.g. "Hour". */
		label?: string;
		class?: string;
		onValueChange?: (value: Item) => void;
	}

	let {
		value = $bindable(),
		items,
		loop = true,
		variant = 'flat',
		label,
		class: className,
		onValueChange
	}: Props = $props();

	// The geometry per variant: how tall a row is, how much of the column shows, and the drum's
	// cylinder (radius in px, perspective in px). The highlight bar in the root is 40px, so a row
	// of 34 or 36 sits inside it.
	const geometry = {
		flat: { item: 34, window: 240, radius: 0, perspective: 0 },
		drum: { item: 36, window: 260, radius: 90, perspective: 850 }
	};
	const g = $derived(geometry[variant]);

	let api: EmblaCarouselType | undefined = $state();
	let root: HTMLElement | undefined = $state();
	const reduced = $derived(
		typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
	);

	const options: EmblaOptionsType = $derived({
		axis: 'y',
		loop,
		align: 'center',
		containScroll: false,
		dragFree: false,
		duration: 20
	});

	const index = $derived(items.findIndex((i) => i === value));

	function onSelect(carousel: EmblaCarouselType) {
		const next = items[carousel.selectedScrollSnap()];
		if (next !== undefined && next !== value) {
			value = next;
			onValueChange?.(next);
		}
	}

	// Per frame: every row's scale/opacity (flat) or its place on the cylinder (drum), from its
	// distance to the centre of the window. The selected row is marked with data-selected, so
	// the colour comes from the markup, not from here.
	function paint(carousel: EmblaCarouselType) {
		const rootRect = carousel.rootNode().getBoundingClientRect();
		const centre = rootRect.top + rootRect.height / 2;
		for (const slide of carousel.slideNodes()) {
			const content = slide.firstElementChild as HTMLElement | null;
			if (!content) continue;
			const rect = slide.getBoundingClientRect();
			const offset = rect.top + rect.height / 2 - centre;
			let selected: boolean;
			if (variant === 'flat') {
				const slotsAway = Math.abs(offset) / g.item;
				selected = slotsAway < 0.5;
				const scale = selected ? 1.1 - slotsAway * 0.2 : Math.max(0.7, 0.95 - slotsAway * 0.08);
				const opacity = selected ? 1 : Math.max(0.05, 1 - slotsAway * 0.35);
				content.style.transform = `scale(${scale})`;
				content.style.opacity = String(opacity);
			} else {
				const angle = -(offset / g.radius) * (180 / Math.PI);
				selected = Math.abs(angle) < 10;
				if (Math.abs(angle) > 90) {
					content.style.visibility = 'hidden';
				} else {
					content.style.visibility = 'visible';
					content.style.opacity = String(1 - Math.pow(Math.abs(angle) / 90, 3));
					// back to the centre, turned on the cylinder, pushed out to its surface
					content.style.transform = `translateY(${-offset}px) rotateX(${angle}deg) translateZ(${g.radius}px)`;
				}
			}
			content.dataset.selected = String(selected);
		}
	}

	function onInit(event: CustomEvent<EmblaCarouselType>) {
		api = event.detail;
		api.on('select', onSelect);
		api.on('scroll', () => requestAnimationFrame(() => api && paint(api)));
		api.on('reInit', () => requestAnimationFrame(() => api && paint(api)));
		requestAnimationFrame(() => api && paint(api));
		if (index !== -1) api.scrollTo(index, true);
	}

	// Follow a value set from outside. A match at the current snap is left alone, so a looped
	// column never jumps a full turn to the same item.
	$effect(() => {
		if (!api || value === undefined) return;
		const current = api.selectedScrollSnap();
		if (items[current] === value) return;
		if (index !== -1 && index !== current) api.scrollTo(index, reduced);
	});

	// The mouse wheel steps one row. Svelte registers wheel listeners passive, and this one must
	// preventDefault so the page does not scroll with it, hence by hand, removed on destroy.
	$effect(() => {
		const node = root;
		if (!node) return;
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			if (e.deltaY > 0) api?.scrollNext(reduced);
			else api?.scrollPrev(reduced);
		};
		node.addEventListener('wheel', onWheel, { passive: false });
		return () => node.removeEventListener('wheel', onWheel);
	});

	// Keyboard moves are instant (jump), pointer moves animate.
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') api?.scrollNext(true);
		else if (e.key === 'ArrowUp') api?.scrollPrev(true);
		else if (e.key === 'Home') api?.scrollTo(0, true);
		else if (e.key === 'End') api?.scrollTo(items.length - 1, true);
		else return;
		e.preventDefault();
	}
</script>

<div
	bind:this={root}
	class={cn(
		'focus-visible:ring-ring relative flex flex-col justify-center overflow-hidden rounded-md select-none focus-visible:ring-2 focus-visible:outline-none',
		// the drum's top and bottom fade out: a mask, so it fades into whatever it stands on
		variant === 'drum' && '[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]',
		className
	)}
	style="height: {g.window}px;{variant === 'drum' ? ` perspective: ${g.perspective}px;` : ''}"
	role="spinbutton"
	tabindex="0"
	aria-label={label}
	aria-valuenow={index === -1 ? undefined : index}
	aria-valuemin={0}
	aria-valuemax={items.length - 1}
	aria-valuetext={value === undefined ? undefined : String(value)}
	onkeydown={onKeydown}
>
	<div class="h-full w-full outline-none" use:emblaCarouselSvelte={{ options, plugins: [] }} onemblaInit={onInit}>
		<div class="flex h-full flex-col items-center" style={variant === 'drum' ? 'transform-style: preserve-3d;' : undefined}>
			{#each items as item, i (item)}
				<div
					class="flex w-full items-center justify-center"
					style="flex: 0 0 {g.item}px; height: {g.item}px;"
					onclick={() => api?.scrollTo(i, reduced)}
					role="presentation"
				>
					<span
						class={cn(
							'text-muted-foreground cursor-pointer tabular-nums will-change-transform data-[selected=true]:text-foreground data-[selected=true]:font-medium',
							variant === 'drum' ? 'text-lg [backface-visibility:hidden]' : 'text-base'
						)}
						data-selected="false"
					>
						{item}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
