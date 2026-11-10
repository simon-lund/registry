<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Spinner } from '#lib/registry/ui/spinner/index.js';
	import { getMarkup, type MarkupStatus } from './context.svelte.js';

	/**
	 * MarkupSend: sends the note (a submit Button inside MarkupNote; the main action, so primary).
	 * Off while the note is empty or on its way; a Spinner while sending. Its children get the
	 * `status`, so a failed send can say so ("Retry"). `aria-label` is yours.
	 *
	 * @example
	 * <MarkupSend aria-label="Send">
	 *   {#snippet children({ status })}{#if status === 'failed'}Retry{:else}<SendIcon />{/if}{/snippet}
	 * </MarkupSend>
	 */
	let {
		size = 'icon-sm',
		children,
		...restProps
	}: Omit<ComponentProps<typeof Button>, 'children' | 'type'> & {
		children?: Snippet<[{ status: MarkupStatus }]>;
	} = $props();

	const markup = getMarkup('MarkupSend');
</script>

<Button
	type="submit"
	data-slot="markup-send"
	data-status={markup.status}
	{size}
	disabled={!markup.canSend}
	aria-busy={markup.status === 'sending'}
	{...restProps}
>
	{#if markup.status === 'sending'}
		<Spinner aria-hidden="true" />
	{:else}
		{@render children?.({ status: markup.status })}
	{/if}
</Button>
