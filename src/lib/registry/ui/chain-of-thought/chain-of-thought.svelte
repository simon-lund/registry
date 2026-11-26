<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	/**
	 * ChainOfThought: what the assistant did on the way to its answer, folded under one quiet line
	 * (after Vercel's AI Elements Chain of Thought). A Collapsible on bits-ui: ChainOfThoughtHeader
	 * (your icon and words, and a caret that turns), ChainOfThoughtContent (the steps), and
	 * ChainOfThoughtStep per step: ChainOfThoughtStepIcon, -Label, -Description and
	 * ChainOfThoughtStepContent hanging off the rail (ChainOfThoughtSearchResults of
	 * ChainOfThoughtSearchResult links, a ChainOfThoughtImage, a paragraph).
	 *
	 * Steps are `done`, `active` (the glyph is copper and breathes) or `pending`; new ones fade
	 * and slide in as they stream. `open` is bindable; closed by default, as the answer matters
	 * more. No copy inside, no AI SDK: plain steps in.
	 *
	 * @example
	 * <ChainOfThought bind:open>
	 *   <ChainOfThoughtHeader><BrainIcon />Thought process</ChainOfThoughtHeader>
	 *   <ChainOfThoughtContent>
	 *     <ChainOfThoughtStep>
	 *       <ChainOfThoughtStepIcon><SearchIcon /></ChainOfThoughtStepIcon>
	 *       <ChainOfThoughtStepLabel>Searching today's events</ChainOfThoughtStepLabel>
	 *     </ChainOfThoughtStep>
	 *   </ChainOfThoughtContent>
	 * </ChainOfThought>
	 */
	let {
		ref = $bindable(null),
		open = $bindable(false),
		class: className,
		...restProps
	}: CollapsiblePrimitive.RootProps = $props();
</script>

<CollapsiblePrimitive.Root
	bind:ref
	bind:open
	data-slot="chain-of-thought"
	class={cn('flex w-full min-w-0 flex-col', className)}
	{...restProps}
/>
