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
	import meta from '#lib/registry/ui/markup/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/markup/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="markup" title="Markup">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<p>
			After the markup bar in Claude Code's browser pane. This is the bar only: it holds the tool,
			colour, width and note, and draws nothing on the page. What a tool does, where marks are kept
			and where a note goes are your app's.
		</p>
		<PlateInstall name="markup" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Sending" example={example('send')}>
		<code>onSend</code> gets the note and may return a promise. While it runs the bar is sending; if it
		rejects, the note is kept and Send's children get <code>status</code> "failed", to say Retry.
	</PlateExample>

	<PlateExample title="Keys stay inside" example={example('keys')}>
		No key typed in the bar or its menus reaches the page, so a slide deck's space and arrows never
		turn the slide while you write. Escape is the bar's while there is something to undo.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>The tools and the two menus are one tab stop; the arrows move along them.</li>
			<li><code>Enter</code> or <code>Space</code> takes a tool up, or puts it down.</li>
			<li><code>Escape</code>, wherever focus is: an open menu closes, else the tool in hand is put down. With nothing in hand the page has its Escape back.</li>
			<li>In the note, <code>Enter</code> sends.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Markup">
				<p>The state, shared with the parts. Renders nothing of its own. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="tool" type={`"select" | "pen" | null`} default="null" bindable>The tool in hand; null: none, the page works as usual.</PlateProp>
					<PlateProp name="colour" type="string" default={`"var(--foreground)"`} bindable>Any CSS colour: the picked swatch's value.</PlateProp>
					<PlateProp name="width" type="number" default="3" bindable>In px.</PlateProp>
					<PlateProp name="note" type="string" default={`""`} bindable />
					<PlateProp name="onSend" type="(note: string) => void | Promise<void>">Sending while its promise runs; failed when it rejects; the note clears when it fulfils.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupBar">
				<p>The floating bar, fixed at the bottom centre; place it with <code>class</code>. Keeps keys from the page and owns Escape. Other props go to its <code>div</code>.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string">Its name.</PlateProp>
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupTools">
				<p>The tools and menus as one toolbar (bits-ui Toolbar).</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string">Its name.</PlateProp>
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupTool">
				<p>A tool, a toggle. The icon goes inside; the label shows as a tooltip.</p>
				<PlateProps>
					<PlateProp name="value" type={`"select" | "pen"`} required />
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupColors">
				<p>The colour menu; put a <code>ColorPickerSwatch</code> per colour inside.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupWidths">
				<p>The width menu; put a <code>MarkupWidth</code> per width inside.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupWidth">
				<p>One width, drawn as a line.</p>
				<PlateProps>
					<PlateProp name="value" type="number" required>In px.</PlateProp>
					<PlateProp name="aria-label" type="string" required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupNote">
				<p>The note: a stock Input in a form. Put a <code>MarkupSend</code> inside.</p>
				<PlateProps>
					<PlateProp name="placeholder" type="string" />
					<PlateProp name="aria-label" type="string">Or <code>aria-labelledby</code>.</PlateProp>
					<PlateProp name="name" type="string" />
					<PlateProp name="maxlength" type="number" />
					<PlateProp name="class" type="string">Goes to the form.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupSend">
				<p>A submit Button, primary. Other Button props apply.</p>
				<PlateProps>
					<PlateProp name="children" type={`Snippet<[{ status: "ready" | "sending" | "failed" }]>`}>Shown unless sending.</PlateProp>
					<PlateProp name="size" type="Button size" default={`"icon-sm"`} />
					<PlateProp name="aria-label" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupClose">
				<p>A ghost icon Button; closing is your <code>onclick</code>.</p>
				<PlateProps>
					<PlateProp name="onclick" type="(e: MouseEvent) => void" />
					<PlateProp name="aria-label" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupSeparator">
				<p>A fine vertical line between groups.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Bar" value="popover surface, 1px line, 12px radius, 4px padding, shadow-lg; 16px from the bottom" />
			<PlateMeasure label="Tool" value="32px, 16px icon; in hand: primary" />
			<PlateMeasure label="Menu trigger" value="32px high: the value, then a 12px chevron" />
			<PlateMeasure label="Separator" value="1px × 20px, 4px each side" />
			<PlateMeasure label="Note" value="32px high, flat until focus" />
			<PlateMeasure label="Send" value="28px, primary; a Spinner while sending" />
		</PlateMeasures>
	</PlateSection>
</Plate>
