<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import BrushCleaningIcon from '@lucide/svelte/icons/brush-cleaning';
	import TerminalButton from './terminal-button.svelte';

	/**
	 * TerminalClearButton: the quiet broom that empties the view. The output is the consumer's:
	 * empty it in `onclick`. Requires an `aria-label` ("Clear output"). Disable it while there
	 * is nothing to clear if that helps.
	 *
	 * @example
	 * <TerminalClearButton aria-label="Clear output" onclick={() => (log = '')} />
	 */
	let {
		ref = $bindable(null),
		children,
		...restProps
	}: ComponentProps<typeof TerminalButton> = $props();
</script>

<TerminalButton bind:ref data-slot="terminal-clear-button" {...restProps}>
	{#if children}{@render children()}{:else}<BrushCleaningIcon aria-hidden="true" />{/if}
</TerminalButton>
