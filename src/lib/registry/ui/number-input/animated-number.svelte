<script lang="ts">
	import NumberFlow from '@number-flow/svelte';
	import { cn } from '#lib/utils.js';

	/**
	 * A number whose digits roll to the new value, as an odometer does, so you see what changed and
	 * which way. The motion is NumberFlow's (Maxwell Barvian): a spring on the Web Animations API,
	 * digits that appear or go grow and shrink so the neighbours glide, still under reduced motion.
	 * This wrapper gives it the registry's props; type and colour come from where it sits.
	 */
	interface Props {
		value: number;
		/** BCP 47 tag; the browser's language by default. */
		locale?: string;
		/** Intl.NumberFormat options, e.g. { style: 'currency', currency: 'EUR' }. */
		format?: Intl.NumberFormatOptions;
		/** Which way the digits spin: 1 up, -1 down, 0 each its shortest way. By default, the way the value moved. */
		trend?: -1 | 0 | 1;
		class?: string;
	}

	let { value, locale, format, trend, class: className }: Props = $props();

	// NumberFlow's own default trend follows the change; pass ours only when it is set.
	const extra = $derived(trend === undefined ? {} : { trend });
</script>

<NumberFlow {value} locales={locale} {format} {...extra} class={cn('tabular-nums', className)} />
