<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import AnimatedNumber from './animated-number.svelte';

	/**
	 * A number you step with two chevrons or type. The digits roll to the new value, so you see
	 * what changed and which way. Arrow keys step too (Shift: ten steps; Home and End: the bounds);
	 * a chevron held keeps stepping. The field never holds an invalid value: what you type is taken
	 * as soon as it reads as a number, and clamped to min and max when you leave.
	 */
	const root = tv({
		base: 'group/number inline-flex items-stretch rounded-md border border-input bg-background text-foreground transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40 data-[disabled]:opacity-50',
		variants: {
			size: {
				default: 'h-10 text-base',
				lg: 'h-14 text-2xl'
			}
		},
		defaultVariants: { size: 'default' }
	});

	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		/** BCP 47 tag; the browser's language by default. */
		locale?: string;
		/** Intl.NumberFormat options for the shown value, e.g. { style: 'currency', currency: 'EUR' }. */
		format?: Intl.NumberFormatOptions;
		size?: VariantProps<typeof root>['size'];
		name?: string;
		id?: string;
		class?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		onValueChange?: (value: number) => void;
	}

	let {
		ref = $bindable(null),
		value = $bindable(0),
		min = -Infinity,
		max = Infinity,
		step = 1,
		disabled = false,
		locale,
		format,
		size,
		name,
		id,
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		onValueChange
	}: WithElementRef<Props, HTMLInputElement> = $props();

	const formatter = $derived(new Intl.NumberFormat(locale, format));
	// The decimal and group marks of this locale, to read typed text back.
	const marks = $derived.by(() => {
		const parts = new Intl.NumberFormat(locale).formatToParts(-12345.6);
		return {
			decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
			group: parts.find((p) => p.type === 'group')?.value ?? ','
		};
	});
	// Steps of 0.1 must not drift to 0.30000000000000004: round to the step's decimals.
	const decimals = $derived(Math.max(0, (String(step).split('.')[1] ?? '').length));

	const clamp = (n: number) => Math.min(max, Math.max(min, n));
	const round = (n: number) => Number(n.toFixed(decimals));

	function set(next: number) {
		next = round(clamp(next));
		if (next === value) return;
		value = next;
		onValueChange?.(next);
		// a step while the field is focused shows the new value, not the text typed before it
		text = formatter.format(next);
	}

	// What the field shows while you type; otherwise the formatted value.
	let text = $state('');
	let focused = $state(false);
	$effect(() => {
		if (!focused) text = formatter.format(value);
	});
	// While typed text and the formatted value differ (mid-edit: "1234" against "1,234"), the raw
	// text shows and the rolling digits hide; the moment they agree, the digits take over.
	const editing = $derived(focused && text !== formatter.format(value));

	function parse(raw: string): number | null {
		const cleaned = raw
			.replaceAll(marks.group, '')
			.replace(marks.decimal, '.')
			.replace(/[^\d.\-]/g, '');
		if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
		const n = Number(cleaned);
		return Number.isFinite(n) ? n : null;
	}

	function oninput() {
		const n = parse(text);
		// taken as typed; the bounds apply when you leave
		if (n !== null && n >= min && n <= max) {
			const r = round(n);
			if (r !== value) {
				value = r;
				onValueChange?.(r);
			}
		}
	}

	function commit() {
		const n = parse(text);
		if (n !== null) set(n);
		text = formatter.format(value);
	}

	function onkeydown(e: KeyboardEvent) {
		const by = e.shiftKey ? step * 10 : step;
		if (e.key === 'ArrowUp') set(value + by);
		else if (e.key === 'ArrowDown') set(value - by);
		else if (e.key === 'PageUp') set(value + step * 10);
		else if (e.key === 'PageDown') set(value - step * 10);
		else if (e.key === 'Home' && Number.isFinite(min)) set(min);
		else if (e.key === 'End' && Number.isFinite(max)) set(max);
		else if (e.key === 'Enter') commit();
		else return;
		e.preventDefault();
	}

	// A chevron held keeps stepping: after 400ms, every 60ms.
	let timer: ReturnType<typeof setTimeout> | undefined;
	function hold(direction: 1 | -1) {
		release();
		set(value + direction * step);
		timer = setTimeout(function tick() {
			set(value + direction * step);
			timer = setTimeout(tick, 60);
		}, 400);
	}
	function release() {
		clearTimeout(timer);
		timer = undefined;
	}
	$effect(() => release);

	const atMin = $derived(value <= min);
	const atMax = $derived(value >= max);
</script>

<div class={cn(root({ size }), className)} data-disabled={disabled ? '' : undefined}>
	<div class="relative min-w-[5ch] flex-1">
		<!-- the rolling digits, under the text field; hidden while the typed text is mid-edit -->
		<div
			class={cn(
				'pointer-events-none absolute inset-0 flex items-center px-3 transition-opacity',
				editing && 'opacity-0'
			)}
			aria-hidden="true"
		>
			<AnimatedNumber {value} {locale} {format} />
		</div>
		<input
			bind:this={ref}
			bind:value={text}
			{id}
			{name}
			{disabled}
			type="text"
			inputmode="decimal"
			autocomplete="off"
			role="spinbutton"
			aria-valuenow={value}
			aria-valuemin={Number.isFinite(min) ? min : undefined}
			aria-valuemax={Number.isFinite(max) ? max : undefined}
			aria-valuetext={formatter.format(value)}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledby}
			class={cn(
				'caret-foreground h-full w-full bg-transparent px-3 tabular-nums outline-none',
				editing ? 'text-foreground' : 'text-transparent'
			)}
			onfocus={() => (focused = true)}
			onblur={() => {
				focused = false;
				commit();
			}}
			{oninput}
			{onkeydown}
		/>
	</div>
	<div class="border-input flex w-8 flex-col border-l">
		<button
			type="button"
			tabindex="-1"
			aria-label="Increase"
			disabled={disabled || atMax}
			class="text-muted-foreground hover:text-foreground hover:bg-accent active:bg-accent flex flex-1 items-center justify-center rounded-tr-[inherit] disabled:pointer-events-none disabled:opacity-40"
			onpointerdown={(e) => {
				e.preventDefault();
				hold(1);
			}}
			onpointerup={release}
			onpointerleave={release}
			onpointercancel={release}
		>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 7.5 6 4l3.5 3.5" /></svg>
		</button>
		<button
			type="button"
			tabindex="-1"
			aria-label="Decrease"
			disabled={disabled || atMin}
			class="border-input text-muted-foreground hover:text-foreground hover:bg-accent active:bg-accent flex flex-1 items-center justify-center rounded-br-[inherit] border-t disabled:pointer-events-none disabled:opacity-40"
			onpointerdown={(e) => {
				e.preventDefault();
				hold(-1);
			}}
			onpointerup={release}
			onpointerleave={release}
			onpointercancel={release}
		>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2.5 4.5 3.5 3.5 3.5-3.5" /></svg>
		</button>
	</div>
</div>
