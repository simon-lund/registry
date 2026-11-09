<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import { getTabsRoot } from './context.js';

	/**
	 * TabsContent: the panel for one value, hidden while its tab is not selected. When the
	 * selection moves, the new panel follows the key: it comes in 8px from the side the key went
	 * to while it fades in (base 220ms on settle, the motion of ViewChange), so the panels read as
	 * a row behind the segments. A step by arrow key, Home or End switches at once, like the
	 * key jumps; the first paint shows its panel without motion. Reduced motion: a fade.
	 *
	 * @example
	 * <TabsContent value="open">…</TabsContent>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: TabsPrimitive.ContentProps = $props();

	const root = getTabsRoot('TabsContent');
</script>

<TabsPrimitive.Content
	bind:ref
	data-slot="tabs-content"
	data-from={root.from}
	class={cn(
		'panel focus-visible:outline-ring min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2',
		className
	)}
	{...restProps}
>
	<!-- Rendered here (not by bits-ui), so the panel's own styles below reach it. -->
	{#snippet child({ props })}
		<div {...props}>{@render children?.()}</div>
	{/snippet}
</TabsPrimitive.Content>

<style>
	/*
	 * The panel enters when it stops being hidden; an animation starts with it. Same motion as
	 * ViewChange: the base duration on settle, 8px of travel.
	 */
	.panel[data-from] {
		animation: tabs-panel-enter var(--dur-base, 220ms)
			var(--ease-settle, cubic-bezier(0.22, 1, 0.36, 1)) both;
	}
	.panel[data-from='left'] {
		--view-shift: -8px;
	}
	.panel[data-from='right'] {
		--view-shift: 8px;
	}
	@keyframes tabs-panel-enter {
		from {
			opacity: 0;
			translate: var(--view-shift, 0) 0;
		}
	}
	/* Reduced motion: the fade stays (the token shortens it), the travel goes. */
	@media (prefers-reduced-motion: reduce) {
		.panel[data-from] {
			--view-shift: 0px;
		}
	}
</style>
