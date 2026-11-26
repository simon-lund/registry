<script lang="ts">
	import { Plate, PlateSection, PlateApi, PlatePart, PlateCode } from '#lib/book/plate/index.js';
	import { install } from '#lib/book/catalogue.js';
	import type { Source } from '#lib/book/examples.js';
	import { shell } from '#lib/book/shell.js';

	// The file itself, highlighted at build time (the `?highlight` import, see vite.config.ts).
	const source = Object.values(
		import.meta.glob<Source>('/src/lib/utils.ts', { eager: true, import: 'default', query: '?highlight' })
	)[0];
	const command = install('utils');
</script>

<Plate name="utils" title="Utils">
	<PlateSection title="Installation">
		<p>
			Every item imports <code>cn</code> and a few type helpers from your <code>utils.ts</code>, so
			every item brings this file with it. You rarely install it by itself.
		</p>
		<PlateCode code={command} html={shell(command)} label="install command" />
	</PlateSection>

	<PlateSection title="Your own utils.ts">
		<p>
			A shadcn-svelte app already has a <code>utils.ts</code>, so the CLI asks whether to overwrite
			it when you install an item. It replaces the whole file or leaves it alone. It does not merge
			the two.
		</p>
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>
				<strong class="font-medium">You never changed it:</strong> say yes. This is the same file as the
				one <code>shadcn-svelte init</code> writes, so nothing is lost.
			</li>
			<li>
				<strong class="font-medium">You added things of your own:</strong> say no for
				<code>utils</code>, or they are gone. The item still installs. Then check that your file
				exports the names below.
			</li>
		</ul>
	</PlateSection>

	<PlateSection title="Source">
		<PlateCode code={source.code} html={source.html} label="utils.ts" />
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="cn" kind="function">
				<p>
					<code>cn(...classes)</code> joins class names and lets the later Tailwind class win. It is
					shadcn's own <code>cn</code> package, as in the file <code>shadcn-svelte init</code> writes.
				</p>
			</PlatePart>
			<PlatePart name="WithElementRef" kind="type">
				<p>The props of an element, with <code>ref</code> bound to it.</p>
			</PlatePart>
			<PlatePart name="WithoutChild" kind="type">
				<p>Props without <code>child</code>, for a part that renders its own element.</p>
			</PlatePart>
			<PlatePart name="WithoutChildren" kind="type">
				<p>Props without <code>children</code>, for a part that takes none.</p>
			</PlatePart>
			<PlatePart name="WithoutChildrenOrChild" kind="type">
				<p>Props without either.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>
</Plate>
