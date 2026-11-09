import { flushSync } from 'svelte';

/**
 * hiddenInputOf: the form input bits-ui renders for a control with a `name` (a visually hidden
 * `<input aria-hidden="true">` right after the control's root), or `null` when there is none
 * (no `name`, or a control that renders its own inputs elsewhere).
 *
 * @example
 * const input = hiddenInputOf(ref); // bits-ui's Checkbox, Switch, RadioGroup, RatingGroup, DateField
 */
export function hiddenInputOf(el: Element | null | undefined): HTMLInputElement | null {
	const next = el?.nextElementSibling;
	return next instanceof HTMLInputElement && next.getAttribute('aria-hidden') === 'true' ? next : null;
}

/**
 * restoreOnReset: on the owning form's `reset`, put a control back to the state it mounted with,
 * as a native control goes back to its `checked` / `value` attribute. bits-ui resets its hidden
 * input but not the drawn control; this resets the drawn one too.
 *
 * - The form is the hidden input's (`hiddenInputOf(el)`, so a `form="…"` attribute counts), else
 *   the closest `<form>` around `el`. No form: nothing to do.
 * - `setDefault(input)` runs once on the hidden input, if there is one: set its `defaultChecked`
 *   or `defaultValue` to the mount state, so the browser's own reset lands there too.
 * - `restore()` runs inside the `reset` event (before the browser resets the controls), unless
 *   the event was cancelled, and is flushed at once, so the form reads as reset as soon as
 *   `reset()` returns. Assign the mount state to the bound value there; do not call the
 *   control's change callback (a native reset fires none).
 * - Take the mount snapshot in the component (`mounted ??= untrack(…)`), not here: the effect
 *   re-runs when the hidden input comes and goes, and the snapshot must not.
 *
 * Call it from an `$effect` that reads `ref` (and the `name`, when the hidden input depends on
 * it); it returns the cleanup.
 *
 * @example
 * let mounted: boolean | undefined;
 * $effect(() => {
 *   void restProps.name; // the hidden input comes and goes with the name
 *   const el = ref;
 *   if (!el) return;
 *   const start = (mounted ??= untrack(() => !!checked));
 *   return restoreOnReset(el, () => (checked = start), (input) => (input.defaultChecked = start));
 * });
 */
export function restoreOnReset(
	el: Element,
	restore: () => void,
	setDefault?: (input: HTMLInputElement) => void
): () => void {
	const input = hiddenInputOf(el);
	if (input) setDefault?.(input);
	const form = input?.form ?? el.closest('form');
	if (!form) return () => {};
	const onreset = (e: Event) => {
		if (e.defaultPrevented) return;
		restore();
		try {
			flushSync();
		} catch {
			// reset() called inside an effect, where some Svelte versions refuse flushSync: the
			// value is set and draws with that effect's flush
		}
	};
	form.addEventListener('reset', onreset);
	return () => form.removeEventListener('reset', onreset);
}
