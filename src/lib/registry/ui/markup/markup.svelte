<script lang="ts">
	import type { Snippet } from 'svelte';
	import { TooltipProvider } from '#lib/registry/ui/tooltip/index.js';
	import { MarkupState, setMarkup, type MarkupTool } from './context.svelte.js';

	/**
	 * Markup: the toolbar of a mark-up tool, as Claude Code's browser pane has it: pick a tool, a
	 * colour and a width, write a note, send it. The bar only; it draws nothing on the page. What a
	 * tool does (pin an element, draw), where marks are kept and where a note goes are the app's:
	 * read `tool`, `colour` and `width`, and send in `onSend`.
	 *
	 * The root holds the bar's state and renders nothing of its own: compose MarkupBar inside it.
	 * `onSend` gets the note; while its promise runs the bar is sending, a rejection makes it failed
	 * (the note is kept, Send retries), a fulfilment clears the note.
	 *
	 * Every word is the app's: the tools' and buttons' `aria-label`s (shown as tooltips) and the
	 * note's placeholder.
	 *
	 * @example
	 * <Markup bind:tool bind:colour onSend={(note) => post(note, marks)}>
	 *   <MarkupBar>…</MarkupBar>
	 * </Markup>
	 */
	let {
		tool = $bindable(null),
		colour = $bindable('var(--foreground)'),
		width = $bindable(3),
		note = $bindable(''),
		onSend,
		children
	}: {
		/** The tool in hand; null: none, the page works as usual. */
		tool?: MarkupTool | null;
		/** The colour marks are made in, any CSS colour (the picked swatch's value). */
		colour?: string;
		/** The width marks are made in, in px. */
		width?: number;
		/** The note being written. */
		note?: string;
		/** Sends the note; may return a promise. */
		onSend?: (note: string) => void | Promise<void>;
		children?: Snippet;
	} = $props();

	setMarkup(
		new MarkupState({
			tool: { get: () => tool, set: (v) => (tool = v) },
			colour: { get: () => colour, set: (v) => (colour = v) },
			width: { get: () => width, set: (v) => (width = v) },
			note: { get: () => note, set: (v) => (note = v) },
			onSend: () => onSend
		})
	);
</script>

<TooltipProvider delayDuration={300}>
	{@render children?.()}
</TooltipProvider>
