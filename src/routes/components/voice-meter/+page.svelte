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
	import meta from '#lib/registry/ui/voice-meter/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/voice-meter/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="voice-meter" title="Voice meter">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="voice-meter" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Levels" example={example('levels')}>
		Pass <code>levels</code>, 0 to 1 with the newest last, and replace the array with each sample.
		Here a slider is the source, so this meter hears nothing.
	</PlateExample>

	<PlateExample title="Silence" example={example('silence')}>
		With no source, or before the first level, it is a calm row of dots.
	</PlateExample>

	<PlateExample title="Microphone" example={example('microphone')}>
		Pass a <code>stream</code> from <code>getUserMedia</code>. The meter never asks for the
		microphone itself, so ask on a press of a button, and handle the answer. This one asks only when
		you press it, and shows a refusal.
	</PlateExample>

	<PlateExample title="Analyser" example={example('analyser')}>
		Pass an <code>AnalyserNode</code> you own as <code>analyser</code> and the meter only reads it.
		Here it reads a silent test tone, so the button needs no permission.
	</PlateExample>

	<PlateExample title="Size" example={example('size')}>
		Set <code>h-*</code>, <code>count</code>, and the <code>--voice-meter-dot</code> and
		<code>--voice-meter-gap</code> variables. The levels here are fixed numbers, so the row stands
		still.
	</PlateExample>

	<PlateExample title="Colour" example={example('colour')}>
		It draws in <code>currentColor</code>, <code>text-muted-foreground</code> by default. Set a text
		class to change it. The levels here are fixed numbers too.
	</PlateExample>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="VoiceMeter">
				<p>
					The row of dots. It is always <code>aria-hidden</code>, so say what is happening in words next
					to it. <code>levels</code>, <code>analyser</code> and <code>stream</code> exclude each other.
					Other attributes go to the root.
				</p>
				<PlateProps>
					<PlateProp name="levels" type="readonly number[]" default="[]">0 to 1, newest last. It glides one slot per new array.</PlateProp>
					<PlateProp name="analyser" type="AnalyserNode">Read, never closed: it stays yours.</PlateProp>
					<PlateProp name="stream" type="MediaStream">Read through its own AudioContext, closed when the meter goes. It never stops your tracks.</PlateProp>
					<PlateProp name="count" type="number" default="24">How many slots are visible.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="trackVoiceLevel" kind="function">
				<p>
					Reads how loud a source is, as one 0 to 1 value per <code>interval</code>, and returns the
					cleanup. The meter calls it for <code>analyser</code> and <code>stream</code>. Call it after a
					user gesture, or the browser keeps a new AudioContext suspended. On the server it does nothing.
				</p>
				<PlateProps>
					<PlateProp name="source" type="VoiceLevelSource" required />
					<PlateProp name="onLevel" type="(level: number) => void" required>Called once per interval, with the loudest moment since the last call.</PlateProp>
					<PlateProp name="options" type="VoiceLevelOptions" default={'{}'} />
				</PlateProps>
			</PlatePart>
			<PlatePart name="VoiceLevelOptions" kind="type">
				<p>The third argument of <code>trackVoiceLevel</code>.</p>
				<PlateProps>
					<PlateProp name="interval" type="number" default="90">Milliseconds between two samples, one meter slot each.</PlateProp>
					<PlateProp name="floorDb" type="number" default="-55">The dBFS that reads as 0, just above a quiet room.</PlateProp>
					<PlateProp name="ceilingDb" type="number" default="-15">The dBFS that reads as 1, close speech.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="VoiceLevelSource" kind="type">
				<p><code>AnalyserNode | MediaStream</code>: what <code>trackVoiceLevel</code> can read.</p>
			</PlatePart>
			<PlatePart name="VoiceMeterSource" kind="type">
				<p>The union that keeps <code>levels</code>, <code>analyser</code> and <code>stream</code> apart.</p>
			</PlatePart>
			<PlatePart name="VoiceMeterProps" kind="type">
				<p>The props above, for a wrapper: the root's attributes, <code>ref</code>, <code>count</code> and a <code>VoiceMeterSource</code>.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Height" value="24px" />
			<PlateMeasure label="Slots" value="24, plus one off the left edge" />
			<PlateMeasure label="Dot" value="4px" />
			<PlateMeasure label="Gap" value="6px" />
			<PlateMeasure label="Width" value="234px, never past its parent" />
			<PlateMeasure label="Edge fade" value="two slots, 20px" />
			<PlateMeasure label="Sample" value="one per 90ms" />
			<PlateMeasure label="Glide" value="linear, the time between samples, 40ms to 1000ms" />
			<PlateMeasure label="Envelope" value="rises in 40ms, decays over 160ms" />
			<PlateMeasure label="Range" value="-55 dBFS to -15 dBFS" />
			<PlateMeasure label="Analyser" value="fftSize 1024" />
			<PlateMeasure label="Reduced motion" value="no growth or drift, opacity 40% to 100%" />
		</PlateMeasures>
	</PlateSection>
</Plate>
