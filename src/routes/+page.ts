import type { Component } from 'svelte';
import { components } from '#lib/book/catalogue.js';

// Every plate's demo, lazily: the index loads only the spotlit ones.
const demos = import.meta.glob<Component>('/src/routes/components/*/_examples/demo.svelte', { import: 'default' });

export const load = async () => ({
	spotlight: await Promise.all(
		components
			.filter((c) => c.spotlight)
			.map(async (c) => ({ ...c, Demo: await demos[`/src/routes/components/${c.name}/_examples/demo.svelte`]?.() }))
	)
});
