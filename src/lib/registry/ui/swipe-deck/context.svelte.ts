import { getContext, hasContext, setContext } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

/*
 * Shared between the SwipeDeck parts. Not exported from index.ts beyond its types: the parts are
 * the API.
 *
 * The deck owns where every card is: the order (document order of the SwipeDeckCards), which ones
 * are gone, and a short history for undo. The consumer renders every card, always; the deck hides
 * the gone ones, so undo needs nothing from the consumer but its `onUndo`.
 *
 * Each SwipeDeckCard owns its own gesture and motion, and registers a handle the deck drives for
 * the buttons, the keys and undo. Each SwipeDeckLabel turns its direction on for its card: a
 * direction without a label can never commit, dragging toward it only rubber-bands, and its button
 * is disabled while that card is on top.
 */

/** Where a card can go, mutually exclusive. What each one means is the consumer's. */
export type SwipeDeckDirection = 'left' | 'right' | 'up';

/**
 * How a swipe happened, mutually exclusive: dragged past the threshold, flicked toward it, an
 * arrow key, a SwipeDeckAction, or a call to `swipe()` on the deck.
 */
export type SwipeDeckVia = 'drag' | 'flick' | 'keyboard' | 'button' | 'call';

/** How an undo happened, mutually exclusive: Backspace / ⌘Z / Ctrl+Z, SwipeDeckUndo, `undo()`. */
export type SwipeDeckUndoVia = 'keyboard' | 'button' | 'call';

/** A card's phase, mutually exclusive: at rest, under the finger, springing home or coming back, flying off, off the deck. */
export type SwipeDeckCardPhase = 'idle' | 'dragging' | 'settling' | 'leaving' | 'gone';

/** One step of the history: which card went where. */
export type SwipeDeckEntry = { card: string; direction: SwipeDeckDirection };

/** Return `false` to keep the card: it flies back onto the deck. */
export type SwipeDeckSwipeHandler = (
	card: string,
	direction: SwipeDeckDirection,
	detail: { via: SwipeDeckVia }
) => boolean | void;

export type SwipeDeckUndoHandler = (
	card: string,
	direction: SwipeDeckDirection,
	detail: { via: SwipeDeckUndoVia }
) => void;

/** What a SwipeDeckCard lets the deck do with it. */
export type SwipeDeckCardHandle = {
	readonly el: HTMLElement | null;
	/** The directions its labels turned on (reactive). */
	readonly directions: ReadonlyMap<SwipeDeckDirection, HTMLElement>;
	/** Send it off toward `direction`, as a release there would (buttons, keys, `swipe()`). */
	fly(direction: SwipeDeckDirection, via: SwipeDeckVia): void;
	/** Bring it back from where it left toward `direction`: the reverse motion. */
	comeBack(direction: SwipeDeckDirection): void;
};

/** The root's props, read lazily so they stay reactive. */
type SwipeDeckProps = {
	onSwipe: () => SwipeDeckSwipeHandler | undefined;
	onUndo: () => SwipeDeckUndoHandler | undefined;
	historyLimit: () => number;
	peek: () => number;
};

export class SwipeDeckState {
	order = $state<string[]>([]);
	readonly gone = new SvelteSet<string>();
	history = $state<SwipeDeckEntry[]>([]);
	readonly handles = new SvelteMap<string, SwipeDeckCardHandle>();
	announcement = $state('');
	root: HTMLElement | null = null;
	undoButton: HTMLElement | null = null;

	readonly remaining = $derived(this.order.filter((card) => !this.gone.has(card)));
	readonly top = $derived(this.remaining[0] ?? null);
	readonly topHandle = $derived(this.top === null ? null : (this.handles.get(this.top) ?? null));
	readonly canUndo = $derived(this.history.length > 0);

	#props: SwipeDeckProps;

	constructor(props: SwipeDeckProps) {
		this.#props = props;
	}

	get peek() {
		return this.#props.peek();
	}

	/** Called by SwipeDeckCard while it initialises; returns the deregistration. */
	register(card: string, handle: SwipeDeckCardHandle) {
		if (this.handles.has(card)) console.warn(`<SwipeDeckCard value="${card}"> is used twice`);
		this.handles.set(card, handle);
		if (!this.order.includes(card)) this.order.push(card);
		return () => {
			if (this.handles.get(card) !== handle) return;
			this.handles.delete(card);
			this.order = this.order.filter((c) => c !== card);
			this.gone.delete(card);
			this.history = this.history.filter((e) => e.card !== card);
		};
	}

