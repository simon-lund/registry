/** The book's contents: every plate. */
export interface Entry {
	/** The registry item's name, also the plate's path under /components. */
	name: string;
	title: string;
	/** One line: what it is, in the words of the plate. */
	tagline: string;
	/** Shown large and working under Examples, at the top of the index. */
	featured?: boolean;
	/**
	 * Which list it sits in, as shadcn's docs split the generic components from the AI ones:
	 * `components` (default) are generic, `ai` are for building with models and agents.
	 */
	group?: Group;
}

export type Group = 'components' | 'ai';

/** The groups, in the order the sidebar and the index show them. */
export const groups: { id: Group; title: string }[] = [
	{ id: 'components', title: 'Components' },
	{ id: 'ai', title: 'AI' }
];

export const components: Entry[] = [
	{
		name: 'activity-graph',
		title: 'Activity graph',
		tagline: 'A year of activity as a grid of days, one step of ink per level.'
	},
	{
		name: 'agent-map',
		group: 'ai',
		title: 'Agent map',
		tagline: 'What an agent is working on: what it reaches for round it, every call going out along a line.',
		featured: true
	},
	{
		name: 'agent-tree',
		group: 'ai',
		title: 'Agent tree',
		tagline: 'Coding agents as a process tree you can see and steer, with the rules Linux uses.',
		featured: true
	},
	{
		name: 'chain-of-thought',
		group: 'ai',
		title: 'Chain of thought',
		tagline: 'What an assistant did on the way to its answer, folded under one line, the step under way in copper.'
	},
	{
		name: 'checkbox',
		title: 'Checkbox',
		tagline: 'A box whose tick draws itself in, and whose copper grows from the centre.'
	},
	{
		name: 'color-picker',
		title: 'Color picker',
		tagline: 'One colour out of a few as a row of swatches, or any other by its hex.'
	},
	{
		name: 'dial',
		title: 'Dial',
		tagline: 'A rotary knob over a few stops: drag it, click a mark or use the arrow keys.'
	},
	{
		name: 'filter-matrix',
		title: 'Filter matrix',
		tagline: 'Two filters as one grid, such as area against status: a count in every cell, the totals at the ends, a click to pick.'
	},
	{
		name: 'markup',
		title: 'Markup',
		tagline: 'A mark-up tool\'s parts: its bar, the outline on an element, handles on a mark, numbered comments.'
	},
	{
		name: 'meter',
		title: 'Meter',
		tagline: 'A value in a known range, such as storage used or a limit: where a measurement stands, not how far work has got.'
	},
	{
		name: 'middot',
		title: 'Middot',
		tagline: 'The separator between two pieces of meta, drawn so both sides get the same space.'
	},
	{
		name: 'number-input',
		title: 'Number input',
		tagline: 'A number you step with two chevrons or type; the digits roll to the new value.'
	},
	{
		name: 'rating',
		title: 'Rating',
		tagline: 'A score in copper stars: hover to preview, half stars, and the fill sweeps along the row.'
	},
	{
		name: 'scroll-map',
		title: 'Scroll map',
		tagline: 'A minimap beside a long scroll: one tick per section, and the part you are reading marked.'
	},
	{
		name: 'stepper',
		title: 'Stepper',
		tagline: 'A flow in steps: where you are, what is done, and the way back.'
	},
	{
		name: 'swap',
		title: 'Swap',
		tagline: 'A few things on one spot, one shown at a time, turning into each other in a blur.'
	},
	{
		name: 'swipe-deck',
		title: 'Swipe deck',
		tagline: 'A stack of cards you decide on one at a time: swipe or use the buttons, and undo.'
	},
	{
		name: 'switch',
		title: 'Switch',
		tagline: 'An on and off whose knob stretches as you hold it and whose fill follows it across.'
	},
	{
		name: 'tabs',
		title: 'Tabs',
		tagline: 'Tabs whose highlight slides between them, with the label colour in step.'
	},
	{
		name: 'terminal',
		title: 'Terminal',
		tagline: 'A log viewer that renders terminal colours and follows the output.'
	},
	{
		name: 'textarea',
		title: 'Textarea',
		tagline: 'A text field with a resize grip you can also reach and move by keyboard.'
	},
	{
		name: 'time-wheel',
		title: 'Time wheel',
		tagline: 'A time you set by turning a wheel: flat, as on iOS, or a drum.'
	},
	{
		name: 'toast',
		title: 'Toast',
		tagline: 'A toast with undo, a draining bar for its time, and swipe to dismiss.'
	},
	{
		name: 'view-change',
		title: 'View change',
		tagline: 'New content comes in from the side its link sits on, so you can see where you went.'
	},
	{
		name: 'voice-meter',
		title: 'Voice meter',
		tagline: 'A sound level as dots that stretch into bars: from a microphone, or any number you give it.'
	}
];

/** The entries of one group. */
export const inGroup = (group: Group) => components.filter((c) => (c.group ?? 'components') === group);

export const homepage = 'https://ui.simon-lund.com';

/** The command that installs an item. */
export const install = (name: string) => `pnpm dlx shadcn-svelte@latest add ${homepage}/r/${name}.json`;

/** shadcn-svelte's own components: an item needs them by bare name, from the consumer's registry. */
const stock = new Set(['button', 'input', 'popover', 'spinner', 'tooltip']);

/** The command that installs what an item needs: an item of this registry, or a stock one. */
export const installNeed = (name: string) =>
	stock.has(name) ? `pnpm dlx shadcn-svelte@latest add ${name}` : install(name);
