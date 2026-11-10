import { getContext, hasContext, setContext } from 'svelte';

/** The tool in hand, or none: the page works as usual. */
export type MarkupTool = 'select' | 'pen';

/** Mutually exclusive: ready to send, sending, or the last send failed (the note is kept). */
export type MarkupStatus = 'ready' | 'sending' | 'failed';

/** The menu that is open, at most one. */
export type MarkupMenu = 'colours' | 'widths';

type Bound<T> = { get: () => T; set: (value: T) => void };

/** The bar's state: what it shows and what its parts change. The root owns the values. */
export class MarkupState {
	#tool: Bound<MarkupTool | null>;
	#colour: Bound<string>;
	#width: Bound<number>;
	#note: Bound<string>;
	#onSend: () => ((note: string) => void | Promise<void>) | undefined;

	status = $state<MarkupStatus>('ready');
	menu = $state<MarkupMenu | null>(null);

	constructor(opts: {
		tool: Bound<MarkupTool | null>;
		colour: Bound<string>;
		width: Bound<number>;
		note: Bound<string>;
		onSend: () => ((note: string) => void | Promise<void>) | undefined;
	}) {
		this.#tool = opts.tool;
		this.#colour = opts.colour;
		this.#width = opts.width;
		this.#note = opts.note;
		this.#onSend = opts.onSend;
	}

	get tool() {
		return this.#tool.get();
	}
	set tool(value) {
		this.#tool.set(value);
	}
	get colour() {
		return this.#colour.get();
	}
	set colour(value) {
		this.#colour.set(value);
	}
	get width() {
		return this.#width.get();
	}
	set width(value) {
		this.#width.set(value);
	}
	get note() {
		return this.#note.get();
	}
	set note(value) {
		this.#note.set(value);
	}

	/** Something to send: a note with words in it, and not already on its way. */
	get canSend() {
		return this.note.trim().length > 0 && this.status !== 'sending';
	}

	/** Takes up a tool; the active one again puts it down. */
	toggle(tool: MarkupTool) {
		this.tool = this.tool === tool ? null : tool;
	}

	/**
	 * Escape, as a ladder: an open menu closes; else the tool is put down. True when it did
	 * something (so the key is the bar's).
	 */
	escape(): boolean {
		if (this.menu) {
			this.menu = null;
			return true;
		}
		if (this.tool) {
			this.tool = null;
			return true;
		}
		return false;
	}

	/** Hands the note to the consumer; sent, it clears; failed, it stays for a retry. */
	async send() {
		const onSend = this.#onSend();
		if (!this.canSend || !onSend) return;
		this.status = 'sending';
		try {
			await onSend(this.note.trim());
			this.note = '';
			this.status = 'ready';
		} catch {
			this.status = 'failed';
		}
	}
}

const KEY = Symbol('registry.markup');

export function setMarkup(state: MarkupState) {
	setContext(KEY, state);
}

export function getMarkup(part: string): MarkupState {
	if (!hasContext(KEY)) throw new Error(`<${part}> must be used inside <Markup>`);
	return getContext(KEY);
}
