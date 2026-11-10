<script lang="ts">
	import type { Snippet } from 'svelte';
	import { RadioGroup as RadioGroupPrimitive, Toolbar as ToolbarPrimitive } from 'bits-ui';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { Popover, PopoverContent, PopoverTrigger } from '#lib/registry/ui/popover/index.js';
	import { cn } from '#lib/utils.js';
	import { getMarkup, type MarkupShape } from './context.svelte.js';
	import { TRIGGER, stopKeys } from './menu.js';
	import Tool from './markup-tool.svelte';

	/**
	 * MarkupShapes: the shape tool and its kinds. The button takes the shape tool up, drawn with the
	 * kind in hand (`icon` draws it); the chevron beside it opens the kinds, a MarkupShape each: a
	 * click picks one, takes the tool up and closes the menu, the arrow keys move and pick. Put it
	 * inside MarkupTools. `aria-label` names the tool, `kindsLabel` the menu.
	 *
	 * @example
	 * <MarkupShapes aria-label="Shape" kindsLabel="Shapes">
	 *   {#snippet icon({ shape })}{#if shape === 'ellipse'}<CircleIcon />{:else}<SquareIcon />{/if}{/snippet}
	 *   <MarkupShape value="rectangle"><SquareIcon /> Rectangle</MarkupShape>
	 *   <MarkupShape value="ellipse"><CircleIcon /> Ellipse</MarkupShape>
	 * </MarkupShapes>
	 */
	let {
		class: className,
		icon,
		children,
		'aria-label': ariaLabel,
		kindsLabel
	}: {
		class?: string;
		/** Draws the kind in hand on the tool's button. */
		icon: Snippet<[{ shape: MarkupShape }]>;
		/** The MarkupShape items. */
		children?: Snippet;
		/** Names the tool, and shows as its tooltip. */
		'aria-label': string;
		/** Names the menu of kinds and its chevron. */
		kindsLabel: string;
	} = $props();

	const markup = getMarkup('MarkupShapes');

	function pick(shape: MarkupShape) {
		markup.shape = shape;
		markup.tool = 'shape';
	}
</script>

<div data-slot="markup-shapes" class={cn('flex shrink-0 items-center', className)}>
	<Tool value="shape" aria-label={ariaLabel}>{@render icon({ shape: markup.shape })}</Tool>
	<Popover
		bind:open={
			() => markup.menu === 'shapes',
			(open) => (markup.menu = open ? 'shapes' : markup.menu === 'shapes' ? null : markup.menu)
		}
	>
		<PopoverTrigger>
			{#snippet child({ props })}
				<ToolbarPrimitive.Button {...props} data-slot="markup-shapes-trigger" aria-label={kindsLabel} class={cn(TRIGGER, 'w-5 justify-center px-0')}>
					<ChevronDownIcon class="size-3" aria-hidden="true" />
				</ToolbarPrimitive.Button>
			{/snippet}
		</PopoverTrigger>
		<PopoverContent side="top" sideOffset={10} escapeKeydownBehavior="ignore" class="w-auto min-w-40 p-1" onkeydown={stopKeys}>
			<RadioGroupPrimitive.Root
				value={markup.shape}
				onValueChange={(v) => pick(v as MarkupShape)}
				aria-label={kindsLabel}
				loop
				class="flex flex-col gap-0.5"
				onclick={(e: MouseEvent) => {
					// a click is a choice made, the kind in hand too: the tool is taken up, the menu closes
					const item = (e.target as Element).closest<HTMLElement>('[data-slot="markup-shape"]');
					if (!item?.dataset.value) return;
					pick(item.dataset.value as MarkupShape);
					markup.menu = null;
				}}
			>
				{@render children?.()}
			</RadioGroupPrimitive.Root>
		</PopoverContent>
	</Popover>
</div>
