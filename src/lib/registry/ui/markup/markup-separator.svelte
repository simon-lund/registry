<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/** MarkupSeparator: a fine vertical line between groups of the bar. Decoration. */
	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	role="separator"
	aria-orientation="vertical"
	data-slot="markup-separator"
	class={cn('bg-border mx-1 h-5 w-px shrink-0', className)}
	{...restProps}
></div>
