<script lang="ts">
	import { cn } from '#lib/utils.js';

	/**
	 * A number whose digits roll to the new value, as an odometer does: each digit is a column of
	 * 0 to 9 that slides, so you see what changed and which way. Digits that appear or go grow or
	 * shrink in width, so the neighbours glide rather than jump. Prior art: NumberFlow (Maxwell
	 * Barvian). Reduced motion turns the rolling off.
	 */
	interface Props {
		value: number;
		/** BCP 47 tag; the browser's language by default. */
		locale?: string;
		/** Intl.NumberFormat options, e.g. { style: 'currency', currency: 'EUR' }. */
		format?: Intl.NumberFormatOptions;
		class?: string;
	}

	let { value, locale, format, class: className }: Props = $props();

	const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

	interface Piece {
		/** Stable across values: the kind of part and its position from the right. */
		key: string;
		text: string;
		/** Set for a digit: the column rolls to it. */
		digit?: number;
	}

	const formatter = $derived(new Intl.NumberFormat(locale, format));
	const text = $derived(formatter.format(value));

	// Pieces keyed from the right, so "99" → "100" keeps both existing digit columns and grows
	// a new one on the left. Non-digit parts (the sign, the decimal mark, a currency) keep a key
	// of their kind, so they stay put while the digits roll.
	const pieces = $derived.by(() => {
		const parts = formatter.formatToParts(value);
		const out: Piece[] = [];
		const seen: Record<string, number> = {};
		for (const p of parts) {
			if (p.type === 'integer' || p.type === 'fraction') {
				for (const ch of p.value) {
					const d = DIGITS.indexOf(ch);
					out.push({ key: '', text: ch, digit: d >= 0 ? d : undefined });
				}
			} else {
				out.push({ key: '', text: p.value });
			}
		}
		// key by position from the right, per kind
		for (let i = out.length - 1; i >= 0; i--) {
			const kind = out[i].digit === undefined ? `t:${out[i].text}` : 'd';
			seen[kind] = (seen[kind] ?? 0) + 1;
			out[i].key = `${kind}:${seen[kind]}`;
		}
		return out;
	});

	// A column that appears grows from nothing to its width; one that goes shrinks away.
	function grow(node: HTMLElement, { duration = 500 } = {}) {
		const width = node.getBoundingClientRect().width;
		return {
			duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : duration,
			easing: (t: number) => 1 - Math.pow(1 - t, 4),
			css: (t: number) => `width: ${t * width}px; opacity: ${t}`
		};
	}
</script>

<span class={cn('number inline-flex items-center whitespace-nowrap tabular-nums', className)}>
	<span class="sr-only">{text}</span>
	<span aria-hidden="true" class="inline-flex items-center">
		{#each pieces as piece (piece.key)}
			{#if piece.digit !== undefined}
				<span class="digit" transition:grow>
					<span class="roll" style="--d: {piece.digit}">
						{#each DIGITS as d (d)}<span class="slot">{d}</span>{/each}
					</span>
				</span>
			{:else}
				<span class="slot inline-block overflow-hidden" transition:grow>{piece.text}</span>
			{/if}
		{/each}
	</span>
</span>

<style>
	/* Every piece sits in a slot 1.2em high, the glyph centred in it, so digits and the marks
	   between them share one baseline and a rolling digit has room above and below. */
	.number {
		--slot: 1.2em;
		line-height: var(--slot);
	}
	/* One digit: a window one slot high over a column of ten; the column slides by whole slots. */
	.digit {
		display: inline-block;
		position: relative;
		height: var(--slot);
		width: 1ch;
		overflow: hidden;
		/* the edges fade, so a digit arrives rather than pops; the glyph itself stays clear */
		mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
	}
	.roll {
		display: flex;
		flex-direction: column;
		transform: translateY(calc(var(--d) * -1 * var(--slot)));
		transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.slot {
		display: block;
		height: var(--slot);
		text-align: center;
	}
	@media (prefers-reduced-motion: reduce) {
		.roll {
			transition: none;
		}
	}
</style>
