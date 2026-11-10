<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Tooltip, TooltipContent, TooltipTrigger } from '#lib/registry/ui/tooltip/index.js';

	/**
	 * MarkupAction: a command in the bar (undo, redo, delete), a ghost icon Button; what it does is
	 * your `onclick`, and `disabled` while there is nothing to do. Put its icon inside; `aria-label`
	 * names it and shows as its tooltip.
	 *
	 * @example
	 * <MarkupAction aria-label="Undo" disabled={!history.canUndo} onclick={history.undo}><Undo2Icon /></MarkupAction>
	 */
	let {
		variant = 'ghost',
		size = 'icon-sm',
		'aria-label': ariaLabel,
		...restProps
	}: ComponentProps<typeof Button> & { 'aria-label': string } = $props();
</script>

<Tooltip>
	<TooltipTrigger>
		{#snippet child({ props })}
			<Button {...props} data-slot="markup-action" {variant} {size} aria-label={ariaLabel} class="text-muted-foreground hover:text-foreground" {...restProps} />
		{/snippet}
	</TooltipTrigger>
	<TooltipContent side="top" sideOffset={8}>{ariaLabel}</TooltipContent>
</Tooltip>
