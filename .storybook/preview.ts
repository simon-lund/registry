import type { Preview } from '@storybook/html-vite';
import '../stories/showcase.css';

const preview: Preview = {
	parameters: {
		layout: 'fullscreen',
		controls: { disable: true },
		actions: { disable: true },
		options: { storySort: { order: ['Klementine', 'UI concepts', 'LMU Room Finder 2.0', 'Desk', 'Zettel'] } },
	},
};

export default preview;
