/**
 * What a component is for, one each (no component in two, none in none), in the order the filter
 * shows them: input takes a value, navigation moves you through a page or a flow, display shows
 * data, feedback answers what happened, motion is a transition to put around your own content.
 */
export const categories = ['input', 'navigation', 'display', 'feedback', 'motion'] as const;
export type Category = (typeof categories)[number];

/** The book's contents: every plate. */
export interface Entry {
	/** The registry item's name, also the plate's path under /components. */
	name: string;
	title: string;
	/** One line: what it is, in the words of the plate. */
	tagline: string;
	category: Category;
}

export const components: Entry[] = [
	{
		name: 'activity-graph',
		title: 'Activity graph',
		tagline: 'A year of activity as a grid of days, one step of ink per level.',
		category: 'display'
	},
	{
		name: 'agent-tree',
		title: 'Agent tree',
		tagline: 'Coding agents as a process tree you can see and steer, with the rules Linux uses.',
		category: 'display'
	},
	{
		name: 'color-picker',
		title: 'Color picker',
		tagline: 'One colour out of a few as a row of swatches, or any other by its hex.',
		category: 'input'
	},
	{
		name: 'dial',
		title: 'Dial',
		tagline: 'A rotary knob over a few stops: drag it, click a mark or use the arrow keys.',
		category: 'input'
	},
	{
		name: 'middot',
		title: 'Middot',
		tagline: 'The separator between two pieces of meta, drawn so both sides get the same space.',
		category: 'display'
	},
	{
		name: 'number-input',
		title: 'Number input',
		tagline: 'A number you step with two chevrons or type; the digits roll to the new value.',
		category: 'input'
	},
	{
		name: 'scroll-map',
		title: 'Scroll map',
		tagline: 'A minimap beside a long scroll: one tick per section, and the part you are reading marked.',
		category: 'navigation'
	},
	{
		name: 'stepper',
		title: 'Stepper',
		tagline: 'A flow in steps: where you are, what is done, and the way back.',
		category: 'navigation'
	},
	{
		name: 'swap',
		title: 'Swap',
		tagline: 'A few things on one spot, one shown at a time, turning into each other in a blur.',
		category: 'motion'
	},
	{
		name: 'swipe-deck',
		title: 'Swipe deck',
		tagline: 'A stack of cards you decide on one at a time: swipe or use the buttons, and undo.',
		category: 'input'
	},
	{
		name: 'switch',
		title: 'Switch',
		tagline: 'An on and off whose knob stretches as you hold it and whose fill follows it across.',
		category: 'input'
	},
	{
		name: 'tabs',
		title: 'Tabs',
		tagline: 'Tabs whose highlight slides between them, with the label colour in step.',
		category: 'navigation'
	},
	{
		name: 'terminal',
		title: 'Terminal',
		tagline: 'A log viewer that renders terminal colours and follows the output.',
		category: 'display'
	},
	{
		name: 'textarea',
		title: 'Textarea',
		tagline: 'A text field with a resize grip you can also reach and move by keyboard.',
		category: 'input'
	},
	{
		name: 'time-wheel',
		title: 'Time wheel',
		tagline: 'A time you set by turning a wheel: flat, as on iOS, or a drum.',
		category: 'input'
	},
	{
		name: 'toast',
		title: 'Toast',
		tagline: 'A toast with undo, a draining bar for its time, and swipe to dismiss.',
		category: 'feedback'
	},
	{
		name: 'view-change',
		title: 'View change',
		tagline: 'New content comes in from the side its link sits on, so you can see where you went.',
		category: 'motion'
	},
	{
		name: 'voice-meter',
		title: 'Voice meter',
		tagline: 'A sound level as dots that stretch into bars: from a microphone, or any number you give it.',
		category: 'feedback'
	}
];

export const homepage = 'https://ui.simon-lund.com';

/** The command that installs an item. */
export const install = (name: string) => `pnpm dlx shadcn-svelte@latest add ${homepage}/r/${name}.json`;

/** shadcn-svelte's own components: an item needs them by bare name, from the consumer's registry. */
const stock = new Set(['button', 'input', 'spinner', 'tooltip']);

/** The command that installs what an item needs: an item of this registry, or a stock one. */
export const installNeed = (name: string) =>
	stock.has(name) ? `pnpm dlx shadcn-svelte@latest add ${name}` : install(name);
