// A few tasks, kept in one place so every example filters the same ones.
export interface Task {
	title: string;
	area: string;
	status: string;
}

export const areas = [
	{ id: 'work', label: 'Work' },
	{ id: 'home', label: 'Home' },
	{ id: 'health', label: 'Health' },
	{ id: 'money', label: 'Money' },
	{ id: 'learning', label: 'Learning' }
];

export const statuses = [
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

/** How many tasks lie in an area, in a status, in both, or anywhere (neither given). */
export const count = (area?: string, status?: string) =>
	tasks.filter((t) => (area === undefined || t.area === area) && (status === undefined || t.status === status)).length;

/** "1 task", "5 tasks". */
export const inWords = (n: number) => `${n} ${n === 1 ? 'task' : 'tasks'}`;
