/** The side a view comes in from. */
export type ViewSide = 'left' | 'right';

/**
 * The side the view for `next` arrives from, given the entries' `order` from left to right (a
 * segmented control's segments, a settings app's sections): the next one from the right, an
 * earlier one from the left. `left` when either is not in the order (a page reached from a
 * sidebar comes from the sidebar's side) or when nothing changed.
 *
 * @example
 * const from = sideOf(['/profile', '/general', '/billing'], '/profile', '/billing'); // 'right'
 */
export function sideOf(
	order: readonly string[],
	prev: string | null | undefined,
	next: string
): ViewSide {
	const a = prev == null ? -1 : order.indexOf(prev);
	const b = order.indexOf(next);
	if (a < 0 || b < 0) return 'left';
	return b > a ? 'right' : 'left';
}
