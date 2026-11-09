<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	/*
	 * A toast names its inks as variables, so its parts never need to know which variant it is:
	 *   --toast-accent   the action's words
	 *   --toast-wash     the draining wash (ToastProgress) and the action's hover
	 * The wash is mixed from the foreground: popover and muted are the same tone in dark.
	 */
	export const toastVariants = tv({
		base: [
			'bg-popover text-popover-foreground relative isolate flex min-h-12.5 w-full items-center gap-3 overflow-hidden rounded-lg border px-4.5 py-1.5 shadow-lg has-[[data-slot=toast-action]]:pe-1.5',
			/* the words and the action above the draining wash (ToastProgress) */
			'*:not-data-[slot=toast-progress]:relative *:not-data-[slot=toast-progress]:z-[1]',
			/* a leading icon (what kind of news): 20px, in the toast's ink unless it says otherwise */
			"[&>svg]:-ms-0.5 [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-5",
			/* forced colours: the icon takes the system text colour, a destructive mark included (the words carry it) */
			'forced-colors:[&>svg]:text-[CanvasText]'
		],
		variants: {
			variant: {
				/** What just happened, with its undo. Also the one for a failure (an icon in `text-destructive`) and a success. */
				default:
					'[--toast-accent:var(--foreground)] [--toast-wash:color-mix(in_oklab,var(--foreground)_10%,var(--popover))]',
				/** The app speaking: a notice, offline. The action in the quieter ink, a lighter wash. */
				notice:
					'[--toast-accent:var(--muted-foreground)] [--toast-wash:color-mix(in_oklab,var(--foreground)_6%,var(--popover))]',
				/** The app's own news, a tip. A lighter wash. */
				news: '[--toast-accent:var(--foreground)] [--toast-wash:color-mix(in_oklab,var(--foreground)_6%,var(--popover))]'
			}
		},
		defaultVariants: { variant: 'default' }
	});

	export type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { setToastClock } from './context.js';

	const DEFAULT_DURATION = 5000; // ms

	/**
	 * Toast: the floating block that says what just happened, one line, with room for one action.
	 * Text sits 18px in; an action sits 6px from the edge.
	 *
	 * Variants never carry a meaning: the words do, with an optional leading icon. A failure is the
	 * default toast with an icon in `text-destructive`.
	 *
	 * It also owns the clock. `duration` (default 5000ms) starts on mount; `paused` holds it;
	 * `onExpire` fires once when it runs out. `duration={null}` is a toast without a clock (static,
	 * or dismissed by the caller). ToastProgress draws the clock as a wash that drains from right
	 * to left behind the words.
	 *
	 * Usually rendered by <Toaster> from `toast()`; compose it by hand for a custom toast.
	 *
	 * @example
	 * <Toast duration={null}>
	 *   <ToastMessage><ToastVerb>Archived</ToastVerb><Middot />Q3 report</ToastMessage>
	 *   <ToastAction onclick={restore}>Undo</ToastAction>
	 *   <ToastProgress />
	 * </Toast>
	 */
	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		duration,
		paused = false,
		onExpire,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		/** The action's ink and the wash: `default`, `notice`, `news`. The surface stays the same. */
		variant?: ToastVariant;
		/** The window in ms. Default: 5000. `null`: no clock. Read once, on mount. */
		duration?: number | null;
		/** Holds the clock (and the wash with it) while true. */
		paused?: boolean;
		/** The clock ran out. Not called when the toast is removed early. */
		onExpire?: () => void;
	} = $props();

	let clock: Animation | null = null;
	let ms = $state<number | null>(null);
	const followers = new Set<Animation>();

	function apply(a: Animation) {
		if (!clock || a.playState === 'finished') return;
		a.currentTime = clock.currentTime;
		if (paused) a.pause();
		else a.play();
	}

	setToastClock({
		follow(a) {
			followers.add(a);
			apply(a);
			return () => followers.delete(a);
		},
		get duration() {
			return ms;
		}
	});

	// Start the clock once, on mount. A toast's window is set when it appears.
	$effect(() => {
		const el = ref;
		if (!el) return;
		const d = untrack(() => duration);
		if (d === null) return;
		const length = d ?? DEFAULT_DURATION;
		// No keyframes: a pure timer on the document timeline.
		const a = el.animate([], { duration: length });
		clock = a;
		ms = length;
		if (untrack(() => paused)) a.pause();
		for (const f of followers) apply(f);
		a.finished.then(
			() => onExpire?.(),
			() => {} // cancelled: removed before it ran out
		);
		return () => {
			a.cancel();
			clock = null;
		};
	});

	// Hold and release the clock and everything that follows it, in the same task.
	$effect(() => {
		const hold = paused;
		if (!clock || clock.playState === 'finished') return;
		if (hold) clock.pause();
		else clock.play();
		for (const f of followers) apply(f);
	});
</script>

<div
	bind:this={ref}
	data-slot="toast"
	data-paused={paused || undefined}
	data-variant={variant}
	class={cn(toastVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
