import type { Meta, StoryObj } from '@storybook/html-vite';
import { showcase, type Showcase } from './showcase';

const meta: Meta = { title: 'LMU Room Finder 2.0' };
export default meta;

// Each story writes its name out: Storybook reads names from the source, not at runtime.
const show = (s: Pick<Showcase, 'title' | 'text' | 'src' | 'frame'>) =>
	showcase({
		status: 'Prototype',
		project: 'Product manager at LMU · SvelteKit, MapLibre',
		note: 'The prototype, running on bundled data.',
		...s,
	});

export const CampusMap: StoryObj = {
	name: 'Campus map',
	render: () =>
		show({
			title: 'Campus map',
			frame: 'desktop',
			src: '/roomfinder/en',
			text: [
				'Finding a room at a university with over 140 buildings should be as easy as finding a café on your phone. So the room finder works like Google and Apple Maps.',
				'Search a building, room or place, or filter by category.',
			],
		}),
};

export const Place: StoryObj = {
	name: 'A place',
	render: () =>
		show({
			title: 'A place',
			frame: 'desktop',
			src: '/roomfinder/en?p=0000',
			text: [
				'A place opens in a side sheet with photos, opening hours and the way there. The selected place is the only green pin on the map.',
			],
		}),
};

export const Inside: StoryObj = {
	name: 'Inside a building',
	render: () =>
		show({
			title: 'Inside a building',
			frame: 'desktop',
			src: '/roomfinder/en?p=0147&l=0',
			text: [
				'Where a floor plan exists, you step inside the building and find a room by its number or name. The plan is turned and placed to fit the building’s outline on the map.',
			],
		}),
};

export const Phone: StoryObj = {
	name: 'On the phone',
	render: () =>
		show({
			title: 'On the phone',
			frame: 'phone',
			src: '/roomfinder/en?p=0000',
			text: ['On the phone, the side sheet becomes a sheet over the map.'],
		}),
};

// The component book: the room finder's own Storybook, served at /roomfinder-book. A plate story
// frames one of its stories on its own; the book story opens its introduction.
const BOOK = '/roomfinder-book';
const PROJECT = 'Product manager at LMU · SvelteKit, MapLibre, Storybook';
const plate = (s: Pick<Showcase, 'title' | 'text' | 'frame'> & { id: string }) =>
	showcase({
		status: 'Prototype',
		project: PROJECT,
		note: 'A plate from the component book, with sample data.',
		frame: s.frame,
		src: `${BOOK}/iframe.html?id=${s.id}&viewMode=story`,
		title: s.title,
		text: s.text,
	});

export const ComponentBook: StoryObj = {
	name: 'Component book',
	render: () =>
		showcase({
			status: 'Prototype',
			project: PROJECT,
			title: 'Component book',
			frame: 'desktop',
			src: `${BOOK}/iframe.html?id=introduction--docs&viewMode=docs`,
			text: [
				'Every part of the room finder has its own plate, like a product in a catalogue: the component large and working, why it exists, what the old version did and what was left out, its states, its measurements, and how phones differ from tablets and up.',
				'166 stories in five sections. Each one also runs as a test in a real browser.',
			],
			link: { href: `${BOOK}/`, label: 'Open the component book' },
		}),
};

export const Pins: StoryObj = {
	name: 'Pins',
	render: () =>
		plate({
			title: 'Pins',
			frame: 'desktop',
			id: 'markers-on-the-map--at-the-main-building',
			text: [
				'Every pin is white with a dark glyph, so the place you picked is the only green thing on the map. Toilets, stairs and lifts get pins of their own.',
			],
		}),
};

export const FacilityPicked: StoryObj = {
	name: 'A toilet picked on the plan',
	render: () =>
		plate({
			title: 'A toilet picked on the plan',
			frame: 'phone',
			id: 'place-building-details--picked-on-the-map',
			text: [
				'Pick a toilet on the floor plan, and the building opens on its Facilities tab with that toilet selected. Rooms work the same way on the Rooms tab.',
			],
		}),
};

export const Floors: StoryObj = {
	name: 'Floors',
	render: () =>
		plate({
			title: 'Floors',
			frame: 'desktop',
			id: 'map-controls-map-controls--with-the-level-switch',
			text: [
				'The floors sit in the map controls, above zoom and your location. When the room you picked is on another floor, a dot marks its floor.',
			],
		}),
};
