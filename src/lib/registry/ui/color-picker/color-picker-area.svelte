<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { hsvToRgb, inGamut, maxChroma, peakChroma, toHex } from './color.js';
	import { getColorPicker } from './context.svelte.js';
	import { paintOklchArea } from './paint.js';
	import { COLOR_HAIRLINE } from './look.js';

	/**
	 * ColorPickerArea: the 2D field of the ColorPicker, the colour itself, with a round thumb (a light
	 * ring around the picked colour, with a hairline so it reads on white and on black). In the root's
	 * `space`:
	 * - `hsv`: saturation across, brightness up, at the current hue (the familiar square);
	 * - `oklch`: chroma across (to the most this hue reaches in sRGB), lightness up. Where sRGB
	 *   ends the field shows the surface beneath: the gamut's real shape. A point outside is taken
	 *   to the edge at that lightness.
	 *
	 * Press or drag anywhere (pointer, pen, touch; the thumb jumps to the finger and follows it
	 * without lag, a touch larger while held so a finger does not hide it). Keyboard: arrows move
	 * by 1 %, with Shift by 10 %; Page Up / Down move lightness / brightness by 10 %, Home / End
	 * the other axis by 10 %. No key step is animated.
	 *
	 * Accessibility as react-aria's ColorArea: a `role="group"` (name it with `aria-label` or
	 * `aria-labelledby`; an `aria-roledescription` like "2D slider" is yours to pass) holding two
	 * range inputs, one per channel, named by `channelLabels`. The first takes focus and both
	 * axes' keys; the second is there for touch screen readers, which swipe each channel.
	 * `getValueText` gives both their `aria-valuetext`, e.g. "Saturation 60 %, brightness 40 %".
	 * Its `x` / `y` are in the inputs' units: `hsv` saturation and brightness 0-100; `oklch` chroma
	 * (0 to about 0.37, three decimals) and lightness 0-100.
	 *
	 * Size it with a class (default: full width, 4:3). Inside a vaul drawer it never starts the
	 * drag (`data-vaul-no-drag`).
	 *
	 * @example
	 * <ColorPickerArea
	 *   aria-label="Colour"
	 *   channelLabels={['Saturation', 'Brightness']}
	 *   getValueText={({ x, y }) => `Saturation ${x} %, brightness ${y} %`}
	 * />
	 */
	let {
		ref = $bindable(null),
		class: className,
		channelLabels,
		getValueText,
		onpointerdown,
		onpointermove,
		onpointerup,
		onpointercancel,
		onkeydown,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		/** The two channels' names for assistive tech, across then up ("Saturation", "Brightness"). */
		channelLabels: [string, string];
		/** Both channels in words for assistive tech (`aria-valuetext`). */
		getValueText?: (value: { x: number; y: number }) => string;
	} = $props();

	const picker = getColorPicker('ColorPickerArea');

	// ── where the colour sits: fractions across (0 left) and down (0 top) ─────────────────────────
	const peak = $derived(
		picker.space === 'oklch' ? Math.max(peakChroma(picker.oklch.h), picker.shown.c) : 1
	);
	const fx = $derived(picker.space === 'oklch' ? picker.shown.c / peak : picker.hsv.s);
	const fy = $derived(1 - (picker.space === 'oklch' ? picker.shown.l : picker.hsv.v));

	// The channels in the inputs' units.
	const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;
	const channels = $derived(
		picker.space === 'oklch'
			? { x: round(picker.shown.c, 3), y: round(picker.shown.l * 100, 0), xMax: round(peak, 3), xStep: 0.001 }
			: { x: round(picker.hsv.s * 100, 0), y: round(picker.hsv.v * 100, 0), xMax: 100, xStep: 1 }
	);
	const valueText = $derived(getValueText?.({ x: channels.x, y: channels.y }));

	function place(x: number, y: number) {
		x = Math.min(1, Math.max(0, x));
		y = Math.min(1, Math.max(0, y));
		if (picker.space === 'oklch') {
			const l = 1 - y;
			const h = picker.oklch.h;
			let c = x * peak;
			if (!inGamut({ l, c, h, a: 1 })) c = Math.min(c, maxChroma(l, h));
			picker.setOklch({ l, c });
		} else {
			picker.setHsv({ s: x, v: 1 - y });
		}
	}

	// ── pointer ──────────────────────────────────────────────────────────────────────────────────
	let xInput = $state<HTMLInputElement | null>(null);
	let dragging = $state<number | null>(null);

	function fromPointer(e: PointerEvent) {
		if (!ref) return;
		const rect = ref.getBoundingClientRect();
		place((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
	}

	function handlePointerDown(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onpointerdown?.(e);
		// one finger at a time: a second touch mid-drag does not make the thumb jump
		if (e.defaultPrevented || picker.disabled || e.button !== 0 || dragging !== null) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		dragging = e.pointerId;
		xInput?.focus({ preventScroll: true });
		fromPointer(e);
	}
	function handlePointerMove(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onpointermove?.(e);
		if (e.pointerId === dragging) fromPointer(e);
	}
	function handlePointerUp(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (e.type === 'pointerup') onpointerup?.(e);
		else if (e.type === 'pointercancel') onpointercancel?.(e);
		if (e.pointerId !== dragging) return;
		dragging = null;
		picker.commit();
	}

	// ── keyboard: both axes from the focused input ────────────────────────────────────────────────
	function handleKeyDown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		onkeydown?.(e);
		if (e.defaultPrevented || picker.disabled) return;
		const step = e.shiftKey ? 0.1 : 0.01;
		const moves: Record<string, [number, number]> = {
			ArrowLeft: [-step, 0],
			ArrowRight: [step, 0],
			ArrowUp: [0, -step],
			ArrowDown: [0, step],
			PageUp: [0, -0.1],
			PageDown: [0, 0.1],
			Home: [-0.1, 0],
			End: [0.1, 0]
		};
		const move = moves[e.key];
		if (!move) return;
		e.preventDefault();
		place(fx + move[0], fy + move[1]);
		picker.commit();
	}

	// A screen reader's swipe on one channel arrives as an input event.
	function handleInput(axis: 'x' | 'y', e: Event & { currentTarget: HTMLInputElement }) {
		const n = Number(e.currentTarget.value);
		if (!Number.isFinite(n)) return;
		if (axis === 'x') place(picker.space === 'oklch' ? n / peak : n / 100, fy);
		else place(fx, 1 - n / 100);
		picker.commit();
	}

	// ── the field ────────────────────────────────────────────────────────────────────────────────
	// hsv: the hue at full strength under a white → clear and a clear → black wash (CSS, no canvas).
	const hueColor = $derived(toHex(hsvToRgb({ h: picker.hsv.h, s: 1, v: 1, a: 1 })));
	let canvas = $state<HTMLCanvasElement | null>(null);
	let size = $state({ w: 0, h: 0 });

	// oklch: painted per pixel at the field's CSS size (capped), redrawn once per frame at most.
	$effect(() => {
		if (picker.space !== 'oklch' || !canvas || !size.w || !size.h) return;
		const target = canvas;
		const h = picker.oklch.h;
		const c = peak;
		const scale = Math.min(1, 320 / size.w);
		const w = Math.round(size.w * scale);
		const hgt = Math.round(size.h * scale);
		const frame = requestAnimationFrame(() => paintOklchArea(target, w, hgt, h, c));
		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	bind:this={ref}
	bind:clientWidth={size.w}
	bind:clientHeight={size.h}
	role="group"
	data-slot="color-picker-area"
	data-space={picker.space}
	data-dragging={dragging !== null ? '' : undefined}
	data-disabled={picker.disabled ? '' : undefined}
	aria-disabled={picker.disabled || undefined}
	data-vaul-no-drag=""
	{...restProps}
	class={cn(
		'group/area relative aspect-[4/3] w-full cursor-crosshair touch-none rounded-md select-none',
		// this surface shows where sRGB ends (oklch): a step off muted, so it also reads on a card or on muted
		'bg-[color-mix(in_oklab,var(--foreground)_8%,var(--muted))]',
		'data-disabled:cursor-not-allowed data-disabled:opacity-50',
		className
	)}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	onlostpointercapture={handlePointerUp}
	onkeydown={handleKeyDown}
>
	{#if picker.space === 'oklch'}
		<canvas
			bind:this={canvas}
			data-slot="color-picker-area-field"
			aria-hidden="true"
			class="absolute inset-0 size-full rounded-[inherit]"
		></canvas>
	{:else}
		<div
			data-slot="color-picker-area-field"
			aria-hidden="true"
			class="absolute inset-0 rounded-[inherit]"
			style:background="linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), {hueColor}"
		></div>
	{/if}
	<div
		aria-hidden="true"
		class={cn('pointer-events-none absolute inset-0 rounded-[inherit]', COLOR_HAIRLINE)}
	></div>

	<!--
		The thumb's anchor is a point in the field, in %; the thumb sits on it, centred. A point, not a
		field-sized layer moved by translate: that layer would widen the page's scroll area.
	-->
	<div class="pointer-events-none absolute size-0" style:left="{fx * 100}%" style:top="{fy * 100}%">
		<div
			data-slot="color-picker-area-thumb"
			class={cn(
				'absolute top-0 left-0 size-6 -translate-1/2 rounded-full',
				// a light ring in both themes, a hairline outside and in, so it reads on white and on black
				'[--thumb-ring:var(--card)] dark:[--thumb-ring:var(--foreground)]',
				'shadow-[0_0_0_1px_var(--input),inset_0_0_0_3px_var(--thumb-ring),inset_0_0_0_4px_var(--input)]',
				'outline-2 outline-offset-2 outline-transparent has-[input:focus-visible]:outline-ring',
				'transition-[scale] duration-(--dur-quick) ease-(--ease-settle)',
				'motion-safe:group-data-dragging/area:scale-[1.2]'
			)}
			style:background-color={picker.opaque}
		>
			<input
				bind:this={xInput}
				type="range"
				class="sr-only"
				aria-label={channelLabels[0]}
				aria-valuetext={valueText}
				min="0"
				max={channels.xMax}
				step={channels.xStep}
				value={channels.x}
				disabled={picker.disabled}
				oninput={(e) => handleInput('x', e)}
			/>
			<input
				type="range"
				class="sr-only"
				tabindex="-1"
				aria-label={channelLabels[1]}
				aria-valuetext={valueText}
				aria-orientation="vertical"
				min="0"
				max="100"
				step="1"
				value={channels.y}
				disabled={picker.disabled}
				oninput={(e) => handleInput('y', e)}
			/>
		</div>
	</div>
</div>
