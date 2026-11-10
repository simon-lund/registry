<script lang="ts">
	import type { Snippet } from 'svelte';
	import { TooltipProvider } from '#lib/registry/ui/tooltip/index.js';
	import { MarkupState, setMarkup, type MarkupShape, type MarkupTool } from './context.svelte.js';

	/**
	 * Markup: the UI of a mark-up tool, as Claude Code's browser pane has it: a bar to pick a tool,
	 * a colour and a width, and comments (a numbered pin, a box to write in) for the places you
	 * click. It catches no clicks, draws nothing and keeps nothing by itself: what a tool does, where
	 * a pin goes and where marks and comments are saved are the app's. Read `tool`, `colour` and
	 * `width`; place a MarkupComment where the select tool clicked; save a comment in its `onSend`
	 * and a drawing when its stroke ends, so nothing waits for a send.
	 *
	 * The root holds the shared state and renders nothing of its own: compose MarkupBar and the
	 * comments inside it.
	 *
	 * Every word is the app's: the tools' and buttons' `aria-label`s (shown as tooltips) and the
	 * comment's placeholder.
	 *
	 * @example
	 * <Markup bind:tool bind:colour>
	 *   <MarkupBar>…</MarkupBar>
	 *   {#each comments as c (c.id)}<MarkupComment …>…</MarkupComment>{/each}
	 * </Markup>
	 */
	let {
		tool = $bindable(null),
		shape = $bindable('rectangle'),
		colour = $bindable('var(--foreground)'),
		width = $bindable(3),
		children
	}: {
		/** The tool in hand; null: none, the page works as usual. */
		tool?: MarkupTool | null;
		/** The kind the shape tool draws. */
		shape?: MarkupShape;
		/** The colour marks are made in, any CSS colour (the picked swatch's value). */
		colour?: string;
		/** The width marks are made in, in px. */
		width?: number;
		children?: Snippet;
	} = $props();

	const id = $props.id();
	setMarkup(
		new MarkupState({
			id,
			tool: { get: () => tool, set: (v) => (tool = v) },
			shape: { get: () => shape, set: (v) => (shape = v) },
			colour: { get: () => colour, set: (v) => (colour = v) },
			width: { get: () => width, set: (v) => (width = v) },
		})
	);
</script>

<TooltipProvider delayDuration={300}>
	{@render children?.()}
</TooltipProvider>
