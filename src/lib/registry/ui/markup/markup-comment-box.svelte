<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Portal } from 'bits-ui';
	import { autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
	import { Textarea } from '#lib/registry/ui/textarea/index.js';
	import { cn } from '#lib/utils.js';
	import { getMarkup } from './context.svelte.js';
	import { getComment } from './comment.svelte.js';

	/**
	 * MarkupCommentBox: the box to write the comment in, while it is open: one surface, a field
	 * that grows with its text and, inside it, the send button (put a MarkupCommentSend in). It
	 * floats from the pin's corner, below and to the right; where that would leave the screen it
	 * opens on another side (Floating UI), and the corner it grew from is the one that is pointed.
	 * Where no side has room (a narrow phone) it is moved to fit, and then all four corners are round.
	 *
	 * It takes focus when it opens. Enter sends, Shift+Enter starts a new line; no key typed in it
	 * reaches the page. `placeholder` ("Add a comment") and `aria-label` are yours; `class` goes to
	 * the box.
	 *
	 * @example
	 * <MarkupCommentBox placeholder="Add a comment" aria-label="Comment 1">
	 *   <MarkupCommentSend aria-label="Send"><ArrowUpIcon /></MarkupCommentSend>
	 * </MarkupCommentBox>
	 */
	let {
		class: className,
		placeholder,
		name,
		maxlength,
		'aria-label': ariaLabel,
		children
	}: {
		class?: string;
		placeholder?: string;
		/** Submits the text with an outer form too. */
		name?: string;
		maxlength?: number;
		/** Names the box and its field. */
		'aria-label'?: string;
		children?: Snippet;
	} = $props();

	const markup = getMarkup('MarkupCommentBox');
	const comment = getComment('MarkupCommentBox');

	let box = $state<HTMLDivElement | null>(null);
	let field = $state<HTMLTextAreaElement | null>(null);
	let at = $state<{ x: number; y: number; placement: Placement; shifted: boolean } | null>(null);

	// The box's corner touches the pin's box corner, on the side and end that have room.
	$effect(() => {
		const pin = comment.pin;
		const el = box;
		if (!pin || !el) return;
		const stop = autoUpdate(pin, el, async () => {
			const r = await computePosition(pin, el, {
				placement: 'bottom-start',
				strategy: 'fixed',
				middleware: [
					offset(({ rects }) => ({ mainAxis: 0, alignmentAxis: rects.reference.width })),
					flip({ fallbackPlacements: ['bottom-end', 'top-start', 'top-end'], padding: 8 }),
					shift({ padding: 8, crossAxis: true })
				]
			});
			const s = r.middlewareData.shift;
			at = { x: r.x, y: r.y, placement: r.placement, shifted: !!(s && (s.x || s.y)) };
		});
		return () => {
			stop();
			at = null;
		};
	});

	// Placed, it takes focus, with the cursor after any text already written.
	let focused = false;
	$effect(() => {
		if (!at || !field || focused) return;
		focused = true;
		field.focus({ preventScroll: true });
		field.setSelectionRange(field.value.length, field.value.length);
	});

	// A press anywhere outside the box and its pin closes it.
	$effect(() => {
		if (!box) return;
		const onDown = (e: PointerEvent) => {
			const t = e.target as Node;
			if (box?.contains(t) || comment.pin?.contains(t)) return;
			comment.setOpen(false);
		};
		document.addEventListener('pointerdown', onDown, true);
		return () => document.removeEventListener('pointerdown', onDown, true);
	});

	const corner = $derived(at && !at.shifted ? at.placement : undefined);
</script>

{#if comment.open}
	<Portal>
		<div
			bind:this={box}
			id={comment.id}
			role="dialog"
			tabindex="-1"
			aria-label={ariaLabel}
			data-slot="markup-comment-box"
			data-markup={markup.id}
			data-placed={at ? '' : undefined}
			data-corner={corner}
			style:left="{at?.x ?? 0}px"
			style:top="{at?.y ?? 0}px"
			class={cn(
				'bg-popover text-popover-foreground fixed z-50 w-72 max-w-[calc(100vw-1rem)] rounded-xl border shadow-lg',
				'data-[corner=bottom-start]:rounded-tl-none data-[corner=bottom-end]:rounded-tr-none data-[corner=top-start]:rounded-bl-none data-[corner=top-end]:rounded-br-none',
				'data-[corner=bottom-start]:origin-top-left data-[corner=bottom-end]:origin-top-right data-[corner=top-start]:origin-bottom-left data-[corner=top-end]:origin-bottom-right',
				'scale-95 opacity-0 transition-[scale,opacity] duration-(--dur-quick) ease-(--ease-settle) data-placed:scale-100 data-placed:opacity-100',
				className
			)}
			onkeydown={(e) => {
				if (e.key === 'Escape' && !e.isComposing) {
					e.preventDefault();
					comment.setOpen(false, true);
				}
				// the page's own keys never fire from in here
				e.stopPropagation();
			}}
		>
			<form
				class="flex items-end gap-1 p-1"
				onsubmit={(e) => {
					e.preventDefault();
					comment.send();
				}}
			>
				<Textarea
					bind:ref={field}
					bind:value={() => comment.value, (v) => (comment.value = v ?? '')}
					autogrow
					rows={1}
					{placeholder}
					{name}
					{maxlength}
					aria-label={ariaLabel}
					class="max-h-48 min-h-0 flex-1 rounded-lg border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0 dark:bg-transparent"
					onkeydown={(e) => {
						if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
						e.preventDefault();
						comment.send();
					}}
				/>
				{@render children?.()}
			</form>
		</div>
	</Portal>
{/if}
