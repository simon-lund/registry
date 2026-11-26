import type { FilterColumn, FilterRow } from '#lib/registry/ui/filter-matrix/index.js';

// A few tasks, kept in one place so every example filters the same ones.
export interface Task {
	title: string;
	area: string;
	status: string;
}

export const areas: FilterRow[] = [
	{ id: 'work', label: 'Work' },
	{ id: 'home', label: 'Home' },
	{ id: 'health', label: 'Health' },
	{ id: 'money', label: 'Money' },
	{ id: 'learning', label: 'Learning' }
];

export const statuses: FilterColumn[] = [
	{ id: 'open', label: 'Open' },
	{ id: 'doing', label: 'Doing' },
	{ id: 'done', label: 'Done' }
];

export const tasks: Task[] = [
	{ title: 'Send the quarterly report', area: 'work', status: 'doing' },
	{ title: 'Reply to the contract', area: 'work', status: 'open' },
	{ title: 'Plan the team day', area: 'work', status: 'open' },
	{ title: 'Review two pull requests', area: 'work', status: 'done' },
	{ title: 'Fix the login bug', area: 'work', status: 'done' },
	{ title: 'Book the plumber', area: 'home', status: 'open' },
	{ title: 'Paint the hallway', area: 'home', status: 'doing' },
	{ title: 'Change the bulbs', area: 'home', status: 'done' },
	{ title: 'Call the dentist', area: 'health', status: 'open' },
	{ title: 'Run twice this week', area: 'health', status: 'doing' },
	{ title: 'Renew the prescription', area: 'health', status: 'done' },
	{ title: 'File the tax return', area: 'money', status: 'doing' },
	{ title: 'Cancel the old gym', area: 'money', status: 'open' },
	{ title: 'Pay the invoice', area: 'money', status: 'done' },
	{ title: 'Read chapter four', area: 'learning', status: 'open' },
	{ title: 'Finish the Svelte course', area: 'learning', status: 'doing' }
];

/** The count of tasks in each cell, by `cellKey(area, status)`. */
export function countTasks(list: Task[]): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const t of list) counts[`${t.area}|${t.status}`] = (counts[`${t.area}|${t.status}`] ?? 0) + 1;
	return counts;
}

/** What a cell holds, in words: for the screen reader and the tooltip. */
export function describe(info: { row?: FilterRow; column?: FilterColumn; count: number }): string {
	const what = [info.row?.label, info.column?.label].filter(Boolean).join(', ') || 'All tasks';
	return `${what}: ${info.count} ${info.count === 1 ? 'task' : 'tasks'}`;
}
