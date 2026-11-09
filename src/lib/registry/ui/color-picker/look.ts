// Shared looks of the ColorPicker's parts (file-local to the family).

/** The checkerboard under anything translucent: two quiet tones, 3 spacing steps a square. */
export const CHECKER =
	'repeating-conic-gradient(var(--card) 0 25%, color-mix(in oklab, var(--foreground) 12%, var(--card)) 0 50%) 0 0 / calc(var(--spacing) * 3) calc(var(--spacing) * 3)';

/** A colour over the checkerboard, for any preview of a colour that may be translucent. */
export const overChecker = (css: string) => `linear-gradient(${css}, ${css}), ${CHECKER}`;

/**
 * The hairline inside anything painted by the colour itself (area, tracks, swatches): foreground
 * at 10 %, so white stays apart from a light surface and black from a dark one.
 */
export const COLOR_HAIRLINE = 'shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_10%,transparent)]';

/** A 44px touch target around a smaller control. The control must be positioned. */
export const HIT_AREA =
	"before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-1/2 before:rounded-full before:content-['']";
