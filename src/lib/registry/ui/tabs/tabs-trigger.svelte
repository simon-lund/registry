<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	/*
	 * The label's box, shared by the real trigger and its copy in the key: identical boxes are
	 * what make the copy's text land exactly on the original.
	 */
	const LABEL =
		"inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-medium [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

	/**
	 * An unselected segment is just its quiet label on the track. The selected look (the key)
	 * belongs to TabsList, so nothing here changes on selection and nothing can fall out of step.
	 */
	export const tabsTriggerVariants = tv({
		base: [
			LABEL,
			'text-muted-foreground not-data-disabled:hover:text-foreground',
			/* Shares the width, never shrinks below its label (the track scrolls instead). */
			'relative min-w-max flex-1 shrink-0 cursor-pointer select-none',
			'transition-colors duration-(--dur-quick) ease-(--ease-settle)',
			/* Drawn 36px; the ::before stretches the hit area to 44px into the track's padding. */
			'before:absolute before:inset-x-0 before:-inset-y-1',
			/*
			 * Focus is drawn by ::after above the key (the key is a layer over the triggers, so a
			 * plain outline would sit under it) and above the scroll hints (z 3). The track clips its
			 * overflow at its padding (one spacing step), so the 2px ring sits 2px out, never clipped.
			 */
			'focus-visible:outline-none after:pointer-events-none after:absolute after:inset-0 after:z-[4] after:rounded-full focus-visible:after:outline-2 focus-visible:after:outline-offset-[calc(var(--spacing)-2px)] focus-visible:after:outline-ring',
			/* A disabled segment dims itself; in a disabled list the list dims once, as a whole. */
			'data-disabled:cursor-not-allowed [:not([data-disabled])>&]:data-disabled:opacity-45'
		]
	});
</script>

<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import { getTabsList, getTabsRoot, isTabsCopy } from './context.js';

	/**
	 * TabsTrigger: one segment. Put the label inside, optionally a TabsCount after it or an icon
	 * beside it.
	 *
	 * The selected look is not styled here: TabsList draws the key over the selected trigger.
	 * Disabled segments stay readable at 45% and are skipped by the arrow keys. In a
	 * `<Tabs mode="radio">` it is a radio (aria-checked) instead of a tab.
	 *
	 * @example
	 * <TabsTrigger value="open">Open <TabsCount>6</TabsCount></TabsTrigger>
	 * <TabsTrigger value="today">Today <ChevronDownIcon aria-hidden="true" /></TabsTrigger>
	 */
	let {
		ref = $bindable(null),
		value,
		class: className,
		children,
		...restProps
	}: TabsPrimitive.TriggerProps = $props();

	const root = getTabsRoot('TabsTrigger');
	const list = getTabsList('TabsTrigger');
	// Rendered a second time inside the key: same label, no behaviour, no ids.
	const copy = isTabsCopy();
	const rect = $derived(copy ? list.rects[value] : undefined);

	// Radio mode: bits-ui's tab attributes without the tab-only ones (a radio has no panel).
	function radioProps(props: Record<string, unknown>) {
		const { 'aria-selected': _selected, 'aria-controls': _controls, ...rest } = props;
		return rest;
	}

	$effect(() => {
		if (copy || !ref) return;
		return list.register(value, ref);
	});
</script>

{#if copy}
	{#if rect}
		<span
			data-slot="tabs-trigger-copy"
			class={cn(LABEL, 'text-foreground absolute', className)}
			style="left:{rect.x}px;top:{rect.y}px;width:{rect.w}px;height:{rect.h}px"
		>
			{@render children?.()}
		</span>
	{/if}
{:else}
	<TabsPrimitive.Trigger
		bind:ref
		{value}
		data-slot="tabs-trigger"
		class={cn(tabsTriggerVariants(), className)}
		{...restProps}
	>
		{#snippet child({ props })}
			{#if root.mode === 'radio'}
				<!-- Radio mode: a radio that is checked while selected; no tab semantics, no panel. -->
				<button {...radioProps(props)} role="radio" aria-checked={root.value === value}>
					{@render children?.()}
				</button>
			{:else}
				<button {...props}>{@render children?.()}</button>
			{/if}
		{/snippet}
	</TabsPrimitive.Trigger>
{/if}
