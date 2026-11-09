<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getToastClock } from './context.js';

	/**
	 * ToastProgress: the toast's clock as its own background. A tonal wash covers the whole toast
	 * and shrinks from the right edge toward the left over the window, linear. Put it anywhere
	 * inside a Toast; it lies under the words and inside the border.
	 * It follows the Toast's clock, so it holds whenever the toast is paused (hover, focus, a
	 * finger on it) and never drifts from the timeout. Without a clock it stays full.
	 * Decorative (aria-hidden): the window is not announced.
	 *
	 * @example
	 * <Toast>…<ToastAction onclick={undo}>Undo</ToastAction><ToastProgress /></Toast>
	 */
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & { ref?: HTMLSpanElement | null } = $props();

	const clock = getToastClock();
	let fill: HTMLElement | null = $state(null);

	$effect(() => {
		const duration = clock?.duration;
		if (!fill || !clock || !duration) return;
		const a = fill.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
			duration,
			easing: 'linear',
			fill: 'forwards'
		});
		const unfollow = clock.follow(a);
		return () => {
			unfollow();
			a.cancel();
		};
	});
</script>

<span
	bind:this={ref}
	data-slot="toast-progress"
	aria-hidden="true"
	class={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
	{...restProps}
>
	<span bind:this={fill} class="block size-full origin-left bg-(--toast-wash,var(--muted)) rtl:origin-right"></span>
</span>