	/** Keep `order` in document order once the cards' elements exist (a card inserted mid-list). */
	sortByDocument() {
		const els = this.order.map((c) => this.handles.get(c)?.el ?? null);
		if (els.some((el) => !el)) return;
		const sorted = [...this.order].sort((a, b) => {
			const ea = this.handles.get(a)!.el!;
			const eb = this.handles.get(b)!.el!;
			return ea.compareDocumentPosition(eb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
		});
		if (sorted.some((c, i) => c !== this.order[i])) this.order = sorted;
	}

	depthOf(card: string) {
		return this.remaining.indexOf(card);
	}

	can(direction: SwipeDeckDirection) {
		return this.topHandle?.directions.has(direction) ?? false;
	}

	/**
	 * The way the cards behind follow the top card: 0 at rest, 1 once it has reached its threshold.
	 * `driving` turns the stack's own transitions off while the gesture writes it every frame.
	 */
	setPull(pull: number, driving: boolean) {
		const root = this.root;
		if (!root) return;
		root.style.setProperty('--swipe-deck-pull', pull.toFixed(3));
		if (driving) root.setAttribute('data-pulling', '');
		else root.removeAttribute('data-pulling');
	}

	/**
	 * A card has started leaving toward `direction`: it is off the deck at once (the next card rises
	 * while it flies). Returns `false` when the consumer kept it.
	 */
	commit(card: string, direction: SwipeDeckDirection, via: SwipeDeckVia) {
		if (this.gone.has(card)) return false;
		this.gone.add(card);
		const limit = this.#props.historyLimit();
		this.history = limit > 0 ? [...this.history, { card, direction }].slice(-limit) : [];
		const keep = this.#props.onSwipe()?.(card, direction, { via });
		if (keep === false) {
			this.gone.delete(card);
			this.history = this.history.filter((e) => e.card !== card);
			return false;
		}
		this.announce(this.handles.get(card)?.directions.get(direction)?.textContent?.trim() ?? '');
		return true;
	}

	/** The top card leaves toward `direction`, if its labels allow it. */
	swipe(direction: SwipeDeckDirection, via: SwipeDeckVia) {
		const handle = this.topHandle;
		if (!handle?.directions.has(direction)) return false;
		handle.fly(direction, via);
		return true;
	}

	/** The last swiped card comes back on top, with the reverse motion. */
	undo(via: SwipeDeckUndoVia) {
		const last = this.history.at(-1);
		if (!last) return false;
		this.history = this.history.slice(0, -1);
		this.gone.delete(last.card);
		this.handles.get(last.card)?.comeBack(last.direction);
		this.#props.onUndo()?.(last.card, last.direction, { via });
		return true;
	}

	/** Where focus goes when the control that held it is disabled: undo while it can act, else the deck. */
	focusFallback() {
		const target = this.canUndo && this.undoButton ? this.undoButton : this.root;
		target?.focus();
	}

	// The same words twice in a row must still be read: alternate a trailing no-break space.
	#flip = false;
	announce(text: string) {
		this.#flip = !this.#flip;
		this.announcement = text ? text + (this.#flip ? '\u00a0' : '') : '';
	}
}

/** A `--dur-*` variable on `node`, in ms, for motion driven from script. */
export function motionMs(node: Element | null, name: `--${string}`, fallback: number) {
	if (!node) return fallback;
	const raw = getComputedStyle(node).getPropertyValue(name).trim();
	const n = parseFloat(raw);
	if (!Number.isFinite(n)) return fallback;
	return raw.endsWith('ms') ? n : n * 1000;
}

const DECK = Symbol('registry.swipe-deck');
const CARD = Symbol('registry.swipe-deck-card');

export function setSwipeDeck(deck: SwipeDeckState) {
	setContext(DECK, deck);
	return deck;
}

export function getSwipeDeck(part: string): SwipeDeckState {
	if (!hasContext(DECK)) throw new Error(`<${part}> must be used inside <SwipeDeck>`);
	return getContext(DECK);
}

/** What a SwipeDeckLabel reads from its card. */
export type SwipeDeckCardContext = {
	/** Which way the card is displaced right now; `null` at rest. */
	readonly direction: SwipeDeckDirection | null;
	/** The direction a release would commit to now; `null` if none. */
	readonly armed: SwipeDeckDirection | null;
	/** Called by SwipeDeckLabel; returns the deregistration. */
	registerLabel(direction: SwipeDeckDirection, el: HTMLElement): () => void;
};

export function setSwipeDeckCard(ctx: SwipeDeckCardContext) {
	setContext(CARD, ctx);
}

export function getSwipeDeckCard(part: string): SwipeDeckCardContext {
	if (!hasContext(CARD)) throw new Error(`<${part}> must be used inside <SwipeDeckCard>`);
	return getContext(CARD);
}
