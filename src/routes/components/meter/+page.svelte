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
	import meta from '#lib/registry/ui/meter/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/meter/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="meter" title="Meter">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>
			Built on bits-ui's Meter. The design is after Klementine's Meter. It has no copy of its own:
			you give the words, and format numbers for your locale.
		</p>
		<PlateInstall name="meter" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateSection title="Meter or Progress">
		<p>
			A Meter says where a measurement stands in a range: storage used, a monthly limit, a battery.
			Nothing is under way and nothing finishes. Work that is going somewhere, an upload or a sync,
			is a Progress. The fill is ink, never copper, because a measurement is not the value you hold.
		</p>
	</PlateSection>

	<PlateExample title="Thresholds" example={example('tones')}>
		<code>low</code> and <code>high</code> cut the range into three regions and <code>optimum</code>
		names the good one. Here less is better (<code>optimum=&#123;0&#125;</code>). One region away is
		<code>suboptimal</code>: the value's words step up from muted to full ink. Two regions away is
		<code>poor</code>: the fill and the words turn destructive. <code>poor</code> needs both
		thresholds; with one, the tone stops at <code>suboptimal</code>. Without thresholds it is always
		<code>optimum</code>.
	</PlateExample>

	<PlateExample title="Size" example={example('size')}>
		<code>size="sm"</code> is 4px, for a line under something else.
	</PlateExample>

	<PlateExample title="Without a field" example={example('alone')}>
		A Meter on its own needs an <code>aria-label</code> and an <code>aria-valuetext</code> in words.
		Here a battery is good when it is full (<code>optimum=&#123;100&#125;</code>).
	</PlateExample>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Meter">
				<p>The track and its fill. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="value" type="number" default="0" />
					<PlateProp name="min" type="number" default="0" />
					<PlateProp name="max" type="number" default="100" />
					<PlateProp name="low" type="number" default="min">The upper end of the low region.</PlateProp>
					<PlateProp name="high" type="number" default="max">The lower end of the high region.</PlateProp>
					<PlateProp name="optimum" type="number" default="the middle">The best value. Its region is the good one.</PlateProp>
					<PlateProp name="size" type={`"default" | "sm"`} default={`"default"`} />
					<PlateProp name="aria-label" type="string">Needed outside a MeterField.</PlateProp>
					<PlateProp name="aria-valuetext" type="string">The value in words. Without it a screen reader says a percentage.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MeterField">
				<p>One line with the label at the start and the value at the end, the track under both. It wires the ids, so the Meter is named by its label and described by its value. Also exported as <code>Field</code>.</p>
			</PlatePart>
			<PlatePart name="MeterLabel">
				<p>What the Meter measures. Also exported as <code>Label</code>.</p>
			</PlatePart>
			<PlatePart name="MeterValue">
				<p>The value in words, with tabular digits: muted, full ink when the value is suboptimal, destructive when it is poor. Put it before the Meter. Also exported as <code>Value</code>.</p>
			</PlatePart>
			<PlatePart name="meterTone" kind="function">
				<p><code>meterTone(value, min, max, low?, high?, optimum?)</code> gives <code>"optimum"</code>, <code>"suboptimal"</code> or <code>"poor"</code> by the HTML meter rules.</p>
			</PlatePart>
			<PlatePart name="meterVariants" kind="function">
				<p>The track's classes and its <code>size</code> variant, from <code>tailwind-variants</code>.</p>
			</PlatePart>
			<PlatePart name="MeterSize" kind="type">
				<p>The type of the <code>size</code> prop.</p>
			</PlatePart>
			<PlatePart name="MeterTone" kind="type">
				<p>The type of the tone.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Track" value="8px · sm 4px, a 12% tint of the text colour, no border" />
			<PlateMeasure label="Fill" value="ink; destructive when poor; from the start, also right to left" />
			<PlateMeasure label="Value's words" value="muted · full ink when suboptimal · destructive when poor" />
			<PlateMeasure label="New value" value="220ms (--dur-base) on --ease-settle, transform only" />
			<PlateMeasure label="Label and value" value="14px; the value in 500 weight, tabular digits" />
			<PlateMeasure label="Reduced motion" value="the fill moves in 120ms" />
		</PlateMeasures>
	</PlateSection>
</Plate>
