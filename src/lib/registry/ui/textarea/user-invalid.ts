import type { Attachment } from 'svelte/attachments';

// `:user-invalid` is Baseline Widely available; where a browser lacks it the attachment does nothing.
const supported = typeof CSS !== 'undefined' && !!CSS.supports?.('selector(:user-invalid)');

/**
 * userInvalid: keeps `aria-invalid` in step with the browser's own `:user-invalid`, so the field
 * is ringed and assistive technology learns that it is wrong after it was left wrong (blur) or a
 * submit was tried (`invalid`), and no longer once it is fixed (`input`, `change`) or the form is
 * reset. Before any interaction it sets nothing.
 *
 * Textarea attaches it while the consumer passes no `aria-invalid`. A consumer that passes
 * `aria-invalid` (true or false) owns the state.
 */
export const userInvalid: Attachment<HTMLTextAreaElement> = (node) => {
	if (!supported) return;

	const sync = () => {
		if (node.matches(':user-invalid')) node.setAttribute('aria-invalid', 'true');
		else node.removeAttribute('aria-invalid');
	};
	// Once flagged, every edit re-checks, so the state clears the moment the value is valid.
	const recheck = () => {
		if (node.hasAttribute('aria-invalid')) sync();
	};
	// A submit attempt fires `invalid` on each failing control; the frame after, the browser has
	// settled `:user-invalid` (a script's own checkValidity() fires `invalid` too, but draws nothing,
	// so the frame check keeps the two in step).
	let frame = 0;
	const onInvalid = () => {
		cancelAnimationFrame(frame);
		sync();
		frame = requestAnimationFrame(sync);
	};
	// `reset` fires before the form resets its controls.
	const form = node.form;
	const onReset = () => setTimeout(sync);

	node.addEventListener('blur', sync);
	node.addEventListener('input', recheck);
	node.addEventListener('change', recheck);
	node.addEventListener('invalid', onInvalid);
	form?.addEventListener('reset', onReset);
	return () => {
		cancelAnimationFrame(frame);
		node.removeEventListener('blur', sync);
		node.removeEventListener('input', recheck);
		node.removeEventListener('change', recheck);
		node.removeEventListener('invalid', onInvalid);
		form?.removeEventListener('reset', onReset);
	};
};
