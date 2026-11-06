import type { StorybookConfig } from '@storybook/html-vite';

// Copied into apps/ by scripts/build.sh and served beside the stories: Klementine's screens (stills
// from the app's tests), the room finder and zettel (live static builds), and the room finder's
// component book (its own Storybook).
const config: StorybookConfig = {
	framework: '@storybook/html-vite',
	stories: ['../stories/**/*.stories.ts'],
	staticDirs: [
		{ from: '../apps/klementine', to: '/klementine' },
		{ from: '../apps/roomfinder', to: '/roomfinder' },
		{ from: '../apps/roomfinder-book', to: '/roomfinder-book' },
		{ from: '../apps/zettel', to: '/zettel' },
		{ from: '../apps/concepts', to: '/concepts' },
		{ from: '../apps/desk', to: '/desk' },
		// committed assets, e.g. a screenshot of a site that can't be framed
		{ from: '../static', to: '/static' },
	],
	core: { disableTelemetry: true, disableWhatsNewNotifications: true },
};

export default config;
