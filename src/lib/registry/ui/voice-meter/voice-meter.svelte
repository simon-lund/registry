<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * Where the levels come from, mutually exclusive: values the consumer pushes (`levels`), an
	 * AnalyserNode it owns (`analyser`), or a MediaStream (`stream`, e.g. from getUserMedia). None
	 * of them is silence: a calm row of dots.
	 */
	export type VoiceMeterSource =
		| { levels?: readonly number[]; analyser?: never; stream?: never }
		| { analyser: AnalyserNode; levels?: never; stream?: never }
		| { stream: MediaStream; levels?: never; analyser?: never };

	export type VoiceMeterProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'aria-hidden'> & {
		ref?: HTMLDivElement | null;
		/** How many slots are visible. Default 24. */
		count?: number;
	} & VoiceMeterSource;
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '#lib/utils.js';
	import { trackVoiceLevel } from './voice-level.js';

	/**
	 * VoiceMeter: a live level meter for a voice being recorded. One row of small round dots, evenly
	 * spaced; with the louder moments single dots stretch into short rounded bars, centred on the
	 * row, never taller than the meter. The newest level enters on the right and the row drifts left
	 * like a recording; the ends fade out.
	 *
	 * Levels are 0..1, newest last. Give it `levels` (push one new array per sample, it glides one
	 * slot per change), or an `analyser` / `stream` and it reads the loudness itself
	 * (`trackVoiceLevel`: Web Audio, RMS per frame on a decibel scale, a quick-rise / slow-decay
	 * envelope, one sample per 90ms) and closes what it opened when it goes. It never asks for the
	 * microphone and never stops a stream's tracks: both belong to the caller.
	 *
	 * Drawn in `currentColor` (muted-foreground by default). 24px tall and 24 slots of a 4px dot and
	 * 6px gap by default: size it with `h-*`, `count` and the `--voice-meter-dot` /
	 * `--voice-meter-gap` variables. Motion is transform only: each slot is two round caps that move
	 * apart and a body that scales between them, so a dot stays a circle and nothing reflows. Reduced
	 * motion: no growth and no drift; the dots fade in strength with the level instead.
	 *
	 * Always `aria-hidden`: say what is happening in words next to it.
	 *
	 * @example
	 * <VoiceMeter {stream} />
	 * <p>Listening. Press stop when you are done.</p>
	 */
	let {
		ref = $bindable(null),
		class: className,
		count = 24,
		levels,
		analyser,
		stream,
		...restProps
	}: VoiceMeterProps = $props();

	// Live mode: the meter owns the history it reads from the analyser / stream.
	let live = $state<number[]>([]);
	$effect(() => {
		const source = analyser ?? stream;
		if (!source) return;
		live = [];
		return trackVoiceLevel(source, (level) => {
			live = [...live, level].slice(-(untrack(() => count) + 1));
		});
	});

	const clamp = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);
	const source = $derived(analyser || stream ? live : (levels ?? []));
	// count + 1 slots, right-aligned: the extra one is the oldest, just off the left edge, so it
	// glides out instead of vanishing. Fewer values than slots: the rest are rest dots.
	const slots = $derived.by(() => {
		const n = Math.max(1, Math.floor(count)) + 1;
		const tail = source.slice(-n).map(clamp);
		return [...Array<number>(n - tail.length).fill(0), ...tail];
	});

	// The drift: each new sample shifts the values one slot left, and the row glides back from
	// one slot to the right, linear over the time between samples, so the row moves on one steady
	// conveyor. A glide still under way when the next sample lands is continued, not restarted.
	let row = $state<HTMLDivElement | null>(null);
	let glide: Animation | null = null;
	let lastAt = 0;
	let pace = 90;
	let mounted = false;
	$effect(() => {
		void source;
		if (!mounted) {
			mounted = true;
			return;
		}
		untrack(step);
	});

	let glideFrom = 0;
	let glideMs = 1;
	function step() {
		const now = performance.now();
		const dt = now - lastAt;
		lastAt = now;
		if (dt < 1200) pace = pace * 0.7 + dt * 0.3;
		if (!row || prefersReducedMotion.current || typeof row.animate !== 'function') return;
		const a = row.firstElementChild as HTMLElement | null;
		const b = a?.nextElementSibling as HTMLElement | null;
		if (!a || !b) return;
		let from = b.offsetLeft - a.offsetLeft;
		if (glide?.playState === 'running') {
			from += glideFrom * Math.max(0, 1 - Number(glide.currentTime ?? 0) / glideMs);
			glide.cancel();
		}
		glideFrom = from;
		glideMs = Math.min(1000, Math.max(40, pace));
		glide = row.animate([{ translate: `${from}px 0` }, { translate: '0 0' }], { duration: glideMs, easing: 'linear' });
	}
</script>

<div
	bind:this={ref}
	data-slot="voice-meter"
	aria-hidden="true"
	style:--voice-meter-count={count}
	class={cn(
		'relative h-6 max-w-full shrink-0 overflow-hidden text-muted-foreground',
		'[--voice-meter-dot:var(--spacing)] [--voice-meter-gap:calc(var(--spacing)*1.5)]',
		'w-[calc(var(--voice-meter-count)*(var(--voice-meter-dot)+var(--voice-meter-gap))-var(--voice-meter-gap))]',
		// The ends fade over about two slots, so a dot drifts in and out instead of popping.
		'[mask-image:linear-gradient(to_right,transparent,black_calc((var(--voice-meter-dot)+var(--voice-meter-gap))*2),black_calc(100%-(var(--voice-meter-dot)+var(--voice-meter-gap))*2),transparent)]',
		className
	)}
	{...restProps}
>
	<div bind:this={row} class="absolute inset-y-0 right-0 flex gap-(--voice-meter-gap)">
		{#each slots as level, i (i)}
			<span
				class="relative h-full w-(--voice-meter-dot) shrink-0 motion-reduce:opacity-[calc(0.4+0.6*var(--level))]"
				style:--level={level}
			>
				<!-- the body between the caps; the caps' wrappers are as tall as its full stretch -->
				<span class="absolute inset-x-0 inset-y-[calc(var(--voice-meter-dot)/2)] scale-y-(--level) bg-current motion-reduce:scale-y-0"></span>
				<span class="absolute inset-x-0 inset-y-[calc(var(--voice-meter-dot)/2)] grid place-items-center translate-y-[calc(var(--level)*-50%)] motion-reduce:translate-y-0">
					<span class="size-(--voice-meter-dot) rounded-full bg-current"></span>
				</span>
				<span class="absolute inset-x-0 inset-y-[calc(var(--voice-meter-dot)/2)] grid place-items-center translate-y-[calc(var(--level)*50%)] motion-reduce:translate-y-0">
					<span class="size-(--voice-meter-dot) rounded-full bg-current"></span>
				</span>
			</span>
		{/each}
	</div>
</div>
