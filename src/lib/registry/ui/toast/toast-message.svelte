<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * ToastMessage: the one line, in the toast's ink. It takes the free width and truncates, so the
	 * action never moves. Put a ToastVerb first.
	 *
	 * @example
	 * <ToastMessage><ToastVerb>Moved to trash</ToastVerb><Middot />Q3 report</ToastMessage>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLParagraphElement> & { ref?: HTMLParagraphElement | null } = $props();
</script>

<p
	bind:this={ref}
	data-slot="toast-message"
	class={cn('min-w-0 flex-1 truncate text-sm font-medium', className)}
	{...restProps}
>
	{@render children?.()}
</p>
