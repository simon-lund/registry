<script lang="ts">
	import type { Snippet } from 'svelte';
	import { RadioGroup as RadioGroupPrimitive, Toolbar as ToolbarPrimitive } from 'bits-ui';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { Popover, PopoverContent, PopoverTrigger } from '#lib/registry/ui/popover/index.js';
	import { cn } from '#lib/utils.js';
	import { getMarkup } from './context.svelte.js';
	import { TRIGGER, stopKeys } from './menu.js';

	/**
	 * MarkupWidths: the width marks are made in. The trigger shows it as a line; its menu holds a
	 * MarkupWidth per width, a radio group: a click picks and closes, the arrow keys move and pick.
	 * `aria-label` names it.
	 *
	 * @example
	 * <MarkupWidths aria-label="Width">
	 *   <MarkupWidth value={2} aria-label="Thin" />
	 *   <MarkupWidth value={4} aria-label="Medium" />
	 * </MarkupWidths>
	 */
	let {
		class: className,
		children,
		'aria-label': ariaLabel
	}: { class?: string; children?: Snippet; 'aria-label': string } = $props();

	const markup = getMarkup('MarkupWidths');
</script>

<Popover
	bind:open={
		() => markup.menu === 'widths',
		(open) => (markup.menu = open ? 'widths' : markup.menu === 'widths' ? null : markup.menu)
	}
>
	<PopoverTrigger>
		{#snippet child({ props })}
			<ToolbarPrimitive.Button {...props} data-slot="markup-widths" aria-label={ariaLabel} class={cn(TRIGGER, className)}>
				<svg viewBox="0 0 16 16" class="size-4" aria-hidden="true">
					<path d="M2 8h12" stroke="currentColor" stroke-width={Math.min(markup.width, 6)} stroke-linecap="round" />
				</svg>
				<ChevronDownIcon class="size-3" aria-hidden="true" />
			</ToolbarPrimitive.Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent side="top" sideOffset={10} escapeKeydownBehavior="ignore" class="w-auto p-1" onkeydown={stopKeys}>
		<RadioGroupPrimitive.Root
			value={String(markup.width)}
			onValueChange={(v) => (markup.width = Number(v))}
			aria-label={ariaLabel}
			loop
			class="flex flex-col gap-0.5"
			onclick={(e: MouseEvent) => {
				// a click is a choice made: the menu closes; the arrow keys only move
				if ((e.target as Element).closest('[data-slot="markup-width"]')) markup.menu = null;
			}}
		>
			{@render children?.()}
		</RadioGroupPrimitive.Root>
	</PopoverContent>
</Popover>
