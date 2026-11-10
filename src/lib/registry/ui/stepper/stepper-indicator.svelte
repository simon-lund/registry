<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import { Swap, SwapItem } from '#lib/registry/ui/swap/index.js';
	import { Spinner } from '#lib/registry/ui/spinner/index.js';
	import { cn } from '#lib/utils.js';
	import {
		getStepperItem,
		getStepperList,
		getStepperRoot,
		sweepStyle,
		type StepperGlyph
	} from './context.js';

	/**
	 * StepperIndicator: the step's circle (32px). Its look follows the step, one of three:
	 *   pending  a flat ring, the number in muted-foreground;
	 *   active   the copper disc with the number on it: the one step that stands out;
	 *   done     a tonal disc with a check in foreground: it grows from the centre.
	 * An `invalid` step overrides the look: a red ring with a red X, whatever else it is.
	 * What it shows, one of four, first match: a spinner while the step is `loading`, an X while it
	 * is `invalid`, a check once it is done, otherwise its number, or the children in place of the
	 * number (an icon). The change is Swap's blurred cross-fade (base 220ms).
	 *
	 * In the inline lists (`bars`, `dots`) it is drawn as a short bar or a dot instead, filled from
	 * the start up to the current step, the current one copper: they show where you are, so going
	 * back empties the ones after it. A jump across several steps fills or empties them in order,
	 * from the step left, as one line. All of it is decoration
	 * (`aria-hidden`): the title names the step, the list's order counts it.
	 *
	 * @example
	 * <StepperIndicator />
	 * <StepperIndicator><MailIcon /></StepperIndicator>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();

	const root = getStepperRoot('StepperIndicator');
	const item = getStepperItem('StepperIndicator');
	const list = getStepperList();

	const glyph: StepperGlyph = $derived(
		item.loading ? 'spinner' : item.invalid ? 'invalid' : item.done ? 'check' : 'content'
	);
	// Inline marks fill up to and including the current step, done or not.
	const filled = $derived(item.value <= root.value);
	// A mark's colour belongs to its fill: one that empties keeps the colour it had until it is
	// gone, one that fills starts in its final colour, and only one that stays filled while it
	// changes role (the current step moving on or back to it) cross-fades.
	const wasFilled = $derived(item.value <= root.from);
	const tone = $derived(
		(filled ? item.value === root.value : item.value === root.from) ? 'current' : 'tonal'
	);
</script>

{#if list.variant === 'default'}
	<span
		bind:this={ref}
		data-slot="stepper-indicator"
		data-state={item.state}
		data-glyph={glyph}
		data-invalid={item.invalid || undefined}
		aria-hidden="true"
		class={cn(
			'indicator relative grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums',
			"[&_svg:not([class*='size-'])]:size-4.5",
			className
		)}
		{...restProps}
	>
		<span class="fill"></span>
		<Swap class="relative">
			<SwapItem active={glyph === 'content'}>
				{#if children}{@render children()}{:else}{item.value}{/if}
			</SwapItem>
			<SwapItem active={glyph === 'check'}><CheckIcon class="size-4" strokeWidth={2.5} /></SwapItem>
			<SwapItem active={glyph === 'invalid'}><XIcon class="size-4" strokeWidth={2.5} /></SwapItem>
			<SwapItem active={glyph === 'spinner'}><Spinner aria-hidden="true" class="size-4" /></SwapItem>
		</Swap>
	</span>
{:else}
	<span
		bind:this={ref}
		data-slot="stepper-indicator"
		data-state={item.state}
		data-variant={list.variant}
		data-filled={filled || undefined}
		data-tone={tone}
		data-recolor={(filled && wasFilled) || undefined}
		style={sweepStyle(root.sweep(item.value - 1))}
		aria-hidden="true"
		class={cn('mark relative block shrink-0 overflow-hidden rounded-full bg-border', className)}
		{...restProps}
	>
		<span class="mark-fill"></span>
	</span>
{/if}

<style>
	/*
	 * Three looks, mutually exclusive (data-state): pending · active · done. The ring is a
	 * box-shadow; the done disc is its own layer revealed by a clip-path from the centre, so the
	 * look changes with transform-like properties only.
	 */
	.indicator {
		color: var(--muted-foreground);
		background: transparent;
		box-shadow: inset 0 0 0 1.5px var(--input);
		transition:
			box-shadow var(--dur-quick) var(--ease-settle),
			background-color var(--dur-quick) var(--ease-settle),
			color var(--dur-quick) var(--ease-settle),
			scale var(--dur-quick) var(--ease-settle);
	}
	/* A reachable step under the pointer: the ring darkens a step. */
	@media (hover: hover) {
		:global(button[data-slot='stepper-trigger']:hover) > .indicator[data-state='pending'] {
			box-shadow: inset 0 0 0 1.5px var(--muted-foreground);
		}
	}
	/* active: copper, flat. */
	.indicator[data-state='active'] {
		color: var(--primary-foreground);
		background: var(--primary);
		box-shadow: none;
	}
	/* done: no ring of its own; the tonal disc covers the face, the check in foreground. */
	.indicator[data-state='done'] {
		color: var(--foreground);
		box-shadow: inset 0 0 0 1.5px transparent;
	}

	/* Mixed with transparent, so the disc reads on any surface. */
	.fill {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: color-mix(in oklab, var(--foreground) 12%, transparent);
		clip-path: circle(0px at 50% 50%);
		transition: clip-path var(--dur-quick) var(--ease-exit);
	}
	.indicator[data-state='done'] .fill {
		/* Half the face + 2px: the whole disc, with room for antialiasing. */
		clip-path: circle(calc(50% + 2px) at 50% 50%);
		transition: clip-path var(--dur-base) var(--ease-settle);
	}

	/* Pressing a reachable step dips its circle to 94% (in at press 80ms). */
	@media (prefers-reduced-motion: no-preference) {
		:global(button[data-slot='stepper-trigger']:active) > .indicator {
			scale: 0.94;
			transition-duration: var(--dur-press);
		}
	}

	/* invalid, over any look: the ring and the X in destructive, no disc. After the looks, so it wins. */
	.indicator[data-invalid] {
		color: var(--destructive);
		background: transparent;
		box-shadow: inset 0 0 0 1.5px var(--destructive);
	}
	.indicator[data-invalid] .fill {
		clip-path: circle(0px at 50% 50%);
		transition: clip-path var(--dur-quick) var(--ease-exit);
	}

	/* Reduced motion: the disc cross-fades instead of growing. */
	@media (prefers-reduced-motion: reduce) {
		.fill,
		.indicator[data-state='done'] .fill {
			clip-path: none;
			opacity: 0;
			transition: opacity var(--dur-quick) var(--ease-settle);
		}
		.indicator[data-state='done'] .fill {
			opacity: 1;
		}
		.indicator[data-invalid] .fill {
			opacity: 0;
		}
	}

	/*
	 * The inline marks. bars: 24 × 6, filled from the start (scale-x from the inline start);
	 * dots: 8px, the fill fades and grows in, the current dot a quarter larger.
	 */
	.mark[data-variant='bars'] {
		width: calc(var(--spacing, 4px) * 6);
		height: calc(var(--spacing, 4px) * 1.5);
	}
	.mark[data-variant='dots'] {
		width: calc(var(--spacing, 4px) * 2);
		height: calc(var(--spacing, 4px) * 2);
		transition: scale var(--dur-base) var(--ease-settle);
	}
	.mark[data-variant='dots'][data-state='active'] {
		scale: 1.25;
	}
	/*
	 * The step you are on is copper; those behind it stay tonal (data-tone, see the script: the
	 * colour follows the fill). The colour only animates on a mark that stays filled (data-recolor),
	 * in the base duration, beside the fill's own motion.
	 */
	.mark-fill {
		--recolor: 0s;
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: var(--foreground);
	}
	.mark[data-recolor] .mark-fill {
		--recolor: var(--dur-base);
	}
	.mark[data-tone='current'] .mark-fill {
		background: var(--primary);
	}
	.mark[data-variant='bars'] .mark-fill {
		transform-origin: left center;
		scale: 0 1;
		transition:
			scale var(--sweep-dur, var(--dur-base)) var(--sweep-ease, var(--ease-settle))
				var(--sweep-delay, 0s),
			background-color var(--recolor) var(--ease-settle);
	}
	:global([dir='rtl']) .mark[data-variant='bars'] .mark-fill {
		transform-origin: right center;
	}
	.mark[data-variant='bars'][data-filled] .mark-fill {
		scale: 1 1;
	}
	.mark[data-variant='dots'] .mark-fill {
		opacity: 0;
		scale: 0.5;
		transition:
			opacity var(--dur-quick) var(--ease-settle) var(--sweep-delay, 0s),
			scale var(--dur-quick) var(--ease-settle) var(--sweep-delay, 0s),
			background-color var(--recolor) var(--ease-settle);
	}
	.mark[data-variant='dots'][data-filled] .mark-fill {
		opacity: 1;
		scale: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.mark[data-variant='dots'][data-state='active'] {
			scale: 1;
		}
		.mark[data-variant='bars'] .mark-fill {
			scale: 1 1;
			opacity: 0;
			transition: opacity var(--dur-quick) var(--ease-settle);
		}
		.mark[data-variant='bars'][data-filled] .mark-fill {
			opacity: 1;
		}
		.mark[data-variant='dots'] .mark-fill {
			scale: 1;
		}
	}
</style>
