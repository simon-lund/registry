<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getActivityGraph } from './context.js';
	import type { ActivityCell } from './model.js';

	type Props = WithElementRef<Omit<HTMLAttributes<HTMLDivElement>, 'children'>, HTMLDivElement> & {
		/**
		 * What the line says. Default: the selected cell's own words (its `aria-label`), nothing
		 * before a cell is selected. Render a hint for `cell: null` ("Tap a square") if wanted.
		 */
		children?: Snippet<[{ cell: ActivityCell | null; label: string | null }]>;
	};

	/**
	 * ActivityGraphCaption: the line under the grid that shows the selected cell's value, the path
	 * to a value where a tooltip never opens (touch). Placing it turns selection on: a tap on a cell
	 * (or in the gap beside one) and the roving focus select it, and the cell shows a 2px copper
	 * ring (`aria-selected`). The line keeps its height while empty, so nothing jumps. Not a live
	 * region: focus already speaks the cell. Place it after the viewport.
	 *
	 * @example
	 * <ActivityGraphCaption />
	 * <ActivityGraphCaption>
	 *   {#snippet children({ cell, label })}{cell ? label : 'Tap a square.'}{/snippet}
	 * </ActivityGraphCaption>
	 */
	let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();

	const ctx = getActivityGraph('ActivityGraphCaption');
	$effect(() => ctx.registerCaption());

	const cell = $derived(ctx.selectedKey ? (ctx.cell(ctx.selectedKey) ?? null) : null);
	const label = $derived(cell ? ctx.selectedLabel : null);
</script>

<div
	bind:this={ref}
	data-slot="activity-graph-caption"
	data-empty={cell ? undefined : ''}
	class={cn(
		'col-span-full min-h-4 text-xs text-muted-foreground tabular-nums',
		className
	)}
	{...restProps}
>
	{#if children}{@render children({ cell, label })}{:else}{label ?? ''}{/if}
</div>
