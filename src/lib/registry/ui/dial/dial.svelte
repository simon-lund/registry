<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	/*
	 * The geometry, in fractions of the dial's side so every part scales with it: the knob's
	 * diameter, the radius the marks hang from (their outer ends line up, as on a clock face), the
	 * marks' lengths, and the radius of the labels' centres.
	 *
	 * Touch: the dial is `touch-pan-y`, so a vertical scroll that starts on its face (the knob and
	 * the centre) scrolls the page; only the ring band around the knob, where it is turned, is
	 * `touch-none` (the `dial-ring` layer, and the stop labels in it).
	 */
	export const dialVariants = tv({
		base: [
			'group/dial relative shrink-0 touch-pan-y rounded-full select-none outline-none',
			'cursor-grab data-dragging:cursor-grabbing',
			'aria-disabled:cursor-not-allowed aria-disabled:opacity-45'
		],
		variants: {
			size: {
				/** 224px with room for a label at each stop. */
				default: [
					'size-56',
					'[--dial-knob:50%] [--dial-mark-r:37%] [--dial-label-r:44%]',
					'[--dial-major:calc(var(--spacing)*2.5)] [--dial-minor:calc(var(--spacing)*1.25)]'
				],
				/** 96px, marks only: no room for labels. */
				sm: [
					'size-24',
					'[--dial-knob:58%] [--dial-mark-r:48%] [--dial-label-r:56%]',
					'[--dial-major:calc(var(--spacing)*2)] [--dial-minor:var(--spacing)]'
				]
			}
		},
		defaultVariants: { size: 'default' }
	});

	export type DialSize = VariantProps<typeof dialVariants>['size'];
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import type { HTMLAttributes, KeyboardEventHandler, PointerEventHandler } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { restoreOnReset } from '#lib/registry/ui/form-reset/index.js';
	import { setDial } from './context.js';

	/**
	 * Dial: a rotary knob that picks one of a few stops, e.g. "keep backups for" 1, 7, 30, 90 or 365
	 * days. The key in the middle (`DialKnob`) carries a pointer line and turns to the stop the value
	 * is on; around it one `DialStop` per stop, like a clock face. `DialUnit` names the unit in the
	 * open part of the sweep.
	 *
	 * Stops: `step` is a list of values (they sit at equal angles, whatever their values) or a number
	 * (every `step` from `min` to `max`). `sweep` is the arc in degrees and `start` the angle of the
	 * first stop (0 = 12 o'clock, clockwise; default `-sweep / 2`, so the arc is symmetric and opens
	 * at the bottom). `bind:value` is always a stop.
	 *
	 * `wrap`: the stops form a ring, the last one followed by the first. A drag runs on past the last
	 * stop into the first, the arrow keys and Page Up / Down go round too, and the knob always turns
	 * the short way. Home / End still go to the first and the last stop. Default: on for a full circle
	 * (`sweep={360}`), off for an arc, whose ends are real ends. With `wrap` on an arc, a pointer in
	 * the open gap picks the nearer end, so the knob crosses the gap to go round.
	 *
	 * It is the `role="slider"` element: the consumer gives `aria-label` / `aria-labelledby`, and
	 * `aria-valuetext` where the number alone is unclear ("30 days"). Arrow keys step one stop, Page
	 * Up / Down a tenth of the stops (at least one), Home / End the ends; every keyboard step is
	 * instant. A pointer anywhere on the dial picks the stop at its angle from the centre; a drag
	 * snaps live, so the value, the highlighted label and the knob always agree and nothing moves
	 * again on release. Without `wrap` the angle is tracked unwrapped, so dragging through the open
	 * gap never flips from the last stop to the first. A touch drag ticks a light haptic per stop
	 * where the device has one. `disabled` dims it and ignores input.
	 *
	 * Touch: only the ring band around the knob takes every gesture. On the knob a vertical swipe
	 * scrolls the page, and a touch that turns into that scroll puts the value back (calling
	 * `onValueChange` with it). A tap anywhere still picks the stop at its angle.
	 *
	 * In a form: with a `name` it submits the stop it is on (a hidden input; none while `disabled`).
	 * `form.reset()` or a reset button puts it back to the value it mounted with (the bound `value`
	 * follows; `onValueChange` is not called).
	 *
	 * @example
	 * <Dial bind:value={days} step={[1, 7, 30, 90, 365]} aria-label="Keep backups for" aria-valuetext="{days} days">
	 * 	{#each [1, 7, 30, 90, 365] as d (d)}<DialStop value={d} variant="major">{d}</DialStop>{/each}
	 * 	<DialKnob />
	 * 	<DialUnit>days</DialUnit>
	 * </Dial>
	 */
	let {
		ref = $bindable(null),
		value = $bindable(),
		step = 1,
		min = 0,
		max = 100,
		sweep = 270,
		start,
		wrap,
		disabled = false,
		size = 'default',
		name,
		onValueChange,
		onValueCommit,
		class: className,
		style,
		children,
		// The consumer's handlers run first, then the dial's own (below).
		onpointerdown: userPointerDown,
		onpointermove: userPointerMove,
		onpointerup: userPointerUp,
		onpointercancel: userPointerCancel,
		onkeydown: userKeydown,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLDivElement>, 'role'>> & {
		/** The value: always one of the stops. */
		value?: number;
		/** The stops: a list of values (placed at equal angles), or every `step` from min to max. */
		step?: number | number[];
		min?: number;
		max?: number;
		/** The arc the stops spread over, in degrees (1–360). */
		sweep?: number;
		/** The angle of the first stop: 0 = 12 o'clock, clockwise. Default: `-sweep / 2`. */
		start?: number;
		/**
		 * The stops form a ring: past the last comes the first (drag and keys), and the knob turns
		 * the short way. Default: on for `sweep={360}`, off for an arc.
		 */
		wrap?: boolean;
		disabled?: boolean;
		size?: DialSize;
		/** With a name it takes part in a form: a hidden input with the stop it is on. */
		name?: string;
		/** Called on every change of the value by the user (a key, a pointer passing a stop). */
		onValueChange?: (value: number) => void;
		/** Called when a change is complete: on release of a pointer, and on every key step. */
		onValueCommit?: (value: number) => void;
	} = $props();

	const stops = $derived.by(() => {
		if (Array.isArray(step)) return [...new Set(step)].sort((a, b) => a - b);
		const out: number[] = [];
		const n = Math.max(0, Math.floor((max - min) / step + 1e-9));
		for (let i = 0; i <= n; i++) out.push(Math.round((min + i * step) * 1e9) / 1e9);
		return out;
	});
	const arc = $derived(Math.min(360, Math.max(1, sweep)));
	const first = $derived(start ?? -arc / 2);
	// A full circle would put the last stop onto the first: spread over n stops, not n − 1 gaps.
	const gaps = $derived(Math.max(1, arc >= 360 ? stops.length : stops.length - 1));

	function nearestIndex(v: number | undefined) {
		if (v === undefined || stops.length === 0) return 0;
		let best = 0;
		for (let i = 1; i < stops.length; i++) if (Math.abs(stops[i] - v) < Math.abs(stops[best] - v)) best = i;
		return best;
	}
	const index = $derived(nearestIndex(value));
	const angleOf = (i: number) => first + (arc * i) / gaps;
	const ring = $derived(wrap ?? arc >= 360);

	// The knob's angle. On a ring it is unwrapped: each change turns it by the shortest way from
	// where it was (55 → 0 on an hour turns on by 30°, not back by 330°), so the CSS rotate never
	// spins the long way round. Read in the same render as the index (a memo, not an effect).
	let shownAngle: number | undefined;
	const knobAngle = $derived.by(() => {
		const target = angleOf(index);
		if (!ring || shownAngle === undefined) return (shownAngle = target);
		return (shownAngle += wrap360(target - shownAngle));
	});

	setDial({
		get stops() {
			return stops;
		},
		get index() {
			return index;
		},
		get sweep() {
			return arc;
		},
		get start() {
			return first;
		},
		angleOf,
		indexOf: (v: number) => stops.indexOf(v)
	});

	// ── form: back to the value it mounted with on reset (the hidden input follows the value) ──
	let mounted: { v: number | undefined } | undefined;
	$effect(() => {
		const el = ref;
		if (!el) return;
		const start = (mounted ??= untrack(() => ({ v: value })));
		return restoreOnReset(el, () => (value = start.v));
	});

	// ── input ────────────────────────────────────────────────────────────────────────────────────
	let dragging = $state(false);
	// Turns settle (a pointer, a value set from outside); a key press makes the next turn instant.
	let settle = $state(true);
	let pointerId: number | null = null;
	let touch = false;
	// The pointer's angle relative to the first stop, unwrapped (may run past the ends), and its
	// last raw angle; null while the pointer is too near the centre to have a direction.
	let along = 0;
	let lastAngle: number | null = null;
	// The value before a touch, put back if the browser takes that touch for a page scroll.
	let heldValue: number | undefined;

	function set(i: number, commit: boolean) {
		const next = stops[Math.min(stops.length - 1, Math.max(0, i))];
		if (next === undefined) return;
		if (next !== stops[index] || value === undefined) {
			value = next;
			onValueChange?.(next);
			if (touch) {
				try {
					if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(5);
				} catch {
					// a browser that refuses (no user activation, a policy) just stays silent
				}
			}
		}
		if (commit) onValueCommit?.(next);
	}

	// The pointer's angle around the knob's centre (clockwise from 12 o'clock), or null within
	// a sixth of the radius, where a few pixels swing the angle wildly.
	function angleAt(e: PointerEvent): number | null {
		const r = ref?.getBoundingClientRect();
		if (!r) return null;
		const dx = e.clientX - (r.left + r.width / 2);
		const dy = e.clientY - (r.top + r.height / 2);
		if (Math.hypot(dx, dy) < r.width / 12) return null;
		return (Math.atan2(dx, -dy) * 180) / Math.PI;
	}
	// A turn in degrees, folded into −180…180: the shortest way.
	function wrap360(d: number) {
		return ((((d + 180) % 360) + 360) % 360) - 180;
	}
	// The stop nearest to a position along the arc; past the ends, the end.
	const stopAt = (deg: number) => Math.round((Math.min(arc, Math.max(0, deg)) / arc) * gaps) % stops.length;
	// A raw pointer angle as a position along the arc; in the open gap, the nearer end.
	function alongFrom(a: number) {
		let rel = (((a - first) % 360) + 360) % 360;
		if (rel > arc) rel = rel - arc < 360 - rel ? arc : 0;
		return rel;
	}
	// A step from stop `i` by `by`: round the ring, or held at the ends.
	const n = $derived(stops.length);
	const stepFrom = (i: number, by: number) => (ring ? (((i + by) % n) + n) % n : i + by);

	const onpointerdown: PointerEventHandler<HTMLDivElement> = (e) => {
		userPointerDown?.(e);
		if (disabled || e.button !== 0 || pointerId !== null) return;
		e.preventDefault();
		ref?.focus();
		pointerId = e.pointerId;
		ref?.setPointerCapture(e.pointerId);
		touch = e.pointerType === 'touch';
		heldValue = value;
		dragging = true;
		settle = true;
		const a = angleAt(e);
		lastAngle = a;
		if (a === null) return;
		// Pointing into the open gap picks the nearer end.
		along = alongFrom(a);
		set(stopAt(along), false);
	};
	const onpointermove: PointerEventHandler<HTMLDivElement> = (e) => {
		userPointerMove?.(e);
		if (e.pointerId !== pointerId) return;
		const a = angleAt(e);
		if (a === null) return;
		if (lastAngle === null || ring) {
			// The drag began at the centre (its first direction places it), or the stops are a ring:
			// the stop at the pointer's angle, whichever way round it got there.
			along = alongFrom(a);
		} else {
			along += wrap360(a - lastAngle);
		}
		lastAngle = a;
		set(stopAt(along), false);
	};
	function end(e: PointerEvent) {
		if (e.pointerId !== pointerId) return;
		if (ref?.hasPointerCapture(e.pointerId)) ref.releasePointerCapture(e.pointerId);
		pointerId = null;
		dragging = false;
		// Scrolled away (pointercancel on the face): the touch was never meant for the dial.
		if (e.type === 'pointercancel' && touch && heldValue !== value) {
			value = heldValue;
			if (heldValue !== undefined) onValueChange?.(heldValue);
		}
		touch = false;
		if (e.type === 'pointerup') onValueCommit?.(stops[index]);
	}
	const onpointerup: PointerEventHandler<HTMLDivElement> = (e) => {
		userPointerUp?.(e);
		end(e);
	};
	const onpointercancel: PointerEventHandler<HTMLDivElement> = (e) => {
		userPointerCancel?.(e);
		end(e);
	};

	const onkeydown: KeyboardEventHandler<HTMLDivElement> = (e) => {
		userKeydown?.(e);
		if (disabled || e.defaultPrevented) return;
		const page = Math.max(1, Math.round((stops.length - 1) / 10));
		const to: Record<string, number> = {
			ArrowRight: stepFrom(index, 1),
			ArrowUp: stepFrom(index, 1),
			ArrowLeft: stepFrom(index, -1),
			ArrowDown: stepFrom(index, -1),
			PageUp: stepFrom(index, page),
			PageDown: stepFrom(index, -page),
			Home: 0,
			End: stops.length - 1
		};
		if (!(e.key in to)) return;
		e.preventDefault();
		settle = false;
		touch = false;
		set(to[e.key], true);
	};
</script>

<div
	bind:this={ref}
	role="slider"
	tabindex={disabled ? -1 : 0}
	aria-valuemin={stops[0]}
	aria-valuemax={stops[stops.length - 1]}
	aria-valuenow={stops[index]}
	aria-disabled={disabled ? 'true' : undefined}
	data-slot="dial"
	data-size={size}
	data-dragging={dragging ? '' : undefined}
	data-settle={settle ? '' : undefined}
	data-wrap={ring ? '' : undefined}
	class={cn(dialVariants({ size }), className)}
	style="--dial-angle:{knobAngle}deg;{style ?? ''}"
	{...restProps}
	{onpointerdown}
	{onpointermove}
	{onpointerup}
	{onpointercancel}
	{onkeydown}
>
	<!--
		The gesture surface. The ring band is touch-none (every touch turns the knob); the hub on top
		of it, the knob's disc, keeps the root's pan-y, so a vertical swipe there scrolls the page.
		The knob itself is pointer-events-none, so a touch on it lands on the hub.
	-->
	<span data-slot="dial-ring" aria-hidden="true" class="absolute inset-0 touch-none rounded-full"></span>
	<span
		data-slot="dial-hub"
		aria-hidden="true"
		class="absolute inset-[calc((100%-var(--dial-knob))/2)] touch-pan-y rounded-full"
	></span>
	{@render children?.()}
	{#if name && stops.length}
		<input type="hidden" {name} value={stops[index]} disabled={disabled || undefined} />
	{/if}
</div>
