<script lang="ts">
	import { Toolbar as ToolbarPrimitive } from 'bits-ui';
	import { Tooltip, TooltipContent, TooltipTrigger } from '#lib/registry/ui/tooltip/index.js';
	import { cn } from '#lib/utils.js';
	import { getMarkup, type MarkupTool } from './context.svelte.js';

	/**
	 * MarkupTool: one tool, a toggle. Pressing it takes the tool up; pressing it again, or Escape,
	 * puts it down. The tool in hand is the copper key. Put its icon inside; `aria-label` names it
	 * and shows as its tooltip.
	 *
	 * @example
	 * <MarkupTool value="pen" aria-label="Pen"><PenIcon /></MarkupTool>
	 */
	let {
		ref = $bindable(null),
		value,
		class: className,
		children,
		'aria-label': ariaLabel,
		...restProps
	}: Omit<ToolbarPrimitive.ButtonProps, 'value'> & {
		value: MarkupTool;
		'aria-label': string;
	} = $props();

	const markup = getMarkup('MarkupTool');
	const pressed = $derived(markup.tool === value);
</script>

<Tooltip>
	<TooltipTrigger>
		{#snippet child({ props })}
			<ToolbarPrimitive.Button
				bind:ref
				{...props}
				data-slot="markup-tool"
				data-value={value}
				aria-pressed={pressed}
				aria-label={ariaLabel}
				class={cn(
					'text-muted-foreground hover:text-foreground hover:bg-foreground/6 focus-visible:ring-ring grid size-8 shrink-0 cursor-pointer place-items-center rounded-md outline-none focus-visible:ring-2',
					'aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary aria-pressed:hover:text-primary-foreground',
					"transition-colors duration-(--dur-quick) ease-(--ease-settle) [&_svg:not([class*='size-'])]:size-4",
					className
				)}
				onclick={() => markup.toggle(value)}
				{...restProps}
			>
				{@render children?.()}
			</ToolbarPrimitive.Button>
		{/snippet}
	</TooltipTrigger>
	<TooltipContent side="top" sideOffset={8}>{ariaLabel}</TooltipContent>
</Tooltip>
