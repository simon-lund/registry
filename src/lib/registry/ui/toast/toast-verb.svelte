<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * ToastVerb: the bold first word of a ToastMessage, what just happened.
	 *
	 * @example
	 * <ToastMessage><ToastVerb>Archived</ToastVerb><Middot />Q3 report</ToastMessage>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();
</script>

<b bind:this={ref} data-slot="toast-verb" class={cn('font-semibold', className)} {...restProps}>
	{@render children?.()}
</b>
