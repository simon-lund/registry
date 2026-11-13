import { getContext, setContext } from 'svelte';

/** One thing the agent reaches for, placed around it on the map: a tool (Files, Shell), a model, you. */
export interface AgentMapNode {
	id: string;
	label: string;
}

/** A call's one state. Blocked counts as failed: it did not do what was asked. */
export type AgentCallState = 'running' | 'done' | 'failed';

/** One call the agent made to a node, newest last. */
export interface AgentCall {
	id: string | number;
	/** The node it went to. */
	node: string;
	/** What it does, in a few words: "Run the test suite", "tests/setup.ts". */
	label: string;
	state: AgentCallState;
	/** How long it took, once it has ended. */
	ms?: number;
	/** The node it came from, when not the agent itself: a subagent (Agents) reading Files. */
	from?: string;
}

/** A duration as the log writes it: "600 ms" under a second, "1.5 s" above. */
export function duration(ms: number): string {
	return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;
}

/**
 * Where a node sits: evenly round the agent, the first at the top, clockwise; in % of the map.
 * `above`: its name goes above it, for the nodes well into the top half, so their names point away
 * from the agent and none falls on the node below; the sides keep theirs under them.
 */
export function place(index: number, count: number) {
	const angle = -Math.PI / 2 + (index / Math.max(1, count)) * Math.PI * 2;
	return { x: 50 + 37 * Math.cos(angle), y: 50 + 36 * Math.sin(angle), above: Math.sin(angle) < -0.5 };
}

export const CENTRE = { x: 50, y: 50 };

export interface MapProps {
	nodes: AgentMapNode[];
	calls: AgentCall[];
	context: number | null;
	selected: string | null;
}

/** The map's state, read straight from the root's props, so it renders on the server too. */
export class MapState {
	#props: () => MapProps;
	#onSelect: (id: string | null) => void;

	constructor(props: () => MapProps, onSelect: (id: string | null) => void) {
		this.#props = props;
		this.#onSelect = onSelect;
	}

	nodes = $derived.by(() => this.#props().nodes);
	calls = $derived.by(() => this.#props().calls);
	/** How full the agent's context is, 0 to 1; null when the app does not know. */
	context = $derived.by(() => this.#props().context);
	selected = $derived.by(() => this.#props().selected);

	byId = $derived(new Map(this.nodes.map((n) => [n.id, n])));
	/** Each node's position on the map, in %. */
	at = $derived(new Map(this.nodes.map((n, i) => [n.id, place(i, this.nodes.length)])));
	/** Per node: every call to it, the failed ones, and whether one is running now. */
	tally = $derived.by(() => {
		const out = new Map<string, { calls: number; failed: number; running: number }>();
		for (const n of this.nodes) out.set(n.id, { calls: 0, failed: 0, running: 0 });
		for (const c of this.calls) {
			const t = out.get(c.node);
			if (!t) continue;
			t.calls++;
			if (c.state === 'failed') t.failed++;
			if (c.state === 'running') t.running++;
		}
		return out;
	});
	running = $derived(this.calls.filter((c) => c.state === 'running'));
	/** Lines between two nodes, one per pair that has ever had a call; running while one is. */
	links = $derived.by(() => {
		const out = new Map<string, { from: string; to: string; running: boolean }>();
		for (const c of this.calls) {
			if (!c.from || !this.byId.has(c.from) || !this.byId.has(c.node)) continue;
			const key = `${c.from}>${c.node}`;
			const prev = out.get(key);
			out.set(key, { from: c.from, to: c.node, running: (prev?.running ?? false) || c.state === 'running' });
		}
		return [...out.values()];
	});

	label = (id: string) => this.byId.get(id)?.label ?? id;

	select(id: string | null) {
		this.#onSelect(id);
	}
}

const KEY = Symbol('agent-map');
export const setMap = (map: MapState) => setContext(KEY, map);
export function getMap(part: string): MapState {
	const map = getContext<MapState | undefined>(KEY);
	if (!map) throw new Error(`${part} works only inside AgentMap.`);
	return map;
}
