<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Input } from '#lib/registry/ui/input/index.js';
	import { cn } from '#lib/utils.js';
	import { getMarkup } from './context.svelte.js';

	/**
	 * MarkupNote: the note, a stock Input in a form, flat in the bar until it has focus. Enter
	 * sends it; put a MarkupSend inside. It reads, but cannot change, while the note is sending.
	 * `placeholder` ("Add to chat") and `aria-label` are yours; `class` goes to the form.
	 *
	 * @example
	 * <MarkupNote placeholder="Add to chat" aria-label="Note"><MarkupSend aria-label="Send" /></MarkupNote>
	 */
	let {
		class: className,
		placeholder,
		name,
		maxlength,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		children
	}: {
		class?: string;
		placeholder?: string;
		/** Submits the note with an outer form too. */
		name?: string;
		maxlength?: number;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		children?: Snippet;
	} = $props();

	const markup = getMarkup('MarkupNote');
</script>

<form
	data-slot="markup-note"
	class={cn('flex min-w-28 flex-1 items-center gap-1', className)}
	onsubmit={(e) => {
		e.preventDefault();
		void markup.send();
	}}
>
	<Input
		bind:value={() => markup.note, (v) => (markup.note = v ?? '')}
		readonly={markup.status === 'sending'}
		autocomplete="off"
		{placeholder}
		{name}
		{maxlength}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		class="h-8 min-w-0 flex-1 border-transparent bg-transparent shadow-none dark:bg-transparent"
	/>
	{@render children?.()}
</form>
