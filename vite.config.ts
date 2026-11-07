import { readFile } from 'node:fs/promises';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { createCssVariablesTheme, createHighlighter, type Highlighter } from 'shiki';
import { defineConfig, type Plugin } from 'vite';

// Examples import from the registry's own folder; an app that installed the item has it under
// components/ui, so the code a reader sees and copies says that.
const forApp = (source: string) => source.replaceAll('#lib/registry/ui/', '#lib/components/ui/').trim();

/**
 * `import x from './example.svelte?highlight'` is `{ code, html }`: the file's source as an app
 * would write it, and the same source highlighted. Shiki runs here, at build time, so the page
 * ships coloured text and no highlighter. Each token's colour is a CSS variable (--code-token-*),
 * set in app.css from the theme's tokens.
 */
function highlight(): Plugin {
	const prefix = '\0highlight:';
	const theme = createCssVariablesTheme({ name: 'tokens', variablePrefix: '--code-', fontStyle: true });
	let highlighter: Promise<Highlighter> | undefined;
	return {
		name: 'highlight',
		enforce: 'pre',
		async resolveId(source, importer) {
			if (!source.endsWith('?highlight')) return;
			const file = await this.resolve(source.slice(0, -'?highlight'.length), importer, { skipSelf: true });
			// a virtual id ending in .js, so the Svelte compiler leaves it alone
			return file && `${prefix}${file.id}.js`;
		},
		async load(id) {
			if (!id.startsWith(prefix)) return;
			const file = id.slice(prefix.length, -'.js'.length);
			this.addWatchFile(file);
			const code = forApp(await readFile(file, 'utf8'));
			const lang = file.endsWith('.svelte') ? 'svelte' : 'typescript';
			highlighter ??= createHighlighter({ themes: [theme], langs: ['svelte', 'typescript'] });
			const html = (await highlighter).codeToHtml(code, { lang, theme: 'tokens', structure: 'inline' });
			return `export default ${JSON.stringify({ code, html })};`;
		}
	};
}

export default defineConfig({
	plugins: [
		highlight(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Runes everywhere except in libraries. Can go in Svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Cloudflare Workers, as the portfolio; wrangler.jsonc names the route.
			adapter: adapter()
		})
	]
});
