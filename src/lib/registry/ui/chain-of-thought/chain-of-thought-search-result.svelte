<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * ChainOfThoughtSearchResult: one source, a flat pill on the muted surface that opens it with
	 * one tap (a link, `href`): its name ("Calendar", "github.com"), a 16px glyph or favicon first if
	 * you have one. Hover deepens it a step, pressing dips it to 97%; 44px to touch.
	 *
	 * @example
	 * <ChainOfThoughtSearchResult href="/calendar"><CalendarIcon />Calendar</ChainOfThoughtSearchResult>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAnchorAttributes & { ref?: HTMLAnchorElement | null } = $props();
</script>

<li class="flex">
	<a
		bind:this={ref}
		data-slot="chain-of-thought-search-result"
		class={cn(
			'relative inline-flex h-8 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-medium text-foreground',
			'transition-[scale,background-color] duration-(--dur-quick) ease-(--ease-settle) active:duration-(--dur-press)',
			'hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_8%)] motion-safe:active:scale-[0.97]',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
			"before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
			"[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_img]:size-4 [&_img]:rounded-xs",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</a>
</li>
