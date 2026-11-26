import { getContext, setContext } from 'svelte';

/*
 * Shared between MeterField and its parts. Not exported from index.ts: the parts are the API.
 * The field hands out the ids, so the Meter is named by its MeterLabel and described by its
 * MeterValue without the consumer wiring ids. The Meter's tone reaches the MeterValue in CSS
 * (the field is a group, the value reads the meter's `data-tone`), with no script between them.
 */

/**
 * Where the value stands, from the thresholds (the HTML <meter> regions), mutually exclusive:
 * - `optimum`: in the preferred region (also: no thresholds given);
 * - `suboptimal`: one region away from it;
 * - `poor`: two regions away (only when the optimum lies beyond `low` or `high`).
 */
export type MeterTone = 'optimum' | 'suboptimal' | 'poor';

const KEY = Symbol('simon-lund.meter');

export class MeterFieldState {
	labelId: string;
	valueId: string;
	/**
	 * Whether the field has a MeterValue (then it describes the meter). Set while the MeterValue is
	 * set up, not in an effect, so the server-rendered page has it too.
	 */
	hasValue = $state(false);

	constructor(id: string) {
		this.labelId = `${id}-label`;
		this.valueId = `${id}-value`;
	}
}

export function setMeterFieldContext(id: string) {
	return setContext(KEY, new MeterFieldState(id));
}

export function useMeterFieldContext(): MeterFieldState | undefined {
	return getContext<MeterFieldState | undefined>(KEY);
}

/** The tone of `value` by the HTML <meter> rules (thresholds clamped into the range). */
export function meterTone(
	value: number,
	min: number,
	max: number,
	low?: number,
	high?: number,
	optimum?: number
): MeterTone {
	if (max < min) max = min;
	const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
	const v = clamp(value, min, max);
	const lo = clamp(low ?? min, min, max);
	const hi = clamp(high ?? max, lo, max);
	const opt = clamp(optimum ?? (min + max) / 2, min, max);
	if (opt < lo) {
		if (v <= lo) return 'optimum';
		return v <= hi ? 'suboptimal' : 'poor';
	}
	if (opt > hi) {
		if (v >= hi) return 'optimum';
		return v >= lo ? 'suboptimal' : 'poor';
	}
	return v >= lo && v <= hi ? 'optimum' : 'suboptimal';
}
