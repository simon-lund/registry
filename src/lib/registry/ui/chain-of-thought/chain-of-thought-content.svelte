<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '#lib/utils.js';

	/**
	 * ChainOfThoughtContent: the steps, an ordered list under the header, unfolding as a
	 * Collapsible does (grows to its measured height and fades in, base 220ms; folds quicker,
	 * 140ms). Give it its ChainOfThoughtStep children in order; while it streams, append them.
	 * Folded, it stays in the page as `hidden="until-found"`, so find-in-page reaches the steps and
	 * unfolds it. Reduced motion: a plain fade.
	 */
	let {
		ref = $bindable(null),
		class: className,
		hiddenUntilFound = true,
		children,
		...restProps
	}: WithoutChild<CollapsiblePrimitive.ContentProps> = $props();
</script>

<CollapsiblePrimitive.Content bind:ref {hiddenUntilFound} {...restProps}>
	{#snippet child({ props })}
		<div {...props} data-slot="chain-of-thought-content" class="cot-panel">
			<ol class={cn('flex flex-col pt-2', className)}>
				{@render children?.()}
			</ol>
		</div>
	{/snippet}
</CollapsiblePrimitive.Content>

<style>
	/* Clips while it moves, with 4px to spare so a focus ring inside is never cut. */
	.cot-panel {
		overflow: clip;
		overflow-clip-margin: 4px;
	}
	.cot-panel[data-state='open'] {
		animation: cot-unfold var(--dur-base) var(--ease-settle);
	}
	.cot-panel[data-state='closed'] {
		animation: cot-fold var(--dur-quick) var(--ease-settle);
	}
	@keyframes cot-unfold {
		from {
			height: 0;
			opacity: 0;
		}
		to {
			height: var(--bits-collapsible-content-height);
			opacity: 1;
		}
	}
	@keyframes cot-fold {
		from {
			height: var(--bits-collapsible-content-height);
			opacity: 1;
		}
		to {
			height: 0;
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cot-panel[data-state='open'] {
			animation-name: cot-fade-in;
		}
		.cot-panel[data-state='closed'] {
			animation-name: cot-fade-out;
		}
		@keyframes cot-fade-in {
			from {
				opacity: 0;
			}
		}
		@keyframes cot-fade-out {
			to {
				opacity: 0;
			}
		}
	}
</style>
