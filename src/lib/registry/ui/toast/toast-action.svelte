<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { cn } from '#lib/utils.js';

	/**
	 * ToastAction: the toast's one action, a ghost Button in the toast's ink: 36px drawn, 44px to
	 * touch. Hover lays the toast's wash under it. A real button, so Tab reaches it and Enter or
	 * Space runs it.
	 *
	 * @example
	 * <ToastAction onclick={restore}>Undo</ToastAction>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Omit<ComponentProps<typeof Button>, 'variant' | 'size'> = $props();
</script>

<Button
	bind:ref
	data-slot="toast-action"
	variant="ghost"
	size="sm"
	class={cn(
		'relative h-9 rounded-md px-3 text-sm font-semibold after:absolute after:-inset-y-1 after:inset-x-0',
		'text-(--toast-accent,var(--foreground)) hover:text-(--toast-accent,var(--foreground))',
		'hover:bg-(--toast-wash,var(--muted)) dark:hover:bg-(--toast-wash,var(--muted))',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</Button>
