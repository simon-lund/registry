import type { Meta, StoryObj } from '@storybook/html-vite';
import { showcase, type Showcase } from './showcase';

const meta: Meta = { title: 'UI concepts' };
export default meta;

// Small experiments, not products: a component, a set of variations, a fragment of a view.
// Each story writes its name out: Storybook reads names from the source, not at runtime.
const show = (s: Pick<Showcase, 'title' | 'text' | 'project'> & Partial<Showcase>) =>
	showcase({ status: 'Concept', frame: 'desktop', ...s });

export const AgentsTree: StoryObj = {
	name: 'Agents as processes',
	render: () =>
		show({
			title: 'Agents as processes',
			project: 'Agent tooling · Concept · A fragment',
			image: {
				src: '/static/agents-tree.webp',
				alt: 'A tree of coding agents with their states, beside what one agent can reach and the Linux rules it follows.',
			},
			text: [
				'Coding agents as a process tree, with the rules Linux uses: every agent sees the tree, steers only the agents below it, reports up, and talks to a sibling only through a socket a shared ancestor opens. You are process 1.',
				'When two agents edit the same file, it shows before it becomes a merge conflict.',
				'Why I built it: coding agents now start helpers of their own, and in every tool I’ve tried those run out of sight. You can’t steer what you can’t see.',
			],
		}),
};

export const AgentsPhone: StoryObj = {
	name: 'Steer agents from the phone',
	render: () =>
		show({
			title: 'Steer agents from the phone',
			project: 'Agent tooling · Concept · A fragment',
			image: {
				src: '/static/agents-phones.webp',
				alt: 'Three phones: a lock screen that buzzes only when an agent needs you, a swipe deck of decisions, and one agent’s controls.',
			},
			text: [
				'The phone only buzzes when an agent needs you. Decisions come as a deck you swipe through, and every agent has one sheet to pause, stop or message it.',
			],
		}),
};

export const Faces: StoryObj = {
	name: 'Her faces',
	render: () =>
		show({
			title: 'Her faces',
			project: 'Klementine · Motion · HTML and CSS',
			src: '/concepts/faces/',
			text: [
				'Klementine’s face, drawn with one rig: lids, gaze, one eye a little taller, the size of the smile. Every state moves a little: listening while you talk, thinking while she works something out.',
			],
		}),
};

export const Mixtape: StoryObj = {
	name: 'Mixtape',
	render: () =>
		show({
			title: 'Mixtape',
			project: 'Concept · Prototype · HTML',
			frame: 'phone',
			src: '/concepts/mixtape/',
			text: [
				'Mixtapes you can hold: a real cassette with an NFC tag. Tap it with your phone and the playlist opens with its story; your shelf keeps every tape you were given or made.',
				'Playback and NFC are simulated in this prototype.',
			],
		}),
};

export const TimeWheel: StoryObj = {
	name: 'Time wheel',
	render: () =>
		show({
			title: 'Time wheel',
			project: 'Component · Svelte',
			src: '/concepts/time-wheel/',
			text: [
				'A time picker you turn like a wheel, in two styles: flat, as on iOS, and a classic 3D drum. Both stay in step, in 12 or 24 hours.',
			],
		}),
};

export const InkyCalendar: StoryObj = {
	name: 'Inky calendar',
	render: () =>
		show({
			title: 'Inky calendar',
			project: 'Concept · Prototype · Next.js',
			src: '/concepts/inky-calendar/',
			text: [
				'A month you can draw on: your calendar in black and white, as on an e-ink screen, with a pen layer on top. Every month keeps its own drawing.',
				'The events here are examples, and your drawing stays in this browser.',
			],
		}),
};
