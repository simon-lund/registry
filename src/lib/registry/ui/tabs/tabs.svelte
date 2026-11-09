<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import { setTabsRoot, type TabsMode } from './context.js';
	import type { ViewSide } from '#lib/registry/ui/view-change/index.js';

	/**
	 * Tabs: the root of a segmented control (bits-ui Tabs). Holds the selected value and
	 * stacks the list above its panels.
	 *
	 * Arrow keys move between segments (and select them: activation is automatic), Home/End
	 * jump to the ends, focus loops. Bind `value` or pass a starting one.
	 *
	 * `mode="radio"` makes the same control a single choice without panels (a setting such as
	 * the appearance): radiogroup / radio with aria-checked instead of tablist / tab. Look,
	 * motion and keys are identical; use no TabsContent with it.
	 *
	 * A panel follows the key: TabsContent comes in 8px from the side the selection moved to (the
	 * next segment's panel from the right), fading in on base 220ms; a step by arrow key, Home or
	 * End switches at once, like the key jumps.
	 *
	 * @example
	 * <Tabs value="open">
	 *   <TabsList aria-label="Tasks">
	 *     <TabsTrigger value="open">Open <TabsCount>6</TabsCount></TabsTrigger>
	 *     <TabsTrigger value="done">Done</TabsTrigger>
	 *   </TabsList>
	 *   <TabsContent value="open">…</TabsContent>
	 *   <TabsContent value="done">…</TabsContent>
	 * </Tabs>
	 *
	 * <Tabs mode="radio" bind:value={appearance}>
	 *   <TabsList aria-label="Appearance">
	 *     <TabsTrigger value="system">System</TabsTrigger> …
	 *   </TabsList>
	 * </Tabs>
	 */
	let {
		ref = $bindable(null),
		value = $bindable(''),
		mode = 'tabs',
		class: className,
		...restProps
	}: TabsPrimitive.RootProps & {
		/** `tabs` (default): tablist / tab. `radio`: a single choice, radiogroup / radio. */
		mode?: TabsMode;
	} = $props();

	// Where the last selection went, from the list's measured boxes (undefined: no motion).
	let from = $state<ViewSide | undefined>();

	// The list moves its key from this value; bits-ui keeps its own copy in sync through the binding.
	setTabsRoot({
		get value() {
			return value;
		},
		get mode() {
			return mode;
		},
		get from() {
			return from;
		},
		moved: (side) => (from = side)
	});
</script>

<TabsPrimitive.Root
	bind:ref
	bind:value
	data-slot="tabs"
	data-mode={mode}
	class={cn('flex flex-col gap-4', className)}
	{...restProps}
/>
