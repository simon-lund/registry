<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getMarkup, type MarkupSpot } from './context.svelte.js';
	import Highlight from './markup-highlight.svelte';

	/**
	 * MarkupLayer: the layer over the page that the select and comment tools work on. It catches the
	 * pointer only while one of them is in hand; otherwise the page works as usual.
	 *
	 * - Select picks elements. The element under the pointer is outlined in grey with its tag; a
	 *   click adds it to `selected` and turns it copper, and a click on it again takes it out. What a picked element means (context
	 *   for a chat, a selector you save) is yours.
	 * - Comment places a comment anywhere: a click calls `onPlace` with the element under it and the
	 *   point on that element. Keep both, and render a MarkupComment whose pin has them as `anchor`
	 *   and `at`.
	 *
	 * The picked elements stay outlined, whatever the tool, and the outlines follow them as the page
	 * scrolls, resizes or reflows. Only elements inside `root` can be picked; nothing of the bar or
	 * the comments is. It covers the viewport (`fixed inset-0`); `class="absolute inset-0"` covers a
	 * positioned container instead. Render it before the comments and the bar, so they sit above it.
	 *
	 * Picking is by pointer: there is no keyboard way to point at a part of a page.
	 *
	 * @example
	 * <MarkupLayer bind:selected onPlace={(spot) => comments.push({ ...spot, text: '', open: true })} />
	 */
	let {
		root = null,
		selected = $bindable([]),
		onPlace,
		label = name,
		class: className,
		...restProps
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** The element whose descendants can be picked; the whole document by default. */
		root?: Element | null;
		/** The picked elements, in the order they were picked. */
		selected?: Element[];
		/** Called when the comment tool clicks: where the comment goes. */
		onPlace?: (spot: MarkupSpot) => void;
		/** An element's tag on its outline; its tag name and first class by default ("span.status"). */
		label?: (element: Element) => string;
	} = $props();

	const markup = getMarkup('MarkupLayer');

	let ref = $state<HTMLDivElement | null>(null);
	let hover = $state<Element | null>(null);
	const active = $derived(markup.tool === 'select' || markup.tool === 'comment');
	// the element select would pick, unless it is picked already (then it is outlined anyway)
	const pointed = $derived(markup.tool === 'select' && hover && !selected.includes(hover) ? hover : null);

	function name(el: Element) {
		const cls = el.classList[0];
		return el.tagName.toLowerCase() + (cls ? `.${cls}` : '');
	}

	// The topmost element under a point inside root, not this layer nor any part of a Markup.
	function under(e: MouseEvent) {
		const scope = root ?? document.body;
		return (
			document
				.elementsFromPoint(e.clientX, e.clientY)
				.find((n) => !ref?.contains(n) && !n.closest('[data-markup]') && n !== scope && scope.contains(n)) ?? null
		);
	}

	function pick(e: MouseEvent) {
		const el = under(e);
		if (!el) return;
		selected = selected.includes(el) ? selected.filter((o) => o !== el) : [...selected, el];
	}

	function place(e: MouseEvent) {
		// off every element: on root itself
		const element = under(e) ?? root ?? document.body;
		const r = element.getBoundingClientRect();
		onPlace?.({ element, at: { x: (e.clientX - r.left) / (r.width || 1), y: (e.clientY - r.top) / (r.height || 1) } });
	}
</script>

<!-- picking is by pointer: there is no keyboard way to point at a part of a page -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={ref}
	role="presentation"
	data-slot="markup-layer"
	data-tool={active ? markup.tool : undefined}
	class={cn(
		'fixed inset-0',
		active ? 'pointer-events-auto' : 'pointer-events-none',
		markup.tool === 'comment' && 'cursor-crosshair',
		className
	)}
	onpointermove={(e) => (hover = markup.tool === 'select' ? under(e) : null)}
	onpointerleave={() => (hover = null)}
	onclick={(e) => {
		if (markup.tool === 'select') pick(e);
		else if (markup.tool === 'comment') place(e);
	}}
	{...restProps}
>
	{#each selected as el (el)}
		<Highlight class="absolute" anchor={el}>{label(el)}</Highlight>
	{/each}
	{#if pointed}
		<Highlight class="absolute" variant="muted" anchor={pointed}>{label(pointed)}</Highlight>
	{/if}
</div>
