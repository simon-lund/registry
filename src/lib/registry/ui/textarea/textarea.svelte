<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { userInvalid } from './user-invalid.js';

	/**
	 * Textarea: the multi-line field, drawn as the stock Input. Without an `aria-invalid` of yours,
	 * the browser's own validation (`required`, `minlength`) rings it once it was left wrong or a
	 * submit was tried, and sets `aria-invalid` with it.
	 *
	 * Fixed (the default): 96px, then it scrolls; the reader can drag it taller by its own grip, two
	 * short diagonal strokes in the bottom-right corner, inside the field's rounding (the browser's
	 * resizer is hidden). Dragging the grip changes the height only, held between the field's
	 * `min-h-*` and `max-h-*`. With `resizeLabel` ("Resize") the grip is a separator in the tab order
	 * too: ArrowDown and ArrowUp make the field a line taller or shorter, Home and End go to its
	 * least and its greatest height (End only with a `max-h-*`). `resizable={false}` leaves the grip
	 * out; `disabled` hides it.
	 *
	 * `autogrow` lets it grow with its text instead (CSS `field-sizing: content`; where a browser
	 * lacks it, the height follows the text by script), so it has no grip. Cap it with a `max-h-*`
	 * class and it scrolls from there.
	 *
	 * `class` and the attributes go to the `<textarea>`. With the grip, the field and the grip stand
	 * in a full-width frame (`data-slot="textarea-frame"`): give the field its width through its
	 * container.
	 *
	 * It has no label or message of its own: pair it with a `<label>` and name the message in
	 * `aria-describedby`.
	 *
	 * @example
	 * <Textarea id="note" bind:value resizeLabel="Resize" aria-describedby="note-hint" />
	 * <Textarea id="comment" bind:value autogrow class="max-h-60" />
	 */
	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		autogrow = false,
		resizable = true,
		resizeLabel,
		...restProps
	}: WithElementRef<HTMLTextareaAttributes, HTMLTextAreaElement> & {
		/** Grow with the text (up to a `max-h-*` you set) instead of scrolling. */
		autogrow?: boolean;
		/** Whether the reader can drag the fixed field taller (the grip). Default true. */
		resizable?: boolean;
		/**
		 * The grip's name ("Resize"). With it the grip takes keyboard focus and the arrow keys
		 * resize; without it, it answers the pointer only (as the browser's resizer does).
		 */
		resizeLabel?: string;
	} = $props();

	// Script fallback for browsers without `field-sizing: content` (Firefox, older Safari).
	const native = typeof CSS !== 'undefined' && CSS.supports?.('field-sizing', 'content');

	$effect(() => {
		void value;
		const el = ref;
		if (!autogrow || native || !el) return;
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	});

	const grip = $derived(!autogrow && resizable);

	// The grip: height only, within the field's own min and max height.
	let height = $state<number | null>(null);
	let limits = $state({ min: 0, max: Infinity });
	function measure(el: HTMLTextAreaElement) {
		const cs = getComputedStyle(el);
		const max = parseFloat(cs.maxHeight);
		limits = { min: parseFloat(cs.minHeight) || 0, max: Number.isFinite(max) ? max : Infinity };
		return cs;
	}
	function resizeTo(px: number) {
		const el = ref;
		if (!el) return;
		measure(el);
		const next = Math.round(Math.min(limits.max, Math.max(limits.min, px)));
		el.style.height = `${next}px`;
		height = next;
	}
	// The value the separator reports: the field's height in px, read on mount, on focus and when a
	// drag starts.
	function sync() {
		if (!ref) return;
		measure(ref);
		height = Math.round(ref.getBoundingClientRect().height);
	}

	$effect(() => {
		if (grip && resizeLabel && ref) sync();
	});

	let drag: { id: number; y: number; h: number } | null = null;
	let dragging = $state(false);
	function onpointerdown(e: PointerEvent & { currentTarget: HTMLElement }) {
		if (e.button !== 0 || !ref || restProps.disabled) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		drag = { id: e.pointerId, y: e.clientY, h: ref.getBoundingClientRect().height };
		dragging = true;
		sync();
	}
	function onpointermove(e: PointerEvent) {
		if (!drag || e.pointerId !== drag.id) return;
		resizeTo(drag.h + e.clientY - drag.y);
	}
	function onpointerend(e: PointerEvent & { currentTarget: HTMLElement }) {
		if (!drag || e.pointerId !== drag.id) return;
		if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
		drag = null;
		dragging = false;
	}

	function onkeydown(e: KeyboardEvent) {
		if (!ref || restProps.disabled) return;
		const now = ref.getBoundingClientRect().height;
		const line = parseFloat(measure(ref).lineHeight) || 24;
		const to: Record<string, number> = {
			ArrowDown: now + line,
			ArrowUp: now - line,
			Home: limits.min
		};
		if (Number.isFinite(limits.max)) to.End = limits.max;
		if (!(e.key in to)) return;
		e.preventDefault();
		resizeTo(to[e.key]);
	}
</script>

{#snippet field(extra: string)}
	<textarea
		bind:this={ref}
		bind:value
		data-slot="textarea"
		data-autogrow={autogrow || undefined}
		class={cn(
			'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 placeholder:text-muted-foreground block min-h-24 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-2 text-base outline-none transition-colors focus-visible:ring-3 aria-invalid:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			extra,
			className
		)}
		{@attach restProps['aria-invalid'] === undefined ? userInvalid : undefined}
		{...restProps}
	></textarea>
{/snippet}

{#if grip}
	<div
		data-slot="textarea-frame"
		data-dragging={dragging || undefined}
		class="group/textarea relative grid w-full *:[grid-area:1/1]"
	>
		{@render field('resize-none')}
		{#if !restProps.disabled}
			<!--
				Two diagonal strokes in the corner of a 24px target that sits against the border, so the
				strokes are 6px from the field's edge, inside its 8px rounding. A separator (focusable) when
				named; otherwise for the pointer only, hidden from assistive tech like the browser's own
				resizer. A focusable separator is a widget (WAI-ARIA), which Svelte's role table does not
				know.
			-->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<span
				data-slot="textarea-grip"
				role="separator"
				aria-label={resizeLabel}
				aria-orientation={resizeLabel ? 'horizontal' : undefined}
				aria-valuenow={resizeLabel && height !== null ? height : undefined}
				aria-valuemin={resizeLabel ? Math.round(limits.min) : undefined}
				aria-valuemax={resizeLabel && Number.isFinite(limits.max) ? Math.round(limits.max) : undefined}
				aria-hidden={resizeLabel ? undefined : 'true'}
				tabindex={resizeLabel ? 0 : undefined}
				class={cn(
					'relative me-px mb-px grid size-6 cursor-ns-resize touch-none place-items-end p-1.25 self-end justify-self-end rounded-xs text-muted-foreground',
					'transition-colors duration-(--dur-quick) ease-(--ease-settle)',
					'hover:text-foreground group-data-dragging/textarea:text-foreground focus-visible:text-foreground',
					'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring'
				)}
				onfocus={sync}
				{onpointerdown}
				{onpointermove}
				onpointerup={onpointerend}
				onpointercancel={onpointerend}
				{onkeydown}
			>
				<svg viewBox="0 0 10 10" class="size-2.5 overflow-visible rtl:-scale-x-100" aria-hidden="true">
					<path d="M9 2 2 9M9 6.5 6.5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" />
				</svg>
			</span>
		{/if}
	</div>
{:else}
	{@render field(autogrow ? 'resize-none field-sizing-content' : 'resize-none')}
{/if}
