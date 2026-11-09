<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Tooltip, TooltipTrigger, TooltipContent } from '#lib/registry/ui/tooltip/index.js';
	import { cn } from '#lib/utils.js';
	import { getScrollMap } from './context.svelte.js';

	/**
	 * ScrollMapTick: one section of the scroll as a short 2px line hanging from the map's side:
	 * `size` default (16px: the longer turns) or `sm` (10px: the short ones). In view it is full
	 * foreground (status, not a choice, so it stays tonal), otherwise a light stone; hover darkens
	 * it. Hover or focus shows a Tooltip with its children (ScrollMapTickTitle,
	 * ScrollMapTickDescription); a press or Enter jumps to its section. `dot` marks a section that
	 * carries attachments with a 4px dot beside the line.
	 *
	 * `value` is the `id` of its section. Requires an `aria-label` (the section's title), as the
	 * tooltip is not always there.
	 *
	 * @example
	 * <ScrollMapTick value="t3" size="sm" dot aria-label="Plan the Saturday">
	 *   <ScrollMapTickTitle>Plan the Saturday</ScrollMapTickTitle>
	 *   <ScrollMapTickDescription>You, 07:58, one photo</ScrollMapTickDescription>
	 * </ScrollMapTick>
	 */
	let {
		ref = $bindable(null),
		class: className,
		value,
		size = 'default',
		dot = false,
		onclick,
		onfocus,
		children,
		...restProps
	}: HTMLButtonAttributes & {
		ref?: HTMLButtonElement | null;
		/** The section it stands for. */
		value: string;
		/** `default` 16px, `sm` 10px. */
		size?: 'default' | 'sm';
		/** The section carries attachments. */
		dot?: boolean;
		'aria-label': string;
	} = $props();

	const map = getScrollMap('ScrollMapTick');
	let button = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		if (!button) return;
		return map.register({ value: () => value, button });
	});

	const index = $derived(map.ticks.findIndex((t) => t.button === button));
	const inView = $derived(map.visible.has(value));
</script>

<Tooltip>
	<!-- The handlers go on the trigger, which merges them with its own: set on the button below they
	     would replace the ones that open and close the tooltip. -->
	<TooltipTrigger
		bind:ref={
			() => ref,
			(el) => {
				ref = el as HTMLButtonElement | null;
				button = el as HTMLButtonElement | null;
			}
		}
		onclick={(e) => {
			onclick?.(e);
			if (!e.defaultPrevented) map.jump(value);
		}}
		onfocus={(e) => {
			onfocus?.(e);
			if (index >= 0) map.focusIndex = index;
		}}
	>
		{#snippet child({ props })}
			<button
				{...props}
				{...restProps}
				type="button"
				data-slot="scroll-map-tick"
				data-size={size}
				data-dot={dot || undefined}
				data-in-view={inView || undefined}
				aria-current={inView ? 'location' : undefined}
				tabindex={index === map.tabIndex ? 0 : -1}
				class={cn(
					'group/scroll-map-tick relative z-10 flex h-2.5 w-full shrink-0 cursor-pointer items-center gap-1 px-1.5',
					'group-data-[side=right]/scroll-map:flex-row-reverse',
					"after:absolute after:inset-x-0 after:-inset-y-px after:content-['']",
					'outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
					className
				)}
			>
				<span
					aria-hidden="true"
					class={cn(
						'block h-0.5 shrink-0 rounded-full bg-input transition-[background-color,scale] duration-(--dur-quick) ease-(--ease-settle)',
						'w-4 group-data-[size=sm]/scroll-map-tick:w-2.5',
						'group-data-in-view/scroll-map-tick:bg-foreground group-hover/scroll-map-tick:bg-muted-foreground group-data-in-view/scroll-map-tick:group-hover/scroll-map-tick:bg-foreground',
						'group-data-[side=right]/scroll-map:origin-right group-data-[side=left]/scroll-map:origin-left motion-safe:group-hover/scroll-map-tick:scale-x-125'
					)}
				></span>
				{#if dot}
					<span aria-hidden="true" data-slot="scroll-map-tick-dot" class="size-1 shrink-0 rounded-full bg-muted-foreground group-data-in-view/scroll-map-tick:bg-foreground"></span>
				{/if}
			</button>
		{/snippet}
	</TooltipTrigger>
	<TooltipContent
		side={map.side === 'right' ? 'left' : 'right'}
		sideOffset={8}
		class="flex max-w-64 flex-col items-start gap-0.5 px-2.5 py-1.5 whitespace-normal"
	>
		{@render children?.()}
	</TooltipContent>
</Tooltip>
