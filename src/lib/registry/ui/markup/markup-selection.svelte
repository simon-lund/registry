<script lang="ts" module>
	/** Where a selection is taken hold of: its body to move it, or one of its eight handles. */
	export type MarkupHandle = 'move' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

	// Each handle: where it sits on the box (fractions) and its cursor.
	const HANDLES: { name: Exclude<MarkupHandle, 'move'>; x: number; y: number; cursor: string }[] = [
		{ name: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
		{ name: 'n', x: 0.5, y: 0, cursor: 'ns-resize' },
		{ name: 'ne', x: 1, y: 0, cursor: 'nesw-resize' },
		{ name: 'e', x: 1, y: 0.5, cursor: 'ew-resize' },
		{ name: 'se', x: 1, y: 1, cursor: 'nwse-resize' },
		{ name: 's', x: 0.5, y: 1, cursor: 'ns-resize' },
		{ name: 'sw', x: 0, y: 1, cursor: 'nesw-resize' },
		{ name: 'w', x: 0, y: 0.5, cursor: 'ew-resize' }
	];
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * MarkupSelection: the handles around a selected mark, eight dots on its box. It only draws:
	 * moving and resizing are yours. A pointerdown on it tells you where it was taken hold of:
	 * `onHold('se', event)` for a handle, `'move'` for the body. Give `rect` in the coordinates of
	 * where you place it (`absolute` in your marks' layer, `fixed` in viewport coordinates).
	 *
	 * @example
	 * <MarkupSelection class="absolute" rect={box} onHold={(handle, e) => startDrag(handle, e)} />
	 */
	let {
		rect,
		onHold,
		class: className,
		...restProps
	}: Omit<HTMLAttributes<HTMLDivElement>, 'onpointerdown'> & {
		/** The mark's box. */
		rect: { x: number; y: number; width: number; height: number };
		/** A pointerdown on the body ('move') or a handle. */
		onHold?: (handle: MarkupHandle, e: PointerEvent) => void;
	} = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-slot="markup-selection"
	class={cn('cursor-move touch-none', className)}
	style:left="{rect.x}px"
	style:top="{rect.y}px"
	style:width="{rect.width}px"
	style:height="{rect.height}px"
	onpointerdown={(e) => {
		if (e.button !== 0) return;
		const handle = (e.target as HTMLElement).closest<HTMLElement>('[data-handle]')?.dataset.handle;
		onHold?.((handle as MarkupHandle) ?? 'move', e);
	}}
	{...restProps}
>
	{#each HANDLES as h (h.name)}
		<!-- a 10px dot, a 24px target -->
		<span
			data-handle={h.name}
			class="border-background bg-primary absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm after:absolute after:-inset-2 after:content-['']"
			style:left="{h.x * 100}%"
			style:top="{h.y * 100}%"
			style:cursor={h.cursor}
		></span>
	{/each}
</div>
