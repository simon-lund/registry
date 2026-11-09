#!/usr/bin/env node
/**
 * Generates registry.json from the component tree (after klementine.ui's script of the same name).
 *
 * Every item folder src/lib/registry/ui/<name>/ carries its own meta.json:
 *
 *   {
 *     "title": "Number input",
 *     "description": "…",
 *     "dependencies": ["embla-carousel-svelte"],   // npm packages the item imports
 *     "registryDependencies": ["animated-number"]  // other items of this registry, by name
 *   }
 *
 * The file lists are walked, so a new part can never be left out of the item that owns it, and
 * a new item never edits a shared file: add the folder with its meta.json and run `pnpm registry`.
 * A folder without a meta.json is an error (it would silently never ship), and so is a
 * registryDependency that names no item.
 *
 * Folders named in STOCK hold shadcn-svelte's own components, installed here with its CLI so the
 * items and the book can import them. They do not ship: an item that uses one lists it by its bare
 * name, and the consumer's CLI takes it from their own registry, in their own style.
 *
 * Env / flags:
 *   REGISTRY_HOMEPAGE   the registry's public origin (default https://ui.simon-lund.com); every
 *                       registryDependency URL is built from it
 *   --out <file>        write there instead of ./registry.json
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const UI = join(ROOT, 'src/lib/registry/ui');
const HOMEPAGE = (process.env.REGISTRY_HOMEPAGE || 'https://ui.simon-lund.com').replace(/\/+$/, '');

const outFlag = process.argv.indexOf('--out');
const OUT = outFlag > -1 ? resolve(process.argv[outFlag + 1]) : join(ROOT, 'registry.json');

const url = (/** @type {string} */ name) => `${HOMEPAGE}/r/${name}.json`;

/** shadcn-svelte's own components: items depend on them by bare name, and they never ship from here. */
const STOCK = new Set(['button', 'input', 'spinner', 'tooltip']);

/** What items stand on: `cn` and the type helpers for all of them, `motion` for the ones that move. */
const BASE = [
	{
		name: 'utils',
		type: 'registry:lib',
		title: 'Utils',
		description:
			'cn() (clsx + tailwind-merge) and the WithElementRef / WithoutChild… type helpers. Every item depends on it.',
		dependencies: ['clsx', 'tailwind-merge'],
		registryDependencies: [],
		files: [{ path: 'src/lib/utils.ts', type: 'registry:lib', target: 'utils.ts' }]
	},
	{
		name: 'motion',
		type: 'registry:theme',
		title: 'Motion',
		description:
			'The durations and curves the moving items share, as CSS variables: a strong ease-out to land on, and short times. Reduced motion shortens them. The same values as src/app.css.',
		dependencies: [],
		registryDependencies: [],
		cssVars: {
			light: {
				'dur-press': '80ms',
				'dur-quick': '140ms',
				'dur-base': '220ms',
				'dur-calm': '320ms',
				'ease-settle': 'cubic-bezier(0.22, 1, 0.36, 1)',
				'ease-exit': 'cubic-bezier(0.4, 0, 1, 1)',
				'blur-swap': '4px'
			}
		},
		css: {
			'@media (prefers-reduced-motion: reduce)': {
				':root': {
					'--dur-press': '0ms',
					'--dur-quick': '120ms',
					'--dur-base': '120ms',
					'--dur-calm': '120ms'
				}
			}
		},
		files: []
	}
];
const BASE_DEPS = [url('utils')];

const META_KEYS = new Set(['title', 'description', 'dependencies', 'registryDependencies']);

/** @param {string} name */
function readMeta(name) {
	const file = join(UI, name, 'meta.json');
	if (!statSync(file, { throwIfNoEntry: false })) {
		throw new Error(`${relative(ROOT, join(UI, name))}: no meta.json, so the item would never ship`);
	}
	/** @type {Record<string, unknown>} */
	let meta;
	try {
		meta = JSON.parse(readFileSync(file, 'utf8'));
	} catch (e) {
		throw new Error(`${relative(ROOT, file)}: ${/** @type {Error} */ (e).message}`);
	}
	const unknown = Object.keys(meta).filter((k) => !META_KEYS.has(k));
	if (unknown.length) throw new Error(`${relative(ROOT, file)}: unknown keys ${unknown.join(', ')}`);
	for (const k of /** @type {const} */ (['title', 'description'])) {
		if (typeof meta[k] !== 'string' || !meta[k].trim()) {
			throw new Error(`${relative(ROOT, file)}: "${k}" must be a non-empty string`);
		}
	}
	for (const k of /** @type {const} */ (['dependencies', 'registryDependencies'])) {
		const v = meta[k] ?? [];
		if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) {
			throw new Error(`${relative(ROOT, file)}: "${k}" must be an array of strings`);
		}
	}
	return {
		title: /** @type {string} */ (meta.title),
		description: /** @type {string} */ (meta.description),
		dependencies: /** @type {string[]} */ (meta.dependencies ?? []),
		registryDependencies: /** @type {string[]} */ (meta.registryDependencies ?? [])
	};
}

const names = (statSync(UI, { throwIfNoEntry: false })?.isDirectory() ? readdirSync(UI) : [])
	.filter((d) => !d.startsWith('.') && !STOCK.has(d) && statSync(join(UI, d)).isDirectory())
	.sort();
const known = new Set([...BASE.map((b) => b.name), ...names, ...STOCK]);

const components = names.map((name) => {
	const dir = join(UI, name);
	const meta = readMeta(name);
	for (const dep of meta.registryDependencies) {
		// A full URL points at another registry; a bare name must be an item of this one.
		if (!/^https?:\/\//.test(dep) && !known.has(dep)) {
			throw new Error(`${relative(ROOT, dir)}/meta.json: registryDependency "${dep}" is no item`);
		}
	}
	return {
		name,
		type: 'registry:ui',
		title: meta.title,
		description: meta.description,
		// Both arrays are required by the registry-item schema, empty or not.
		dependencies: meta.dependencies,
		registryDependencies: [
			...BASE_DEPS,
			...meta.registryDependencies.map((d) => (/^https?:\/\//.test(d) || STOCK.has(d) ? d : url(d)))
		],
		files: readdirSync(dir)
			// meta.json and notes describe the folder; they do not ship.
			.filter((f) => !f.startsWith('.') && f !== 'meta.json' && !f.endsWith('.md'))
			.sort()
			// Relative to the consumer's `ui` alias, so a file lands at <ui>/<name>/<file>: the same
			// path as here. Imports between items (`#lib/registry/ui/x/index.js`) are rewritten to
			// the consumer's aliases by the CLI.
			.map((f) => ({ path: relative(ROOT, join(dir, f)), type: 'registry:ui', target: `${name}/${f}` }))
	};
});

const items = [...BASE, ...components];

writeFileSync(
	OUT,
	JSON.stringify(
		{
			$schema: 'https://shadcn-svelte.com/schema/registry.json',
			name: 'simon-lund',
			homepage: HOMEPAGE,
			// The import prefixes used in the sources here; the CLI rewrites them to the consumer's.
			aliases: {
				lib: '#lib',
				ui: '#lib/registry/ui',
				components: '#lib/components',
				utils: '#lib/utils',
				hooks: '#lib/hooks'
			},
			items
		},
		null,
		2
	) + '\n'
);
console.log(
	`${OUT.startsWith(ROOT) ? relative(ROOT, OUT) : OUT}: ${items.length} items, ${items.reduce((n, i) => n + i.files.length, 0)} files, homepage ${HOMEPAGE}`
);
