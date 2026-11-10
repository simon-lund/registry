<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const pinVariants = tv({
		base: [
			'grid size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-background text-xs font-medium tabular-nums shadow-md outline-none',
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

	/**
	 * MarkupCommentPin: the comment's pin, a 24px circle that opens and closes its box. Its centre
	 * sits on `left` and `top`: position it yourself (`class="absolute"` in a layer over the page,
	 * `fixed` in viewport coordinates), above the layer that catches the clicks. Put the comment's
	 * number inside, or a check once it is done (`variant="done"`, quiet). `aria-label` is yours.
	 *
	 * @example
	 * <MarkupCommentPin class="absolute" style="left: {x}px; top: {y}px" aria-label="Comment 1">1</MarkupCommentPin>
	 */
	let {
		variant = 'default',
		class: className,
		children,
		onclick,
		onkeydown,
		...restProps
	}: Omit<HTMLButtonAttributes, 'type'> & { variant?: PinVariant } = $props();

	const markup = getMarkup('MarkupCommentPin');
	const comment = getComment('MarkupCommentPin');
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
	class={cn(pinVariants({ variant }), className)}
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
