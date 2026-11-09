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
	import meta from '#lib/registry/ui/dial/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/dial/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="dial" title="Dial">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="dial" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Even steps" example={example('step')}>
		Give <code>step</code> a number for a stop every <code>step</code> from <code>min</code> to
		<code>max</code>. A list, as in the demo above, sits at equal angles whatever its values are.
	</PlateExample>

	<PlateExample title="Sweep" example={example('sweep')}>
		Set <code>sweep</code> to the arc in degrees. The arc stays centred on 12 o'clock unless you
		set <code>start</code>. <code>DialUnit</code> moves to the middle of the open part.
	</PlateExample>

	<PlateExample title="Ring" example={example('ring')}>
		<code>sweep={'{360}'}</code> turns on <code>wrap</code>: past the last stop comes the first, and
		the knob turns the short way. Set <code>wrap</code> yourself to go round on an arc too.
	</PlateExample>

	<PlateExample title="Size" example={example('small')}>
		<code>size="sm"</code> is 96px with no room for labels, so say the value in words beside it.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')} />

	<PlateExample title="In a form" example={example('form')}>
		Set <code>name</code> and the form submits the stop the dial is on. A reset puts it back to the
		value it mounted with, without calling <code>onValueChange</code>.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex flex-col gap-1 pl-5">
			<li><code>ArrowRight</code> and <code>ArrowUp</code> go one stop up.</li>
			<li><code>ArrowLeft</code> and <code>ArrowDown</code> go one stop down.</li>
			<li><code>PageUp</code> and <code>PageDown</code> go a tenth of the stops, at least one.</li>
			<li><code>Home</code> and <code>End</code> go to the first and the last stop.</li>
			<li>On a ring the arrows and page keys go round. Every key step turns the knob at once.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Dial">
				<p>
					The root and the <code>role="slider"</code> element. It has no copy of its own, so give it
					<code>aria-label</code> or <code>aria-labelledby</code>, and <code>aria-valuetext</code>
					where the number alone is unclear. Your pointer and key handlers run before its own, and a
					<code>preventDefault</code> in <code>onkeydown</code> stops the step.
				</p>
				<PlateProps>
					<PlateProp name="value" type="number" bindable>Always one of the stops. Left unset, the knob sits on the first stop.</PlateProp>
					<PlateProp name="step" type="number | number[]" default="1">A number: every step from min to max. A list: those values, sorted, at equal angles.</PlateProp>
					<PlateProp name="min" type="number" default="0">Only with a number step.</PlateProp>
					<PlateProp name="max" type="number" default="100">Only with a number step.</PlateProp>
					<PlateProp name="sweep" type="number" default="270">The arc in degrees, 1 to 360.</PlateProp>
					<PlateProp name="start" type="number" default="-sweep / 2">The angle of the first stop: 0 is 12 o'clock, clockwise.</PlateProp>
					<PlateProp name="wrap" type="boolean" default="sweep >= 360">The stops form a ring. In the open gap of an arc, a pointer picks the nearer end.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false">Dims it and ignores input. A form does not submit it.</PlateProp>
					<PlateProp name="size" type={`"default" | "sm"`} default={`"default"`} />
					<PlateProp name="name" type="string">Adds a hidden input with the stop it is on.</PlateProp>
					<PlateProp name="onValueChange" type="(value: number) => void">On every change by the user: a key, or a pointer passing a stop.</PlateProp>
					<PlateProp name="onValueCommit" type="(value: number) => void">When a change is complete: on release of a pointer, and on every key step.</PlateProp>
					<PlateProp name="aria-label" type="string" />
					<PlateProp name="aria-labelledby" type="string" />
					<PlateProp name="aria-valuetext" type="string" />
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
					<PlateProp name="style" type="string" />
					<PlateProp name="children" type="Snippet">The stops, the knob and the unit.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="DialKnob">
				<p>
					The key in the middle. Its copper pointer line turns to the stop the value is on, it gives
					a little while held, and it draws the dial's focus ring.
				</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
					<PlateProp name="children" type="Snippet">Renders on the key's face.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="DialStop">
				<p>
					One stop: its mark at the stop's angle and its label outside it. Render one per stop. The
					stop the value is on turns its mark copper and its label full ink at weight 600.
				</p>
				<PlateProps>
					<PlateProp name="value" type="number" required>One of the dial's stops. Anything else renders nothing and warns in the console.</PlateProp>
					<PlateProp name="variant" type={`"minor" | "major"`} default={`"minor"`}>Major is the long mark, for a labelled stop.</PlateProp>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
					<PlateProp name="children" type="Snippet">The label. Pointing at it picks its stop.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="DialUnit">
				<p>
					The unit, in the middle of the open part of the sweep; on a full circle, at the bottom.
					Shown to sight only, so put the unit into <code>aria-valuetext</code> too.
				</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
					<PlateProp name="style" type="string" />
					<PlateProp name="children" type="Snippet" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="dialVariants" kind="function">
				<p>The root's classes, from <code>tailwind-variants</code>. <code>DialSize</code> is the type of its <code>size</code>.</p>
				<PlateProps>
					<PlateProp name="size" type={`"default" | "sm"`} default={`"default"`} />
				</PlateProps>
			</PlatePart>
			<PlatePart name="dialStopVariants" kind="function">
				<p>A stop mark's classes. <code>DialStopVariant</code> is the type of its <code>variant</code>.</p>
				<PlateProps>
					<PlateProp name="variant" type={`"minor" | "major"`} default={`"minor"`} />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Size" value="224px · sm 96px" />
			<PlateMeasure label="Knob" value="50% of the dial · sm 58%" />
			<PlateMeasure label="Mark radius" value="37% · sm 48%" />
			<PlateMeasure label="Label radius" value="44%" />
			<PlateMeasure label="Major mark" value="10px · sm 8px long, 1.5px wide" />
			<PlateMeasure label="Minor mark" value="5px · sm 4px long, 1px wide" />
			<PlateMeasure label="Selected mark" value="2px wide, copper" />
			<PlateMeasure label="Pointer line" value="2px wide, 24% of the knob, 9% from its edge, copper" />
			<PlateMeasure label="Sweep" value="270°, opening at the bottom" />
			<PlateMeasure label="Settle" value="140ms ease-settle, rotate and colour only" />
			<PlateMeasure label="Held" value="scale 0.97 in 80ms" />
			<PlateMeasure label="Focus ring" value="2px, 2px off the knob" />
			<PlateMeasure label="Centre dead zone" value="a sixth of the radius" />
			<PlateMeasure label="Haptic" value="5ms per stop, on touch" />
			<PlateMeasure label="Disabled" value="45% opacity" />
		</PlateMeasures>
	</PlateSection>
</Plate>
