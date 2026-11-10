<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';

	/**
	 * MarkupClose: closes the bar, a ghost icon Button; what closing means (hiding the bar, ending a
	 * review) is your `onclick`. Put its icon inside; `aria-label` is yours.
	 *
	 * @example
	 * <MarkupClose aria-label="Close" onclick={() => (open = false)}><XIcon /></MarkupClose>
	 */
	let { variant = 'ghost', size = 'icon-sm', ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button data-slot="markup-close" {variant} {size} {...restProps} />
