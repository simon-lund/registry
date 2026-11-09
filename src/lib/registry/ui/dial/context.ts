import { getContext, hasContext, setContext } from 'svelte';

// Shared between the Dial parts. Not exported from index.ts: the parts are the API.
export type DialContext = {
	/** The snap values, ascending: the only values the dial can take. */
	readonly stops: number[];
	/** The index of the stop the value is on. */
	readonly index: number;
	/** The sweep in degrees and the angle of the first stop (0 = 12 o'clock, clockwise). */
	readonly sweep: number;
	readonly start: number;
	/** The angle of stop `i`. */
	angleOf(i: number): number;
	/** The index of the stop with this value, or -1. */
	indexOf(value: number): number;
};

const KEY = Symbol('registry.dial');

export function setDial(ctx: DialContext) {
	setContext(KEY, ctx);
}

export function getDial(part: string): DialContext {
	if (!hasContext(KEY)) throw new Error(`<${part}> must be used inside <Dial>`);
	return getContext(KEY);
}

/** Where a point at `angle` (degrees, clockwise from 12 o'clock) sits, as fractions of the dial. */
export function polar(angle: number) {
	const rad = (angle * Math.PI) / 180;
	return { x: Math.sin(rad), y: -Math.cos(rad) };
}
