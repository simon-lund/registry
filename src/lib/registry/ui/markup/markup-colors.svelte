<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Toolbar as ToolbarPrimitive } from 'bits-ui';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { ColorPicker } from '#lib/registry/ui/color-picker/index.js';
	import { Popover, PopoverContent, PopoverTrigger } from '#lib/registry/ui/popover/index.js';
	import { cn } from '#lib/utils.js';
	import { getMarkup } from './context.svelte.js';
	import { TRIGGER, stopKeys } from './menu.js';

	/**
	 * MarkupColors: the colour marks are made in. The trigger shows it; its menu holds your
	 * ColorPickerSwatch, one per colour, and a click on one picks it and closes the menu (the arrow
	 * keys move and pick inside). The colours are the reviewer's ink, so they are yours to choose,
	 * like a terminal's colours. `aria-label` names it.
	 *
	 * @example
	 * <MarkupColors aria-label="Colour">
	 *   <ColorPickerSwatch value="#e5484d" aria-label="Red" />
	 * </MarkupColors>
	 */
	let {
		class: className,
		children,
		'aria-label': ariaLabel
	}: { class?: string; children?: Snippet; 'aria-label': string } = $props();

	const markup = getMarkup('MarkupColors');
</script>

<Popover
	bind:open={
		() => markup.menu === 'colours',
		(open) => (markup.menu = open ? 'colours' : markup.menu === 'colours' ? null : markup.menu)
	}
>
	<PopoverTrigger>
		{#snippet child({ props })}
			<ToolbarPrimitive.Button {...props} data-slot="markup-colors" aria-label={ariaLabel} class={cn(TRIGGER, className)}>
				<span
					aria-hidden="true"
					class="size-4 rounded-full shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_10%,transparent)]"
					style:background={markup.colour}
				></span>
				<ChevronDownIcon class="size-3" aria-hidden="true" />
			</ToolbarPrimitive.Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent side="top" sideOffset={10} escapeKeydownBehavior="ignore" class="w-auto p-2" onkeydown={stopKeys}>
		<!-- a click on a swatch is a choice made: the menu closes; the arrow keys only move -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			onclick={(e) => {
				if ((e.target as Element).closest('[data-slot="color-picker-swatch"]')) markup.menu = null;
			}}
		>
			<ColorPicker
				bind:value={() => markup.colour, (v) => (markup.colour = v)}
				aria-label={ariaLabel}
				class="grid grid-cols-5 gap-2"
			>
				{@render children?.()}
			</ColorPicker>
		</div>
	</PopoverContent>
</Popover>
