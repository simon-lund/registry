/** The book's contents: every plate. */
export interface Entry {
	/** The registry item's name, also the plate's path under /components. */
	name: string;
	title: string;
	/** One line: what it is, in the words of the plate. */
	tagline: string;
}

export const components: Entry[] = [
	{
		name: 'number-input',
		title: 'Number input',
		tagline: 'A number you step with two chevrons or type; the digits roll to the new value.'
	},
	{
		name: 'time-wheel',
		title: 'Time wheel',
		tagline: 'A time you set by turning a wheel: flat, as on iOS, or a drum.'
	},
	{
		name: 'agent-tree',
		title: 'Agent tree',
		tagline: 'Coding agents as a process tree you can see and steer, with the rules Linux uses.'
	}
];

export const homepage = 'https://ui.simon-lund.com';

/** The command that installs an item. */
export const install = (name: string) => `pnpm dlx shadcn-svelte@latest add ${homepage}/r/${name}.json`;
