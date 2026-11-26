import type { Component } from 'svelte';
import { components } from '#lib/book/catalogue.js';

// Every plate's demo, lazily: the index loads only those of the featured components.
const demos = import.meta.glob<Component>('/src/routes/components/*/_examples/demo.svelte', { import: 'default' });

export const load = async () => ({
	featured: await Promise.all(
		components
			.filter((c) => c.featured)
			.map(async (c) => ({ ...c, Demo: await demos[`/src/routes/components/${c.name}/_examples/demo.svelte`]?.() }))
	)
});
