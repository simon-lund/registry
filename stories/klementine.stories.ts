import type { Meta, StoryObj } from '@storybook/html-vite';
import { showcase, type Screen } from './showcase';

const meta: Meta = { title: 'Klementine' };
export default meta;

// Screens rendered from the app's own code in its tests, with example data.
const shot = (name: string, caption: string, alt: string): Screen => ({ src: `/klementine/${name}.webp`, caption, alt });

const show = (title: string, text: string[], list: Screen[]) =>
	showcase({
		status: 'In development',
		project: 'My own product · Design and code · Flutter',
		title,
		text,
		frame: 'screens',
		screens: list,
		note: 'Rendered from the app’s own code in its tests, with example data.',
	});

// Each story writes its name out: Storybook reads names from the source, not at runtime.
export const Website: StoryObj = {
	name: 'Website',
	render: () =>
		showcase({
			status: 'Live',
			project: 'My own product · Design and code · SvelteKit, Cloudflare',
			title: 'Website',
			text: [
				'One sentence for the whole product, and the app on a phone beside it. The site is live in English, German and French, with a waitlist.',
			],
			frame: 'desktop',
			image: {
				src: '/static/klementine-net.webp',
				alt: 'klementine.net: “One assistant for your whole day. She tells you what matters now.” beside the app on a phone.',
			},
			link: { href: 'https://klementine.net', label: 'Open klementine.net' },
			note: 'A screenshot: the site doesn’t allow being shown inside other pages.',
		}),
};

export const Today: StoryObj = {
	name: 'Today',
	render: () =>
		show(
			'Today',
			[
				'An assistant for your whole day. Today shows the one thing that’s next, and only what matters now: a plan that needs your yes, an answer to your question, or that you’re done.',
			],
			[
				shot('today.all', 'What’s next', 'Coffee with Anna in 39 minutes, with the dentist to call first.'),
				shot('today.needs-you', 'Needs your yes', 'A plan, move to Berlin, waiting for a yes.'),
				shot('today.asking', 'An answer', 'The answer to when Anna’s birthday is, from her contact card.'),
				shot('today.all-done', 'All done', 'All done for today, with one step from a plan if you want more.'),
			],
		),
};

export const Planner: StoryObj = {
	name: 'Planner',
	render: () =>
		show(
			'Planner',
			['Lists and projects, the week ahead, and every task in its place. A big plan like a move becomes steps with dates.'],
			[
				shot('planner.open', 'Lists and projects', 'The planner: this week, library, people, and lists like Home and Move to Berlin.'),
				shot('planner.week', 'This week', 'The week ahead, day by day.'),
				shot('place.open', 'A project', 'Move to Berlin: steps grouped by month up to moving day.'),
				shot('item.task', 'A task', 'A task with Done, Later and Remove.'),
			],
		),
};

export const Chat: StoryObj = {
	name: 'Chat',
	render: () =>
		show(
			'Chat',
			['Ask, or hand her a job. Longer work runs in the background, shows where it stands, and can be stopped.'],
			[
				shot('chat.list', 'Conversations', 'The chat list with her work, pinned and recent conversations.'),
				shot('chat.conversation', 'A question', 'When is Anna’s birthday, with the answer.'),
				shot('chat.job-working', 'A job, working', 'Comparing moving vans, 3 of 5 companies, with Stop.'),
				shot('chat.job-done', 'A job, done', 'Three flats in Berlin that fit, with Undo.'),
			],
		),
};

export const Journeys: StoryObj = {
	name: 'Journeys',
	render: () =>
		show(
			'Journeys',
			['A goal with a path: run your first 5k, read 12 books. Each week has its steps, and the log keeps what you did.'],
			[
				shot('journeys.list', 'Your journeys', 'Two journeys with their progress.'),
				shot('journey.page', 'The path', 'Run your first 5k: week 3 of 8, with this week’s runs.'),
				shot('journey.done-undo', 'A step done', 'Today’s run ticked off, with Undo.'),
				shot('journey.log', 'The log', 'Seven runs, each with a note.'),
			],
		),
};

export const FirstRun: StoryObj = {
	name: 'First run',
	render: () =>
		show(
			'First run',
			['A new phone. She introduces herself, asks for your name, and you tell her the first thing on your mind, by talking or typing.'],
			[
				shot('firstrun.hello', 'Hello', 'Hi, I’m Klementine, with Get started.'),
				shot('firstrun.name', 'Your name', 'What should I call you? Hold to talk, tap to type.'),
				shot('firstrun.something-real', 'Something real', 'Listening: Call Lea tomorrow at 9.'),
				shot('firstrun.nice-to-meet-you', 'Nice to meet you', 'Nice to meet you, Alex, and what’s on your mind.'),
			],
		),
};
