<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	/**
	 * SwapItem: one of the things a `Swap` holds. The inactive ones are hidden from sight and from
	 * screen readers; the active one is read.
	 *
	 * Motion (Emil Kowalski's icon swap): both at once, base 220ms on settle (a strong ease-out). The
	 * outgoing item blurs (`--blur-swap`, 4px) and fades while the incoming one comes out of the
	 * same blur: one thing turning into the other. An icon also shrinks to 25% on its way out and
	 * grows from 25% on its way in; words only blur and fade (shrunk words read as a glitch).
	 * Reduced motion: a plain cross-fade.
	 */
	let {
		ref = $bindable(null),
		class: className,
		active = false,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & {
		ref?: HTMLSpanElement | null;
		/** The item currently shown. */
		active?: boolean;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="swap-item"
	data-state={active ? 'active' : 'inactive'}
	aria-hidden={active ? undefined : 'true'}
	class={cn(
		'inline-flex items-center justify-center transition-[opacity,scale,filter] duration-(--dur-base) ease-(--ease-settle)',
		'data-[state=inactive]:pointer-events-none data-[state=inactive]:opacity-0',
		'motion-safe:data-[state=inactive]:blur-(--blur-swap) motion-safe:data-[state=inactive]:has-[>svg]:scale-25',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
