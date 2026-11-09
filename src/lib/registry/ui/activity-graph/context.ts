import { getContext, hasContext, setContext } from 'svelte';
import type { ActivityCell, ActivityModel } from './model.js';

/* Shared between the ActivityGraph parts. Not exported from index.ts: the parts are the API. */

export type ActivityGraphContext = {
	readonly model: ActivityModel;
	readonly locale: string;
	/** the cell that holds the grid's one tab stop (the newest until the reader moves) */
	readonly activeKey: string | null;
	cell(key: string): ActivityCell | undefined;
	setActive(key: string): void;
	/** whether an ActivityGraphCaption shows the selection (only then do cells show and expose it) */
	readonly selecting: boolean;
	/** the selected cell's key, or null; follows the roving focus and a tap */
	readonly selectedKey: string | null;
	/** the selected cell's words (its aria-label), or null */
	readonly selectedLabel: string | null;
	select(key: string, label: string | null): void;
	/** called by ActivityGraphCaption; returns its deregistration */
	registerCaption(): () => void;
};

const ROOT = Symbol('registry.activity-graph');

export function setActivityGraph(ctx: ActivityGraphContext) {
	setContext(ROOT, ctx);
}

export function getActivityGraph(part: string): ActivityGraphContext {
	if (!hasContext(ROOT)) throw new Error(`<${part}> must be used inside <ActivityGraph>`);
	return getContext(ROOT);
}
