<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	/**
	 * The knob is the one moving piece; the track is flat, with a fine line. Drawn from variables:
	 *   --switch-track       the track, off
	 *   --switch-line        the fine line around the track (stronger on hover)
	 *   --switch-fill        the track's fill, on (copper)
	 *   --switch-knob        the knob, off
	 *   --switch-knob-on     the knob, on
	 * Geometry: --switch-w × --switch-h track, --switch-pad around a --switch-d knob that stretches
	 * by --switch-stretch while held. --switch-pressed (0 | 1) is the press, set by :active.
	 */
	export const switchVariants = tv({
		base: [
			'relative inline-block shrink-0 cursor-pointer select-none rounded-full align-middle',
			'h-(--switch-h) w-(--switch-w) bg-(--switch-track)',
			'[--switch-track:var(--background)] [--switch-fill:var(--primary)]',
			'[--switch-knob:var(--muted-foreground)] [--switch-knob-on:var(--primary-foreground)]',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
			/*
			 * The track's line lies above the fill (::after), so it reads the same off and on: only the
			 * track inside fills. Hover strengthens the line in quick.
			 */
			"after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:content-[''] after:shadow-[inset_0_0_0_1px_var(--switch-line)]",
			'after:transition-[box-shadow] after:duration-(--dur-quick) after:ease-(--ease-settle)',
			'[--switch-line:var(--border)] not-data-disabled:hover:[--switch-line:var(--input)]',
			/* Hit area: the ::before grows the drawn track to at least 44 × 44 without moving layout. */
			"before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-1/2 before:content-['']",
			'[--switch-pressed:0]',
			/* Press: the knob stretches toward where it will go. Never when disabled. */
			'motion-safe:not-data-disabled:active:[--switch-pressed:1]',
			'data-disabled:cursor-not-allowed data-disabled:opacity-45'
		],
		variants: {
			size: {
				/** 52 × 32, a 24px knob; hit area 52 × 44. */
				default:
					'[--switch-w:calc(var(--spacing)*13)] [--switch-h:calc(var(--spacing)*8)] [--switch-pad:calc(var(--spacing)*1)] [--switch-d:calc(var(--spacing)*6)] [--switch-stretch:calc(var(--spacing)*1.5)]',
				/** 40 × 24, a 16px knob; hit area 44 × 44. For dense rows, never as the only control on a card. */
				sm: '[--switch-w:calc(var(--spacing)*10)] [--switch-h:calc(var(--spacing)*6)] [--switch-pad:calc(var(--spacing)*1)] [--switch-d:calc(var(--spacing)*4)] [--switch-stretch:calc(var(--spacing)*1)]'
			}
		},
		defaultVariants: { size: 'default' }
	});

	export type SwitchSize = VariantProps<typeof switchVariants>['size'];
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { Switch as SwitchPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import { restoreOnReset } from '#lib/registry/ui/form-reset/index.js';

	/**
	 * Switch (bits-ui Switch), for settings that take effect at once.
	 *
	 * Motion: the knob slides base 220ms on settle, and the copper fill is a clip-path that follows
	 * behind it, so the track fills from where the knob left, never fades. Holding the switch
	 * stretches the knob toward where it is about to go; on release it travels and draws back into a
	 * circle in the same 220ms. No overshoot. Reduced motion: the knob jumps and the fill cross-fades.
	 *
	 * Sizes `default` (52 × 32) and `sm` (40 × 24), both with a 44px hit area. It has no label of its
	 * own: use `<label for>` with an `id`, or `aria-labelledby`.
	 *
	 * In a form: with a `name` it submits (bits-ui's hidden input). `form.reset()` or a reset button
	 * puts it back to the state it mounted with, drawn and submitted alike (the bound `checked`
	 * follows; `onCheckedChange` is not called). `bind:checked` may point at a value that is still
	 * `undefined` (a missing key in a record): it reads as off.
	 *
	 * @example
	 * <Switch id="push" bind:checked={push} /> <label for="push">Push reminders</label>
	 * <Switch size="sm" aria-label="Mute" />
	 */
	let {
		ref = $bindable(null),
		// No fallback: a binding to a missing key (`bind:checked={prefs[key]}`) is allowed and reads
		// as off; Svelte rejects `bind:x={undefined}` on a prop with a fallback.
		checked = $bindable(),
		class: className,
		size = 'default',
		...restProps
	}: Omit<SwitchPrimitive.RootProps, 'children' | 'child'> & {
		size?: SwitchSize;
	} = $props();

	// form.reset() resets bits-ui's hidden input (to its defaultChecked, set here to the mount
	// state) but not the drawn knob: the knob goes back there too.
	let mounted: boolean | undefined;
	$effect(() => {
		void restProps.name; // the hidden input comes and goes with the name
		const el = ref;
		if (!el) return;
		const start = (mounted ??= untrack(() => !!checked));
		return restoreOnReset(
			el,
			() => (checked = start),
			(input) => (input.defaultChecked = start)
		);
	});
</script>

<SwitchPrimitive.Root
	bind:ref
	bind:checked={() => checked ?? false, (v) => (checked = v)}
	data-slot="switch"
	data-size={size}
	class={cn(switchVariants({ size }), className)}
	{...restProps}
>
	{#snippet children({ checked })}
		{@const state = checked ? 'checked' : 'unchecked'}
		<span data-slot="switch-fill" data-state={state} class="fill" aria-hidden="true"></span>
		<span data-slot="switch-thumb" data-state={state} class="thumb" aria-hidden="true">
			<span data-slot="switch-face" class="face"></span>
		</span>
	{/snippet}
</SwitchPrimitive.Root>

<style>
	/*
	 * Two states, mutually exclusive: unchecked · checked. Pressed is orthogonal (--switch-pressed),
	 * disabled only dims and blocks the press.
	 */

	/*
	 * The on-colour: the track in --switch-fill, revealed from the start side behind the knob. It
	 * starts 1px in, under the line (which lies above it), so its round edge never shows past the
	 * line and the line stays exactly the same on and off.
	 */
	.fill {
		--inset: 1px;
		position: absolute;
		inset: var(--inset);
		border-radius: 9999px;
		background: var(--switch-fill);
		clip-path: inset(0 100% 0 0 round calc(var(--switch-h) / 2 - var(--inset)));
		/* Same duration and curve as the knob, so its leading edge stays hidden under the knob. */
		transition: clip-path var(--dur-base) var(--ease-settle);
	}
	.fill[data-state='checked'] {
		clip-path: inset(0 0 0 0 round calc(var(--switch-h) / 2 - var(--inset)));
	}
	/* Right to left: revealed from the right. */
	.fill:dir(rtl):not([data-state='checked']) {
		clip-path: inset(0 0 0 100% round calc(var(--switch-h) / 2 - var(--inset)));
	}

	/*
	 * The knob. The box is one knob plus its stretch wide; the face inside clips it down to a circle.
	 * Off, the circle sits at the left of the box and the stretch is clipped from the right; on, the
	 * box is shifted left by the stretch and the circle sits at its right. So sliding (translate) and
	 * swapping the clipped side (clip-path) on the same curve keep a perfect circle moving between,
	 * and pressing just unclips the stretch toward the side the knob is about to travel.
	 */
	.thumb {
		--s: var(--switch-stretch);
		--l: 0px;
		--r: calc(var(--s) * (1 - var(--switch-pressed)));
		position: absolute;
		top: var(--switch-pad);
		inset-inline-start: var(--switch-pad);
		width: calc(var(--switch-d) + var(--s));
		height: var(--switch-d);
		transition: translate var(--dur-base) var(--ease-settle);
	}
	.thumb[data-state='checked'] {
		--l: calc(var(--s) * (1 - var(--switch-pressed)));
		--r: 0px;
		translate: calc(var(--switch-w) - 2 * var(--switch-pad) - var(--switch-d) - var(--s)) 0;
	}
	/*
	 * Right to left, mirrored: the box starts at the right, off the circle sits at its right end
	 * (the stretch clipped from the left), on it slides left and sits at its left end.
	 */
	.thumb:dir(rtl) {
		--l: calc(var(--s) * (1 - var(--switch-pressed)));
		--r: 0px;
	}
	.thumb[data-state='checked']:dir(rtl) {
		--l: 0px;
		--r: calc(var(--s) * (1 - var(--switch-pressed)));
		translate: calc(-1 * (var(--switch-w) - 2 * var(--switch-pad) - var(--switch-d) - var(--s))) 0;
	}

	.face {
		position: absolute;
		inset: 0;
		background-color: var(--switch-knob);
		clip-path: inset(0 var(--r) 0 var(--l) round calc(var(--switch-d) / 2));
		/*
		 * Released: the stretch draws back on the slide's clock (base 220ms). Pressed: the stretch
		 * opens in quick 140ms (a firm hand, not a lunge). The durations follow --switch-pressed
		 * rather than :active, so a row that presses the switch through its label
		 * (`[&:active_[data-slot=switch]]:[--switch-pressed:1]`) gets the same timing.
		 */
		transition:
			clip-path calc(var(--dur-base) + (var(--dur-quick) - var(--dur-base)) * var(--switch-pressed))
				var(--ease-settle),
			background-color var(--dur-base) var(--ease-settle);
	}
	/* On, the face takes --switch-knob-on, on the slide's clock. */
	.thumb[data-state='checked'] .face {
		background-color: var(--switch-knob-on);
	}

	/* Reduced motion: no slide, no stretch. The knob is where it is; the fill cross-fades. */
	@media (prefers-reduced-motion: reduce) {
		.thumb {
			transition: none;
		}
		.face {
			transition: background-color var(--dur-quick) var(--ease-settle);
		}
		.fill,
		.fill[data-state='checked'] {
			clip-path: none;
			opacity: 0;
			transition: opacity var(--dur-quick) var(--ease-settle);
		}
		.fill[data-state='checked'] {
			opacity: 1;
		}
	}
</style>
