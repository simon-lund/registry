import type { Component } from 'svelte';

/** The source of an example as an app writes it, and the same source highlighted. */
export interface Source {
	code: string;
	html: string;
}

/** One example: the file rendered as the preview, and its source as the code a reader copies. */
export interface Example extends Source {
	component: Component;
}

/**
 * Pairs a plate's example files with their highlighted sources (the `?highlight` import, see
 * vite.config.ts), from two globs over the same folder: `example('default')` is
 * `_examples/default.svelte`. A name with no file throws, so a typo fails the page instead of
 * showing an empty box.
 */
export function examples(components: Record<string, Component>, sources: Record<string, Source>) {
	const byName = new Map<string, Example>();
	for (const [path, component] of Object.entries(components)) {
		const name = path.slice(path.lastIndexOf('/') + 1).replace(/\.svelte$/, '');
		const source = sources[`${path}?highlight`] ?? sources[path] ?? { code: '', html: '' };
		byName.set(name, { component, ...source });
	}
	return (name: string): Example => {
		const found = byName.get(name);
		if (!found) throw new Error(`No example "${name}"; there are: ${[...byName.keys()].join(', ')}`);
		return found;
	};
}

/**
 * An item's own files for the manual install, from a `?highlight` glob over its folder in
 * src/lib/registry/ui: each with the path it gets in an app, the index last.
 */
export function files(sources: Record<string, Source>) {
	return Object.entries(sources)
		.map(([path, source]) => ({
			...source,
			path: path.replace(/\?highlight$/, '').replace(/^.*\/registry\/ui\//, 'components/ui/')
		}))
		.sort((a, b) => Number(a.path.endsWith('/index.ts')) - Number(b.path.endsWith('/index.ts')) || a.path.localeCompare(b.path));
}
