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
	import meta from '#lib/registry/ui/terminal/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/terminal/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="terminal" title="Terminal">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="terminal" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Colours" example={example('colors')}>
		Pass the output with its ANSI escapes. The 16 colours come from <code>--terminal-*</code>
		variables in the component, a set for light and one for dark, each at least 4.5:1 on
		<code>muted</code>. A 256 or truecolour value is shown as it came, so it can read less well in
		one theme.
	</PlateExample>

	<PlateExample title="Empty" example={example('empty')}>
		Put a <code>TerminalEmpty</code> in the content. It shows while there are no lines and no stream.
		The copy button is disabled until there is text.
	</PlateExample>

	<PlateExample title="Running" example={example('running')}>
		Set <code>streaming</code> while output is arriving, for the cursor and <code>aria-busy</code>.
		Say what is happening in a <code>TerminalStatus</code>.
	</PlateExample>

	<PlateExample title="Following the output" example={example('follow')}>
		Give the content a height. It stays at the end while lines arrive. Scroll up and it stays where
		you are; scroll back to the end and it follows again.
	</PlateExample>

	<PlateExample title="Without wrapping" example={example('no-wrap')}>
		Set <code>wrap={'{false}'}</code> on the content for tables and progress bars. Lines keep their
		columns and scroll sideways.
	</PlateExample>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Terminal">
				<p>The root: owns the output and parses it once for the parts. While it only grows, only the new tail is parsed. While streaming, updates come once per animation frame.</p>
				<PlateProps>
					<PlateProp name="output" type="string | readonly string[]" default={`""`}>With ANSI escapes and newlines, or one string per line. Styles carry across lines. A bare carriage return starts its line over. Assign a new value as it grows: a push onto a <code>$state</code> array is not seen while streaming.</PlateProp>
					<PlateProp name="streaming" type="boolean" default="false">Output is still arriving: a cursor at the end, <code>aria-busy</code> on the log.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalHeader">
				<p>The bar above the output: the title at the start, the actions at the end.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalTitle">
				<p>What the output is, with an optional leading icon. It names the log for screen readers. A long title ends in an ellipsis.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalStatus">
				<p>A short state next to the title, with an optional Spinner or icon. A polite live region, so a change is announced once.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalActions">
				<p>The row of icon buttons at the end of the header.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalButton">
				<p>An icon action in the header, a stock ghost Button. Takes every Button prop. Use it for your own actions.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalCopyButton">
				<p>Copies the output without its escapes. The icon turns into a check, and a live region says so once. Disabled while there is no text. Takes every TerminalButton prop but <code>children</code>.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="copiedLabel" type="string" required>The button's name while it shows the check.</PlateProp>
					<PlateProp name="timeout" type="number" default="2000">How long the check stays, in ms.</PlateProp>
					<PlateProp name="onCopy" type="() => void" />
					<PlateProp name="onError" type="(error: Error) => void">The clipboard refused. The button stays as it was.</PlateProp>
					<PlateProp name="onclick" type="(event: MouseEvent) => void">Call <code>preventDefault</code> to skip the copy.</PlateProp>
					<PlateProp name="disabled" type="boolean">By default, whether there is no text.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalClearButton">
				<p>The broom. The output is yours: empty it in <code>onclick</code>. Takes every TerminalButton prop. Children replace the icon.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalContent">
				<p>The output, in a native scrolling box with a <code>role="log"</code> inside. Children render after the lines.</p>
				<PlateProps>
					<PlateProp name="wrap" type="boolean" default="true">Wrap long lines, or keep them and scroll sideways.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable>The scrolling box.</PlateProp>
					<PlateProp name="class" type="string">Set <code>h-*</code> for a fixed height, or <code>[--terminal-max-h:…]</code> for another limit.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="TerminalEmpty">
				<p>What the content says while there is no output and none is arriving. Words only.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="parseAnsi" kind="function">
				<p><code>(output: string | readonly string[]) => AnsiLine[]</code>. Parses SGR styles and colours (16, 256, truecolour). Every other escape is dropped. It produces data, never HTML.</p>
			</PlatePart>
			<PlatePart name="parseAnsiIncremental" kind="function">
				<p><code>(output: string | readonly string[], previous?: AnsiParse) => AnsiParse</code>. Like <code>parseAnsi</code>, but when the output only grew it keeps the finished lines and parses the rest.</p>
			</PlatePart>
			<PlatePart name="stripAnsi" kind="function">
				<p><code>(output: string | readonly string[]) => string</code>. The text without its escapes, as the copy button copies it.</p>
			</PlatePart>
			<PlatePart name="ANSI_COLOR_NAMES" kind="constant">
				<p>The 16 colour names in SGR order: <code>black</code> to <code>white</code>, then <code>bright-black</code> to <code>bright-white</code>.</p>
			</PlatePart>
			<PlatePart name="AnsiColor" kind="type">
				<p><code>{'{ kind: "ansi"; index: number } | { kind: "rgb"; r: number; g: number; b: number }'}</code></p>
			</PlatePart>
			<PlatePart name="AnsiStyle" kind="type">
				<p>The style of a run: optional <code>fg</code>, <code>bg</code>, <code>bold</code>, <code>dim</code>, <code>italic</code>, <code>underline</code> and <code>inverse</code>.</p>
			</PlatePart>
			<PlatePart name="AnsiSegment" kind="type">
				<p><code>{'{ text: string; style: AnsiStyle }'}</code></p>
			</PlatePart>
			<PlatePart name="AnsiLine" kind="type">
				<p><code>AnsiSegment[]</code>. An empty line has no segments.</p>
			</PlatePart>
			<PlatePart name="AnsiParse" kind="type">
				<p>What <code>parseAnsiIncremental</code> keeps between calls: <code>source</code>, <code>lines</code>, <code>complete</code>, <code>boundary</code> and <code>style</code>.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Surface" value="muted, 1px border, 8px radius" />
			<PlateMeasure label="Header" value="at least 48px, 16px in at the start, 6px at the end" />
			<PlateMeasure label="Header text" value="12px" />
			<PlateMeasure label="Icon button" value="36px, 44px to touch, 4px apart" />
			<PlateMeasure label="Output" value="13px on a 20px line, monospace, tab size 4" />
			<PlateMeasure label="Output padding" value="16px, 4px at the top" />
			<PlateMeasure label="Height" value="at most 384px by default" />
			<PlateMeasure label="Follows when" value="within 8px of the end" />
			<PlateMeasure label="Top fade" value="16px, once lines are above the view" />
			<PlateMeasure label="Cursor" value="0.6em × 1.15em, blinks every 1.1s" />
			<PlateMeasure label="Copied" value="2000ms, 220ms swap" />
			<PlateMeasure label="Colour contrast" value="at least 4.5:1 on muted, both themes" />
		</PlateMeasures>
	</PlateSection>
</Plate>
