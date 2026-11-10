import { getContext, hasContext, setContext } from 'svelte';

type Bound<T> = { get: () => T; set: (value: T) => void };

/** One comment: open or closed, its text, and the pin its box floats from. The root owns the values. */
export class MarkupCommentState {
	#open: Bound<boolean>;
	#value: Bound<string>;
	#onOpenChange: () => ((open: boolean) => void) | undefined;
	#onSend: () => ((value: string) => void) | undefined;

	/** The box's id, for the pin's `aria-controls`. */
	readonly id: string;
	pin = $state<HTMLButtonElement | null>(null);

	constructor(opts: {
		id: string;
		open: Bound<boolean>;
		value: Bound<string>;
		onOpenChange: () => ((open: boolean) => void) | undefined;
		onSend: () => ((value: string) => void) | undefined;
	}) {
		this.id = opts.id;
		this.#open = opts.open;
		this.#value = opts.value;
		this.#onOpenChange = opts.onOpenChange;
		this.#onSend = opts.onSend;
	}

	get open() {
		return this.#open.get();
	}
	get value() {
		return this.#value.get();
	}
	set value(value) {
		this.#value.set(value);
	}

	/** Words in it. */
	get canSend() {
		return this.value.trim().length > 0;
	}

	/** Opens or closes the box; closed by the keyboard, focus goes back to the pin. */
	setOpen(open: boolean, returnFocus = false) {
		if (open === this.open) return;
		this.#open.set(open);
		this.#onOpenChange()?.(open);
		if (!open && returnFocus) this.pin?.focus();
	}

	/** Hands the text to the app and closes the box; the text stays, to open and change again. */
	send() {
		if (!this.canSend) return;
		this.#onSend()?.(this.value.trim());
		this.setOpen(false, true);
	}
}

const KEY = Symbol('registry.markup-comment');

export function setComment(state: MarkupCommentState) {
	setContext(KEY, state);
}

export function getComment(part: string): MarkupCommentState {
	if (!hasContext(KEY)) throw new Error(`<${part}> must be used inside <MarkupComment>`);
	return getContext(KEY);
}
