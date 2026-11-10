<script lang="ts">
	import {
		Plate,
		PlateStage,
		PlateSection,
		PlateInstall,
		PlateExample,
		PlateApi,
		PlatePart,
		PlateProps,
		PlateProp,
		PlateMeasures,
		PlateMeasure,
		PlateCode
	} from '#lib/book/plate/index.js';
	import { examples, files, type Source } from '#lib/book/examples.js';
	import type { Component } from 'svelte';
	import meta from '#lib/registry/ui/textarea/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/textarea/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="textarea" title="Textarea">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>Installing this replaces the stock shadcn-svelte Textarea, and <code>Textarea</code> keeps its name.</p>
		<PlateInstall name="textarea" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Limits" example={example('limits')}>
		The grip holds the height between the field's <code>min-h-*</code> and <code>max-h-*</code>.
		<code>Home</code> goes to the first, and <code>End</code> to the second if you set one.
	</PlateExample>

	<PlateExample title="Autogrow" example={example('autogrow')}>
		Set <code>autogrow</code> to grow with the text instead, with no grip. Cap it with a
		<code>max-h-*</code> class and it scrolls from there.
	</PlateExample>

	<PlateExample title="No grip" example={example('no-grip')}>
		Set <code>resizable={'{'}false{'}'}</code> to leave the grip out.
	</PlateExample>

	<PlateExample title="Invalid" example={example('invalid')}>
		Set <code>aria-invalid</code> to own the state. Without it, the browser's validation rings the
		field once it was left wrong or a submit was tried, as in the second field.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')}>
		Set <code>disabled</code>. The grip goes too.
	</PlateExample>

	<PlateSection title="Keyboard">
		<p>The grip takes focus when you set <code>resizeLabel</code>. It is a focusable separator placed after the field in the tab order.</p>
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li><code>ArrowDown</code> and <code>ArrowUp</code> make the field a line taller or shorter.</li>
			<li><code>Home</code> goes to its least height.</li>
			<li><code>End</code> goes to its greatest height, if it has a <code>max-h-*</code>.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Textarea">
				<p>The field and its grip. <code>class</code> and other attributes go to the <code>textarea</code>; with the grip the two stand in a full-width frame, so give the field its width through its container. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="string" bindable />
					<PlateProp name="resizeLabel" type="string">The grip's name. With it the grip takes focus and the keys resize; without it, only the pointer does.</PlateProp>
					<PlateProp name="resizable" type="boolean" default="true">Whether the fixed field has the grip.</PlateProp>
					<PlateProp name="autogrow" type="boolean" default="false">Grow with the text instead of scrolling.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false" />
					<PlateProp name="aria-invalid" type={`"true" | "false"`}>Owns the invalid state; left out, the browser's validation does.</PlateProp>
					<PlateProp name="ref" type="HTMLTextAreaElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Min height" value="96px (min-h-24)" />
			<PlateMeasure label="Padding" value="10px sides, 8px top and bottom" />
			<PlateMeasure label="Text" value="16px, from md 14px" />
			<PlateMeasure label="Radius" value="8px (--radius)" />
			<PlateMeasure label="Grip" value="24px target against the border, 10px strokes 6px from the field's edge" />
			<PlateMeasure label="Grip colour" value="140ms (--dur-quick) on --ease-settle" />
			<PlateMeasure label="Key step" value="one line height; 24px if the line height is normal" />
			<PlateMeasure label="Focus ring" value="3px ring at 50 %, border to ring" />
			<PlateMeasure label="Grip focus ring" value="2px ring colour" />
			<PlateMeasure label="Disabled" value="50% opacity" />
		</PlateMeasures>
	</PlateSection>
</Plate>
