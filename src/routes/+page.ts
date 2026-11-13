import type { Component } from 'svelte';
import { components } from '#lib/book/catalogue.js';

// Every plate's demo, lazily: the index loads only those of the components for AI agents.
const demos = import.meta.glob<Component>('/src/routes/components/*/_examples/demo.svelte', { import: 'default' });

export const load = async () => ({
	ai: await Promise.all(
		components
			.filter((c) => c.ai)
			.map(async (c) => ({ ...c, Demo: await demos[`/src/routes/components/${c.name}/_examples/demo.svelte`]?.() }))
	)
});
