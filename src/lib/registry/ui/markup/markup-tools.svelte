<script lang="ts">
	import { Toolbar as ToolbarPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	/**
	 * MarkupTools: the tools and the two menus as one toolbar (bits-ui Toolbar): one tab stop, the
	 * arrows move along it. Name it with `aria-label`.
	 *
	 * @example
	 * <MarkupTools aria-label="Tools">…</MarkupTools>
	 */
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ToolbarPrimitive.RootProps = $props();
</script>

<ToolbarPrimitive.Root
	bind:ref
	data-slot="markup-tools"
	loop
	class={cn('flex items-center gap-1', className)}
	{...restProps}
/>
