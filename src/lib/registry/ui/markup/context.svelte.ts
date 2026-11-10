import { getContext, hasContext, setContext } from 'svelte';

/**
 * The tool in hand, or none: the page works as usual. Select comments on an element (the comment
 * is anchored to it); comment leaves a comment anywhere, a chat bubble; pen and shape draw.
 */
export type MarkupTool = 'select' | 'comment' | 'pen' | 'shape';

/** The kind the shape tool draws; a step is a numbered circle. */
export type MarkupShape = 'line' | 'arrow' | 'rectangle' | 'ellipse' | 'step';

/** The menu that is open, at most one. */
export type MarkupMenu = 'shapes' | 'colours' | 'widths';

type Bound<T> = { get: () => T; set: (value: T) => void };

/** The bar's state: what it shows and what its parts change. The root owns the values. */
export class MarkupState {
	#tool: Bound<MarkupTool | null>;
	#shape: Bound<MarkupShape>;
	#colour: Bound<string>;
	#width: Bound<number>;
	// The open comments' closers, the last opened last: Escape closes the newest first. A plain
	// list (an effect adds to it), with a reactive count for whoever asks.
	#comments: (() => void)[] = [];
	#open = $state(0);

	/** Marks this Markup's bar and comment boxes (`data-markup`), to tell them from another's. */
	readonly id: string;

	menu = $state<MarkupMenu | null>(null);

	constructor(opts: {
		id: string;
		tool: Bound<MarkupTool | null>;
		shape: Bound<MarkupShape>;
		colour: Bound<string>;
		width: Bound<number>;
	}) {
		this.id = opts.id;
		this.#tool = opts.tool;
		this.#shape = opts.shape;
		this.#colour = opts.colour;
		this.#width = opts.width;
	}

	get tool() {
		return this.#tool.get();
	}
	set tool(value) {
		this.#tool.set(value);
	}
	get shape() {
		return this.#shape.get();
	}
	set shape(value) {
		this.#shape.set(value);
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

	/** A comment is open: Escape has it to close. */
	get commenting() {
		return this.#open > 0;
	}

	/** An open comment takes its place on the Escape ladder; the returned function gives it up. */
	holdComment(close: () => void) {
		this.#comments.push(close);
		this.#open = this.#comments.length;
		return () => {
			const i = this.#comments.indexOf(close);
			if (i !== -1) this.#comments.splice(i, 1);
			this.#open = this.#comments.length;
		};
	}

	/** Takes up a tool; the active one again puts it down. */
	toggle(tool: MarkupTool) {
		this.tool = this.tool === tool ? null : tool;
	}

	/**
	 * Escape, as a ladder: an open menu closes; else the newest open comment; else the tool is put
	 * down. True when it did something (so the key is the bar's).
	 */
	escape(): boolean {
		if (this.menu) {
			this.menu = null;
			return true;
		}
		const close = this.#comments.at(-1);
		if (close) {
			close();
			return true;
		}
		if (this.tool) {
			this.tool = null;
			return true;
		}
		return false;
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
