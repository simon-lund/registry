import type { Meta, StoryObj } from '@storybook/html-vite';
import { showcase, type Showcase } from './showcase';

const meta: Meta = { title: 'Zettel' };
export default meta;

// Each story writes its name out: Storybook reads names from the source, not at runtime.
const show = (s: Pick<Showcase, 'title' | 'text' | 'src'>) =>
	showcase({
		status: 'Prototype',
		project: 'Engineering · My own project · 2025 · SvelteKit, Supabase',
		frame: 'desktop',
		note: 'The prototype on example data in your browser. Nothing is saved.',
		...s,
	});

export const Notes: StoryObj = {
	name: 'Notes',
	render: () =>
		show({
			title: 'Notes',
			src: '/zettel/',
			text: [
				'A zettelkasten that works like Gmail: one list of notes, collections as labels in the sidebar, and search over everything.',
				'Drafts, recent notes, unsorted ones and the trash are views on the same list, not folders.',
			],
		}),
};

export const ANote: StoryObj = {
	name: 'A note',
	render: () =>
		show({
			title: 'A note',
			src: '/zettel/z-search-first',
			text: [
				'A note opens beside the list, like a mail. The first line is its title, and it saves as you type.',
				'Move it to a collection, keep it as a draft, or delete it.',
			],
		}),
};
