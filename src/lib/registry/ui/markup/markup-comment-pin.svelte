<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const pinVariants = tv({
		base: [
			'grid size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border text-xs font-medium tabular-nums shadow-md outline-none',
			'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
			"transition-[scale] duration-(--dur-quick) ease-(--ease-settle) starting:scale-40 [&_svg:not([class*='size-'])]:size-3.5"
		],
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground',
				done: 'bg-muted text-muted-foreground'
			}
		},
		defaultVariants: { variant: 'default' }
	});

	export type PinVariant = VariantProps<typeof pinVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getMarkup } from './context.svelte.js';
	import { getComment } from './comment.svelte.js';
	import { follow } from './follow.js';

	/**
	 * MarkupCommentPin: the comment's pin, a 24px circle that opens and closes its box. Put the
	 * comment's number inside, or a check once it is done (`variant="done"`, quiet). `aria-label` is
	 * yours.
	 *
	 * Where it sits, one of two ways:
	 * - On an element (the one the select tool clicked): give it as `anchor` and the point clicked
	 *   as `at`, fractions of the element's box. The pin places itself there and follows the element
	 *   as the page scrolls, resizes or reflows (Floating UI's autoUpdate).
	 * - Anywhere else: its centre sits on `left` and `top`; position it yourself (`class="absolute"`
	 *   in a layer over the page, `fixed` in viewport coordinates).
	 *
	 * Either way, render it above the layer that catches the clicks.
	 *
	 * @example
	 * <MarkupCommentPin anchor={el} at={{ x: 0.2, y: 0.5 }} aria-label="Comment 1">1</MarkupCommentPin>
	 */
	let {
		variant = 'default',
		anchor = null,
		at = { x: 0.5, y: 0.5 },
		class: className,
		style,
		children,
		onclick,
		onkeydown,
		...restProps
	}: Omit<HTMLButtonAttributes, 'type'> & {
		variant?: PinVariant;
		/** The element the comment is on; the pin follows it. */
		anchor?: Element | null;
		/** Where on the anchor, as fractions of its box: 0, 0 its top left, 1, 1 its bottom right. */
		at?: { x: number; y: number };
	} = $props();

	const markup = getMarkup('MarkupCommentPin');
	const comment = getComment('MarkupCommentPin');

	// On an anchor: the point on its box, in the pin's containing block, kept up to date.
	let pos = $state<{ left: number; top: number } | null>(null);
	$effect(() => {
		const pin = comment.pin;
		const el = anchor;
		const { x, y } = at;
		if (!pin || !el) return;
		const stop = follow(el, pin, (b) => (pos = { left: b.x + x * b.width, top: b.y + y * b.height }));
		return () => {
			stop();
			pos = null;
		};
	});
</script>

<button
	bind:this={comment.pin}
	type="button"
	data-slot="markup-comment-pin"
	data-markup={markup.id}
	data-variant={variant}
	data-state={comment.open ? 'open' : 'closed'}
	aria-expanded={comment.open}
	aria-controls={comment.open ? comment.id : undefined}
	class={cn(pinVariants({ variant }), anchor && 'absolute', className)}
	style={anchor && pos ? `left: ${pos.left}px; top: ${pos.top}px` : style}
	onclick={(e) => {
		onclick?.(e);
		if (!e.defaultPrevented) comment.setOpen(!comment.open);
	}}
	onkeydown={(e) => {
		onkeydown?.(e);
		// the page's own keys never fire from the pin
		e.stopPropagation();
	}}
	{...restProps}
>
	{@render children?.()}
</button>
