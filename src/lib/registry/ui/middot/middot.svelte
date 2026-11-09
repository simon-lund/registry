<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * Middot: the separator between two pieces of meta ("Tomorrow · 09:00").
	 *
	 * A drawn dot, not the "·" character: the typed version sits between two font spaces, which are
	 * often narrow, so the dot hugs the words. Here both sides get exactly the same space (0.4em), and
	 * in running text the dot sits on the middle of the lowercase letters (vertical-align: middle).
	 * Inside a flex row with a gap, pass `class="mx-0"` and let the gap space it.
	 *
	 * The element still carries " · " as visually hidden text, so screen readers and copy-paste keep
	 * the separation ("Tomorrow · 09:00", not "Tomorrow09:00").
	 *
	 * @example
	 * <p class="text-sm">Tomorrow<Middot />09:00</p>
	 */
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();
</script>

<span
	bind:this={ref}
	data-slot="middot"
	class={cn('mx-[0.4em] inline-block size-[0.2em] shrink-0 self-center rounded-full bg-current align-middle opacity-80', className)}
	{...restProps}
><span class="sr-only">{' · '}</span></span>
