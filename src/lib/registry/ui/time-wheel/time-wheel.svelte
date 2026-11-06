<script lang="ts">
	import Wheel from './wheel.svelte';
	import { cn } from '#lib/utils.js';

	interface Props {
		/** The time, as a Date; only its hours and minutes are read and written. */
		date?: Date;
		format?: '12' | '24';
		/** Flat, as on iOS, or a drum. */
		variant?: 'flat' | 'drum';
		class?: string;
		onDateChange?: (date: Date) => void;
	}

	let {
		date = $bindable(new Date()),
		format = '24',
		variant = 'flat',
		class: className,
		onDateChange
	}: Props = $props();

	const pad = (n: number) => n.toString().padStart(2, '0');
	const hours24 = Array.from({ length: 24 }, (_, i) => pad(i));
	const hours12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(pad);
	const minutes = Array.from({ length: 60 }, (_, i) => pad(i));
	const periods = ['am', 'pm'];

	const hour = $derived(date.getHours());
	const minute = $derived(date.getMinutes());
	const hour12 = $derived(pad(hour % 12 === 0 ? 12 : hour % 12));
	const period = $derived(hour >= 12 ? 'pm' : 'am');

	function set(h: number, m: number) {
		const next = new Date(date);
		next.setHours(h, m);
		date = next;
		onDateChange?.(next);
	}
	const num = (v: number | string) => (typeof v === 'string' ? parseInt(v, 10) : v);

	const onHour24 = (v: number | string) => set(num(v), minute);
	const onMinute = (v: number | string) => set(hour, num(v));
	// 12 → 0 or 12, 1–11 → 1–11 or 13–23, by the period that is set
	const onHour12 = (v: number | string) => set((num(v) % 12) + (hour >= 12 ? 12 : 0), minute);
	const onPeriod = (v: number | string) => set((hour % 12) + (v === 'pm' ? 12 : 0), minute);

	const width = $derived(variant === 'drum' ? 'w-16' : 'w-12');
</script>

<div
	class={cn(
		'relative mx-auto flex w-full max-w-xl items-center justify-center select-none',
		variant === 'drum' ? 'gap-2 px-10 py-10' : 'gap-0.5 px-24 py-8',
		className
	)}
>
	<!-- one highlight bar across every column: the row in it is the value -->
	<div class="bg-primary/15 pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-md"></div>

	{#if format === '24'}
		<Wheel items={hours24} value={pad(hour)} onValueChange={onHour24} {variant} label="Hour" class={width} />
		<Wheel items={minutes} value={pad(minute)} onValueChange={onMinute} {variant} label="Minute" class={width} />
	{:else}
		<Wheel items={hours12} value={hour12} onValueChange={onHour12} {variant} label="Hour" class={width} />
		<Wheel items={minutes} value={pad(minute)} onValueChange={onMinute} {variant} label="Minute" class={width} />
		<Wheel items={periods} value={period} loop={false} onValueChange={onPeriod} {variant} label="am or pm" class={cn(width, 'ml-1')} />
	{/if}
</div>
