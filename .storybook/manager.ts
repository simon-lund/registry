import { addons } from 'storybook/manager-api';
import theme from './theme';

// A showcase, not a workshop: no addon panel and no toolbar, only the list of stories.
addons.setConfig({
	theme,
	showPanel: false,
	showToolbar: false,
	sidebar: { showRoots: true },
});
