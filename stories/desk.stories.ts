import type { Meta, StoryObj } from '@storybook/html-vite';
import { showcase, type Showcase } from './showcase';

const meta: Meta = { title: 'Desk' };
export default meta;

// Each story writes its name out: Storybook reads names from the source, not at runtime.
const show = (s: Pick<Showcase, 'title' | 'text' | 'src'>) =>
	showcase({
		status: 'In development',
		project: 'Engineering · My port of refine to Svelte · Svelte 5, SvelteKit',
		frame: 'desktop',
		note: 'The example runs on Desk with its backend in your browser. Reset demo in the sidebar starts over.',
		...s,
	});

export const Refine: StoryObj = {
	name: 'refine, ported to Svelte',
	render: () =>
		show({
			title: 'refine, ported to Svelte',
			src: '/desk/areas',
			text: [
				'refine is a popular React framework for admin panels and internal tools. Svelte has nothing like it, so I ported it: the same data-provider contract, controllers for lists, records and writes, resources and routes as data, and tables whose filters, sorting and pages live in the URL.',
				'Rebuilt Svelte 5 first with runes, not translated line by line. The example is an ownership register: every area of a company has one owner and a backup.',
			],
		}),
};

export const Record: StoryObj = {
	name: 'A record',
	render: () =>
		show({
			title: 'A record',
			src: '/desk/areas/billing',
			text: [
				'One record with its related lists, each a Desk controller. Changing the owner is a Desk write: it invalidates every list and count that shows it, and errors come back as notifications.',
			],
		}),
};

export const People: StoryObj = {
	name: 'People',
	render: () =>
		show({
			title: 'People',
			src: '/desk/people',
			text: ['A second resource on the same contract: search, filters and pages in the URL, without writing a list from scratch.'],
		}),
};
