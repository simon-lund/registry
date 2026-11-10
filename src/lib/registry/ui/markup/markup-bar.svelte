<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getMarkup } from './context.svelte.js';

	/**
	 * MarkupBar: the floating bar, fixed at the bottom centre by default (place it with `class`).
	 * It floats, so it has the one shadow. Holds MarkupTools, MarkupSeparator, MarkupNote and
	 * MarkupClose, in the order you compose them. Too narrow for all of it (a phone), the note wraps
	 * to a second row with what follows it.
	 *
	 * Keys stay inside it: no keydown in the bar or its menus reaches the page, so a page's own keys
	 * (a slide deck's space, arrows and Escape) never fire while you write a note. Escape is a ladder
	 * wherever focus is, while there is something to undo: an open menu closes, else the tool in
	 * hand is put down; with nothing in hand the page has its Escape back. Name it with `aria-label`.
	 *
	 * @example
	 * <MarkupBar aria-label="Mark up this page">…</MarkupBar>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		onkeydown,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { ref?: HTMLDivElement | null } = $props();

	const markup = getMarkup('MarkupBar');

	// Escape first, before any of the page's listeners: one step down the ladder, and the page never
	// sees it. Only while there is a step to take.
	$effect(() => {
		if (!markup.menu && !markup.tool) return;
		const onEscape = (e: KeyboardEvent) => {
			if (e.key !== 'Escape' || e.isComposing) return;
			if (!markup.escape()) return;
			e.preventDefault();
			e.stopImmediatePropagation();
		};
		window.addEventListener('keydown', onEscape, { capture: true });
		return () => window.removeEventListener('keydown', onEscape, { capture: true });
	});
</script>

<div
	bind:this={ref}
	role="group"
	data-slot="markup-bar"
	data-status={markup.status}
	data-tool={markup.tool ?? undefined}
	class={cn(
		'bg-popover text-popover-foreground fixed bottom-4 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center gap-1 rounded-xl border p-1 shadow-lg',
		className
	)}
	onkeydown={(e) => {
		onkeydown?.(e);
		// the page's own keys never fire from in here
		e.stopPropagation();
	}}
	{...restProps}
>
	{@render children?.()}
</div>
