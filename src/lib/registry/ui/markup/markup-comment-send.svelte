<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { getComment } from './comment.svelte.js';

	/**
	 * MarkupCommentSend: sends the comment, inside its box (a primary icon Button, the box's submit).
	 * Off while the text is empty. Put its icon inside; `aria-label` is yours.
	 *
	 * @example
	 * <MarkupCommentSend aria-label="Send"><ArrowUpIcon /></MarkupCommentSend>
	 */
	let { size = 'icon-sm', disabled, ...restProps }: Omit<ComponentProps<typeof Button>, 'type'> = $props();

	const comment = getComment('MarkupCommentSend');
</script>

<Button
	type="submit"
	data-slot="markup-comment-send"
	{size}
	disabled={disabled || !comment.canSend}
	class="shrink-0"
	{...restProps}
/>
