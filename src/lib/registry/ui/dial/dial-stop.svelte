<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const dialStopVariants = tv({
		base: [
			'absolute top-[calc(50%-var(--dial-mark-r))] left-1/2 -translate-x-1/2 rounded-full',
			'group-data-settle/dial:transition-colors group-data-settle/dial:duration-(--dur-quick) group-data-settle/dial:ease-(--ease-settle)',
			// the stop the value is on: its mark is copper, as wide as the knob's pointer
			'group-data-selected/stop:w-0.5 group-data-selected/stop:bg-primary'
		],
		variants: {
			variant: {
				/** An unlabelled stop between labelled ones: a short, quiet mark. */
				minor: 'h-(--dial-minor) w-px bg-input',
				/** A labelled stop: twice as long, and darker. */
				major: 'h-(--dial-major) w-[1.5px] bg-muted-foreground'
			}
		},
		defaultVariants: { variant: 'minor' }
	});

	export type DialStopVariant = VariantProps<typeof dialStopVariants>['variant'];
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { getDial, polar } from './context.js';

	/**
	 * DialStop: one stop of a Dial, a value it can land on: its mark at the stop's angle and, when
	 * given children, the consumer's label outside it, upright. Every mark on a dial is a stop, like
	 * the hours and minutes of a clock face: `variant` `major` (long) for the labelled stops, `minor`
	 * (default: short, quiet) for the unlabelled ones between them. The stop the value is on turns
	 * its mark copper and its label full ink at weight 600 (`data-selected`). `value` must be one of
	 * the dial's stops; render one DialStop per stop. Pointing at a label picks its stop, as anywhere
	 * on the dial. Hidden from assistive tech: the dial speaks its value. The colour follows the
	 * knob: fading with its settle, at once on a key press.
	 *
	 * @example
	 * {#each [1, 3, 7, 14, 30] as t, i (t)}
	 * 	<DialStop value={t} variant={i % 2 === 0 ? 'major' : 'minor'}>{#if i % 2 === 0}{t}{/if}</DialStop>
	 * {/each}
	 */
	let {
		ref = $bindable(null),
		value,
		variant = 'minor',
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		/** The stop this marks: one of the dial's values. */
		value: number;
		variant?: DialStopVariant;
	} = $props();

	const dial = getDial('DialStop');
	const i = $derived(dial.indexOf(value));
	const angle = $derived(dial.angleOf(i));
	const at = $derived(polar(angle));
	const selected = $derived(i !== -1 && i === dial.index);

	$effect(() => {
		if (i === -1) console.warn(`<DialStop value={${value}}>: not one of the dial's stops`);
	});
</script>

{#if i !== -1}
	<span
		bind:this={ref}
		data-slot="dial-stop"
		data-variant={variant}
		data-value={value}
		data-selected={selected ? '' : undefined}
		aria-hidden="true"
		class={cn('group/stop pointer-events-none absolute inset-0', className)}
		{...restProps}
	>
		<span class="absolute inset-0" style="rotate:{angle}deg">
			<span data-slot="dial-stop-mark" class={dialStopVariants({ variant })}></span>
		</span>
		{#if children}
			<span
				data-slot="dial-stop-label"
				class={cn(
					/* in the ring band: touch-none like the ring, so a gesture on a label turns the knob */
					'pointer-events-auto absolute -translate-1/2 touch-none text-xs font-medium whitespace-nowrap text-muted-foreground',
					'group-data-settle/dial:transition-colors group-data-settle/dial:duration-(--dur-quick) group-data-settle/dial:ease-(--ease-settle)',
					'group-data-selected/stop:font-semibold group-data-selected/stop:text-foreground'
				)}
				style="left:calc(50% + {at.x} * var(--dial-label-r));top:calc(50% + {at.y} * var(--dial-label-r))"
			>
				{@render children()}
			</span>
		{/if}
	</span>
{/if}
