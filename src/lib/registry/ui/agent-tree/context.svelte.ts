import { getContext, setContext } from 'svelte';
import type { Snippet } from 'svelte';

export type AgentState = 'working' | 'waiting' | 'needs-you' | 'paused' | 'done' | 'failed';

/** One agent, as a process: an id, a parent, exactly one state. You are process 1. */
export interface Agent {
	pid: number;
	ppid: number;
	name: string;
	task?: string;
	state: AgentState;
	/** The exit code once done (0) or failed (not 0). */
	exit?: number;
}

/** A socket between two siblings, opened by a shared ancestor. */
export interface Socket {
	a: number;
	b: number;
	name: string;
	by: number;
}

/** Two (or more) agents in one file: a conflict waiting to happen. */
export interface Collision {
	pids: number[];
	file: string;
}

/** The words for a state; a failed agent adds its exit code, the one number that says why. */
export function stateText(agent: Pick<Agent, 'state' | 'exit'>): string {
	switch (agent.state) {
		case 'needs-you':
			return 'needs you';
		case 'failed':
			return `failed, exit ${agent.exit ?? 1}`;
		default:
			return agent.state;
	}
}

export const finished = (state: AgentState) => state === 'done' || state === 'failed';

export class TreeState {
	agents: Agent[] = $state([]);
	sockets: Socket[] = $state([]);
	collisions: Collision[] = $state([]);
	selected: number | null = $state(null);
	/** The row that holds the tab stop (roving tabindex). */
	focused: number | null = $state(null);
	actions: Snippet<[Agent]> | undefined = $state();
	onSelect: ((pid: number | null) => void) | undefined;

	byPid = $derived(new Map(this.agents.map((a) => [a.pid, a])));
	/** Children in the order given. A parent that is not in the tree makes its child a root. */
	childrenOf = $derived.by(() => {
		const map = new Map<number, Agent[]>();
		for (const a of this.agents) {
			const parent = this.byPid.has(a.ppid) && a.ppid !== a.pid ? a.ppid : 0;
			map.set(parent, [...(map.get(parent) ?? []), a]);
		}
		return map;
	});
	roots = $derived(this.childrenOf.get(0) ?? []);
	/** Every pid in tree order, for the arrow keys. */
	order = $derived.by(() => {
		const out: number[] = [];
		const walk = (pid: number) => {
			for (const c of this.childrenOf.get(pid) ?? []) {
				out.push(c.pid);
				walk(c.pid);
			}
		};
		walk(0);
		return out;
	});
	/** What the selected agent steers: everything below it. */
	steers = $derived.by(() => {
		const set = new Set<number>();
		if (this.selected === null) return set;
		const walk = (pid: number) => {
			for (const c of this.childrenOf.get(pid) ?? []) {
				set.add(c.pid);
				walk(c.pid);
			}
		};
		walk(this.selected);
		return set;
	});
	/** Whom the selected agent reports to: everyone above it. */
	reportsTo = $derived.by(() => {
		const set = new Set<number>();
		let cur = this.selected === null ? undefined : this.byPid.get(this.selected);
		while (cur && this.byPid.has(cur.ppid) && cur.ppid !== cur.pid) {
			set.add(cur.ppid);
			cur = this.byPid.get(cur.ppid);
		}
		return set;
	});

	socketsOf(pid: number): Socket[] {
		return this.sockets.filter((s) => s.a === pid || s.b === pid);
	}
	collisionsOf(pid: number): Collision[] {
		return this.collisions.filter((c) => c.pids.includes(pid));
	}
	select(pid: number | null) {
		this.selected = pid;
		this.onSelect?.(pid);
	}
	/** Moves the tab stop by `delta` rows (keyboard moves are instant). */
	move(from: number, delta: number): number | null {
		const i = this.order.indexOf(from);
		if (i < 0) return null;
		const next = this.order[Math.min(this.order.length - 1, Math.max(0, i + delta))];
		this.focused = next;
		return next;
	}
}

const KEY = Symbol('agent-tree');
export const setTree = (tree: TreeState) => setContext(KEY, tree);
export const getTree = () => getContext<TreeState>(KEY);
