<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getDial } from './context.js';

	/**
	 * DialKnob: the key in the middle of a Dial, with a copper pointer line that turns to the stop
	 * the value is on. Only the line's rotor turns. Under a pointer the rotor settles onto each stop
	 * in quick time (rotate only); keyboard steps and reduced motion turn it at once. While the dial
	 * is held the key gives a little. The dial's keyboard focus ring is drawn around the knob.
	 * Children render on the key's face, above the pointer's hub (rarely needed).
	 *
	 * @example
	 * <DialKnob />
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();

	getDial('DialKnob');
</script>

<span
	bind:this={ref}
	data-slot="dial-knob"
	aria-hidden="true"
	class={cn(
		'pointer-events-none absolute inset-[calc((100%-var(--dial-knob))/2)] rounded-full',
		'outline-2 outline-offset-2 outline-transparent group-focus-visible/dial:outline-ring',
		className
	)}
	{...restProps}
>
	<span
		data-slot="dial-knob-face"
		class={cn(
			'absolute inset-0 rounded-full bg-background ring-1 ring-border',
			'transition-[scale] duration-(--dur-quick) ease-(--ease-settle)',
			'group-data-dragging/dial:duration-(--dur-press) motion-safe:group-data-dragging/dial:scale-[0.97]'
		)}
	>
		<span
			data-slot="dial-knob-rotor"
			class={cn(
				'absolute inset-0 rotate-(--dial-angle)',
				'group-data-settle/dial:transition-[rotate] group-data-settle/dial:duration-(--dur-quick) group-data-settle/dial:ease-(--ease-settle) motion-reduce:transition-none!'
			)}
		>
			<span
				data-slot="dial-knob-pointer"
				class="absolute top-[9%] left-1/2 h-[24%] w-0.5 -translate-x-1/2 rounded-full bg-primary"
			></span>
		</span>
		{@render children?.()}
	</span>
</span>
