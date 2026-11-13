import type { AgentCall, AgentMapNode } from '#lib/registry/ui/agent-map/index.js';

// A made-up run, step by step, for the book's examples: a message, a look at memory, a few model
// steps, files, a test run that fails, two subagents, a delete the hook blocks, a push.

export const nodes: AgentMapNode[] = [
	{ id: 'you', label: 'You' },
	{ id: 'model', label: 'Model' },
	{ id: 'memory', label: 'Memory' },
	{ id: 'files', label: 'Files' },
	{ id: 'shell', label: 'Shell' },
	{ id: 'network', label: 'Network' },
	{ id: 'browser', label: 'Browser' },
	{ id: 'agents', label: 'Agents' },
	{ id: 'skills', label: 'Skills' },
	{ id: 'hooks', label: 'Hooks' }
];

type Step =
	| { start: string; node: string; label: string; from?: string }
	| { end: string; ms?: number; failed?: boolean };

const script: Step[] = [
	{ start: 'y1', node: 'you', label: 'New message' },
	{ end: 'y1' },
	{ start: 'h1', node: 'hooks', label: 'Add memory to the message' },
	{ end: 'h1', ms: 40 },
	{ start: 'r1', node: 'memory', label: 'Search: 3 records' },
	{ end: 'r1', ms: 120 },
	{ start: 'm1', node: 'model', label: 'opus 5.5 · step 1' },
	{ end: 'm1', ms: 1000 },
	{ start: 'f1', node: 'files', label: 'Grep: retries' },
	{ start: 'f2', node: 'files', label: 'auth/tokens.ts' },
	{ end: 'f1', ms: 300 },
	{ end: 'f2', ms: 520 },
	{ start: 'm2', node: 'model', label: 'opus 5.5 · step 2' },
	{ end: 'm2', ms: 700 },
	{ start: 's1', node: 'shell', label: 'Run the test suite' },
	{ start: 'n1', node: 'network', label: 'docs.example.com' },
	{ end: 'n1', ms: 600 },
	{ end: 's1', ms: 1500, failed: true },
	{ start: 'k1', node: 'skills', label: 'code-review' },
	{ end: 'k1', ms: 200 },
	{ start: 'a1', node: 'agents', label: 'Read the cookie docs' },
	{ start: 'a2', node: 'agents', label: 'Explore the test suite' },
	{ start: 'm3', node: 'model', label: 'haiku 5.5 · subagent', from: 'agents' },
	{ start: 'f3', node: 'files', label: 'docs/cookies.md', from: 'agents' },
	{ end: 'm3', ms: 850 },
	{ end: 'f3', ms: 700 },
	{ start: 'f4', node: 'files', label: 'tests/setup.ts', from: 'agents' },
	{ end: 'f4', ms: 300 },
	{ end: 'a1', ms: 4900 },
	{ end: 'a2', ms: 5200 },
	{ start: 'm4', node: 'model', label: 'fable 5.2 · step 7' },
	{ end: 'm4', ms: 600 },
	{ start: 's2', node: 'shell', label: 'Clear the build folder' },
	{ start: 'h2', node: 'hooks', label: 'Blocked: recursive delete needs a review' },
	{ end: 'h2', ms: 30, failed: true },
	{ end: 's2', ms: 120, failed: true },
	{ start: 's3', node: 'shell', label: 'Run the test suite' },
	{ start: 'b1', node: 'browser', label: 'localhost:3000' },
	{ end: 'b1', ms: 1200 },
	{ end: 's3', ms: 1200 },
	{ start: 'n2', node: 'network', label: 'Push the branch' },
	{ end: 'n2', ms: 400 },
	{ start: 'y2', node: 'you', label: 'Answer ready' },
	{ end: 'y2' }
];

export const steps = script.length;

/** The calls after the first `n` steps of the run, and how full the context is by then. */
export function at(n: number): { calls: AgentCall[]; context: number } {
	const calls: AgentCall[] = [];
	for (const s of script.slice(0, n)) {
		if ('start' in s) calls.push({ id: s.start, node: s.node, label: s.label, from: s.from, state: 'running' });
		else {
			const c = calls.find((c) => c.id === s.end);
			if (c) Object.assign(c, { state: s.failed ? 'failed' : 'done', ms: s.ms });
		}
	}
	return { calls, context: 0.42 + (0.45 * Math.min(n, steps)) / steps };
}
