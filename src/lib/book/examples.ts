import type { Component } from 'svelte';

/** One example: the file rendered as the preview, and its source as the code a reader copies. */
export interface Example {
	component: Component;
	code: string;
}

// Examples import from the registry's own folder; an app that installed the item has it under
// components/ui, so the code shows that path.
const forApp = (source: string) => source.replaceAll('#lib/registry/ui/', '#lib/components/ui/').trim();

/**
 * Pairs a plate's example files with their sources, from two globs over the same folder:
 * `example('default')` is `_examples/default.svelte`. A name with no file throws, so a typo
 * fails the page instead of showing an empty box.
 */
export function examples(components: Record<string, Component>, sources: Record<string, string>) {
	const byName = new Map<string, Example>();
	for (const [path, component] of Object.entries(components)) {
		const name = path.slice(path.lastIndexOf('/') + 1).replace(/\.svelte$/, '');
		byName.set(name, { component, code: forApp(sources[path] ?? '') });
	}
	return (name: string): Example => {
		const found = byName.get(name);
		if (!found) throw new Error(`No example "${name}"; there are: ${[...byName.keys()].join(', ')}`);
		return found;
	};
}
