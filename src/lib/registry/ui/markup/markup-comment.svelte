<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getMarkup } from './context.svelte.js';
	import { MarkupCommentState, setComment } from './comment.svelte.js';

	/**
	 * MarkupComment: one comment on the page: a numbered pin where it was placed, and a box to
	 * write it in that floats from the pin. Compose a MarkupCommentPin and a MarkupCommentBox inside;
	 * renders nothing of its own. Where it goes is the app's: place the pin where the select tool
	 * clicked.
	 *
	 * Open, the box is on the Escape ladder (after a menu, before the tool). Sent, the box closes and
	 * the text stays: the pin opens it again. A press anywhere outside the box and its pin closes it,
	 * too; `onOpenChange` lets you drop a comment that was closed empty.
	 *
	 * @example
	 * <MarkupComment bind:open bind:value onSend={(text) => save(id, text)}>
	 *   <MarkupCommentPin class="absolute" style="left: {x}px; top: {y}px" aria-label="Comment 1">1</MarkupCommentPin>
	 *   <MarkupCommentBox placeholder="Add a comment" aria-label="Comment 1">
	 *     <MarkupCommentSend aria-label="Send"><ArrowUpIcon /></MarkupCommentSend>
	 *   </MarkupCommentBox>
	 * </MarkupComment>
	 */
	let {
		open = $bindable(false),
		value = $bindable(''),
		onOpenChange,
		onSend,
		children
	}: {
		/** Whether the box is open. */
		open?: boolean;
		/** The comment's text. */
		value?: string;
		/** Called when the box opens or closes by the pin, Send, Escape or a press outside. */
		onOpenChange?: (open: boolean) => void;
		/** Gets the text (trimmed) when it is sent. */
		onSend?: (value: string) => void;
		children?: Snippet;
	} = $props();

	const markup = getMarkup('MarkupComment');
	const id = $props.id();
	const comment = new MarkupCommentState({
		id,
		open: { get: () => open, set: (v) => (open = v) },
		value: { get: () => value, set: (v) => (value = v) },
		onOpenChange: () => onOpenChange,
		onSend: () => onSend
	});
	setComment(comment);

	// Open, it is the first thing Escape closes, after a menu.
	$effect(() => {
		if (!open) return;
		return markup.holdComment(() => comment.setOpen(false, true));
	});
</script>

{@render children?.()}
