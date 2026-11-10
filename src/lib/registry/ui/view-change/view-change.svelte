<script lang="ts">
	import { untrack } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import type { ViewSide } from './view-change.js';

	/**
	 * ViewChange: a view arriving from the side its entry sits on. Wrap what changes with its
	 * `key` (a route, a section): when the key changes the content is re-created and comes in
	 * 8px from `from` while it fades in and sharpens from the swap blur (base 220ms on settle), so
	 * the eye reads where it came from: the next section from the right, an earlier one from the
	 * left, a page from the sidebar's side. The old content is gone at once; nothing overlaps,
	 * nothing shifts, and the blur hides the frame where old and new would read as a flicker.
	 * Without `from` the content is simply replaced: the first render, and a keyboard shortcut,
	 * which is never animated. Reduced motion: a fade.
	 *
	 * `from` is read when the key changes, not before: set it as the navigation starts (SvelteKit's
	 * `beforeNavigate`, `sideOf` over the sections' order) and the content that is still showing
	 * stays put.
	 *
	 * @example
	 * <ViewChange key={page.url.pathname} from={side}>{@render children()}</ViewChange>
	 */
	let {
		ref = $bindable(null),
		key,
		from,
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		/** What is shown; a change re-creates the content. */
		key: unknown;
		/** The side the new content comes from; none: no motion. */
		from?: ViewSide;
	} = $props();

	// The side is captured with the key, so a `from` set early never touches the content on show.
	const shown = $derived.by(() => ({ key, from: untrack(() => from) }));
</script>

{#key shown.key}
	<div
		bind:this={ref}
		data-slot="view-change"
		data-from={shown.from}
		class={cn('view min-w-0', className)}
		{...restProps}
	>
		{@render children?.()}
	</div>
{/key}

<style>
	/* The theme's base duration on settle: quick off the mark, a long calm landing. */
	.view[data-from] {
		animation: view-enter var(--dur-base, 220ms) var(--ease-settle, cubic-bezier(0.22, 1, 0.36, 1))
			both;
	}
	.view[data-from='left'] {
		--view-shift: -8px;
	}
	.view[data-from='right'] {
		--view-shift: 8px;
	}
	@keyframes view-enter {
		from {
			opacity: 0;
			translate: var(--view-shift, 0) 0;
			filter: blur(var(--view-blur, var(--blur-swap, 4px)));
		}
	}
	/* Reduced motion: the fade stays (the token shortens it), the travel and the blur go. */
	@media (prefers-reduced-motion: reduce) {
		.view[data-from] {
			--view-shift: 0px;
			--view-blur: 0px;
		}
	}
</style>
