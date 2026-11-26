<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * ChainOfThoughtImage: an image a step found or made, in a flat frame (the muted surface, 6px
	 * around, the image's radius concentric inside), at most 320px wide. Put an `<img>` with its
	 * `alt` inside, and a ChainOfThoughtImageCaption under it.
	 *
	 * @example
	 * <ChainOfThoughtImage><img src={radar} alt="Rain radar for Hamburg" /><ChainOfThoughtImageCaption>Rain radar, 7 am</ChainOfThoughtImageCaption></ChainOfThoughtImage>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();
</script>

<figure
	bind:this={ref}
	data-slot="chain-of-thought-image"
	class={cn(
		'm-0 flex w-full max-w-80 flex-col gap-1.5 rounded-md bg-muted p-1.5',
		'[&_img]:block [&_img]:w-full [&_img]:rounded-[calc(var(--radius-md)-var(--spacing)*1.5)] [&_img]:object-cover',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</figure>
