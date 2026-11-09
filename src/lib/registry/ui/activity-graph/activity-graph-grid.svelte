<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getActivityGraph } from './context.js';
	import { moveFrom, type ActivityCell } from './model.js';

	type Props = WithElementRef<Omit<HTMLAttributes<HTMLDivElement>, 'children'>, HTMLDivElement> & {
		/** Draws one cell: render an ActivityGraphCell with `cell` and its words (and a tooltip if wanted). */
		cell: Snippet<[{ cell: ActivityCell }]>;
	} & (
			| { /** What the grid shows ("Reading, the last 12 months"). */ 'aria-label': string }
			| { /** The id of the visible title that names it. */ 'aria-labelledby': string }
		);

	/**
	 * ActivityGraphGrid: the cells, as an ARIA grid with one tab stop (roving focus). Tab enters on
	 * the newest cell (or the last one visited); the arrow keys move across the grid as drawn
	 * (Left / Right along a row, Up / Down within a column, skipping gaps, no wrap), Home / End to
	 * the ends of the row, Ctrl+Home / Ctrl+End to the oldest / newest cell. Positions outside the
	 * range stay blank and out of reach.
	 *
	 * The grid draws nothing itself: its `cell` snippet renders each ActivityGraphCell, so the
	 * consumer gives it words and can wrap it in a TooltipTrigger. Keys and focus are handled here
	 * by delegation, so a trigger's own handlers on the cell stay untouched.
	 *
	 * Selection (with an ActivityGraphCaption): the focused cell is the selected one, so the arrows
	 * and a tap select; a tap in the 3px gap between the small cells takes the nearest cell.
	 *
	 * @example
	 * <ActivityGraphGrid aria-label="Reading">
	 *   {#snippet cell({ cell })}<ActivityGraphCell {cell} aria-label={describe(cell)} />{/snippet}
	 * </ActivityGraphGrid>
	 */
	let {
		ref = $bindable(null),
		class: className,
		cell: renderCell,
		onkeydown,
		onfocusin,
		onclick,
		...restProps
	}: Props = $props();

	const ctx = getActivityGraph('ActivityGraphGrid');
	const MOVES = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']);

	// the cell an event happened on, if any
	function cellOf(target: EventTarget | null) {
		const el = target instanceof Element ? target.closest<HTMLElement>('[data-slot="activity-graph-cell"]') : null;
		const key = el?.dataset.key;
		return key ? ctx.cell(key) : undefined;
	}

	function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onkeydown?.(e);
		if (e.defaultPrevented || !MOVES.has(e.key) || e.altKey) return;
		const from = cellOf(e.target);
		if (!from) return;
		e.preventDefault();
		const to = moveFrom(ctx.model, from, e.key, e.ctrlKey || e.metaKey);
		if (!to) return;
		ctx.setActive(to.key);
		ref?.querySelector<HTMLElement>(`[data-slot="activity-graph-cell"][data-key="${to.key}"]`)?.focus();
	}

	function handleFocusin(e: FocusEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onfocusin?.(e);
		const c = cellOf(e.target);
		if (!c) return;
		ctx.setActive(c.key);
		ctx.select(c.key, (e.target as Element).getAttribute('aria-label'));
	}

	// A press between cells (the gap is 3px, the cells 12px): focus, and so select, the nearest one.
	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onclick?.(e);
		if (e.defaultPrevented || cellOf(e.target) || !ref) return;
		let best: HTMLElement | null = null;
		let bestD = Infinity;
		for (const el of ref.querySelectorAll<HTMLElement>('[data-slot="activity-graph-cell"]')) {
			const r = el.getBoundingClientRect();
			const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
			const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
			const d = dx * dx + dy * dy;
			if (d < bestD) [best, bestD] = [el, d];
		}
		best?.focus();
	}
</script>

<div
	bind:this={ref}
	role="grid"
	aria-readonly="true"
	aria-rowcount={ctx.model.rows.length}
	aria-colcount={ctx.model.cols}
	data-slot="activity-graph-grid"
	data-granularity={ctx.model.granularity}
	class={cn(
		'grid w-max grid-cols-[repeat(var(--ag-cols),var(--ag-cell))] auto-rows-(--ag-cell) gap-(--ag-gap)',
		className
	)}
	onkeydown={handleKeydown}
	onfocusin={handleFocusin}
	onclick={handleClick}
	{...restProps}
>
	{#each ctx.model.rows as row, r (r)}
		<div role="row" aria-rowindex={r + 1} class="contents">
			{#each row as slot, c (slot?.key ?? `-${c}`)}
				{#if slot}
					{@render renderCell({ cell: slot })}
				{:else}
					<div aria-hidden="true"></div>
				{/if}
			{/each}
		</div>
	{/each}
</div>
