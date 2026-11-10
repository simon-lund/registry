<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const highlightVariants = tv({
		base: 'group/highlight pointer-events-none rounded-sm outline-[1.5px] outline-offset-2 outline-solid transition-[outline-color,background-color] duration-(--dur-quick)',
		variants: {
			variant: {
				// picked: copper, and it stays
				default: 'outline-primary bg-primary/10',
				// only pointed at: grey, a suggestion
				muted: 'outline-muted-foreground/60 bg-foreground/5'
			}
		},
		defaultVariants: { variant: 'default' }
	});

	export type HighlightVariant = VariantProps<typeof highlightVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { follow, type MarkupBox } from './follow.js';

	/**
	 * MarkupHighlight: the outline around an element, with its tag above it ("span.status") as
	 * children: copper for an element that is picked, `variant="muted"` (grey) for one only pointed
	 * at. MarkupLayer draws these for you; use it alone for an outline of your own. Give the
	 * element as `anchor` and it follows it as the page scrolls, resizes or reflows; or give its box
	 * as `rect`, in the coordinates of where you place it. Position it yourself (`class="absolute"`
	 * in a layer, `fixed` in viewport coordinates). Clicks pass through it.
	 *
	 * @example
	 * <MarkupHighlight class="absolute" anchor={el}>span.status</MarkupHighlight>
	 */
	let {
		variant = 'default',
		anchor = null,
		rect,
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		variant?: HighlightVariant;
		/** The element to outline; the outline follows it. */
		anchor?: Element | null;
		/** Or the box to outline, without an anchor. */
		rect?: MarkupBox;
	} = $props();

	let ref = $state<HTMLDivElement | null>(null);
	let followed = $state<MarkupBox | null>(null);
	$effect(() => {
		const el = anchor;
		if (!ref || !el) return;
		const stop = follow(el, ref, (b) => (followed = b));
		return () => {
			stop();
			followed = null;
		};
	});

	const box = $derived(anchor ? followed : rect);
</script>

<div
	bind:this={ref}
	data-slot="markup-highlight"
	data-variant={variant}
	class={cn(highlightVariants({ variant }), !box && 'invisible', className)}
	style:left="{box?.x ?? 0}px"
	style:top="{box?.y ?? 0}px"
	style:width="{box?.width ?? 0}px"
	style:height="{box?.height ?? 0}px"
	{...restProps}
>
	{#if children}
		<span
			data-slot="markup-highlight-label"
			class="bg-primary text-primary-foreground group-data-[variant=muted]/highlight:bg-muted group-data-[variant=muted]/highlight:text-foreground absolute bottom-[calc(100%+6px)] -left-0.5 rounded-sm px-1.5 py-0.5 text-xs leading-4 font-medium whitespace-nowrap"
		>
			{@render children()}
		</span>
	{/if}
</div>
