import { tv } from 'tailwind-variants';

/*
 * The level scale: tonal steps of ink, each one --foreground mixed into --muted, so it runs dark on
 * a light page and light on a dark one. Level 0 (nothing) stays a faint step above --muted, so an
 * empty day still shows on a muted surface and on a dark card, where --card equals --muted.
 * Checked in both themes: lightness is monotone with a step of at least 0.13 in oklab, and level 1
 * has at least 2:1 on the background, on muted and on the card.
 */
export const activityLevelVariants = tv({
	base: '',
	variants: {
		level: {
			0: 'bg-[color-mix(in_oklab,var(--foreground)_10%,var(--muted))]',
			1: 'bg-[color-mix(in_oklab,var(--foreground)_30%,var(--muted))]',
			2: 'bg-[color-mix(in_oklab,var(--foreground)_50%,var(--muted))]',
			3: 'bg-[color-mix(in_oklab,var(--foreground)_75%,var(--muted))]',
			4: 'bg-[color-mix(in_oklab,var(--foreground)_100%,var(--muted))]'
		}
	},
	defaultVariants: { level: 0 }
});

/** The levels in order, for a legend. */
export const ACTIVITY_LEVELS = [0, 1, 2, 3, 4] as const;
