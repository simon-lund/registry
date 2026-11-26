<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/** ChainOfThoughtImageCaption: the line under a ChainOfThoughtImage, 12px and muted, set in from the frame's edge. */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();
</script>

<!-- Rendered inside ChainOfThoughtImage, which is the figure. -->
<!-- svelte-ignore a11y_figcaption_parent -->
<figcaption
	bind:this={ref}
	data-slot="chain-of-thought-image-caption"
	class={cn('px-1.5 pb-0.5 text-xs text-muted-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</figcaption>
