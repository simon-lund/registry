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
			After the markup bar in Claude Code's browser pane: the bar (select, comment, pen, shapes;
			colour, width; undo, redo, delete), a layer for the two tools that work on the page itself, the
			handles around a selected mark, and comments, a numbered pin and a box to write in. Select picks
			elements: each stays outlined with its tag, and you get the elements. Comment places a comment
			anywhere: you get the element under the click and the point on it, then the text when it is sent,
			and the pin follows that element. What a picked element means, what the pen and shapes draw, the
			history behind undo and redo, and saving are your app's; the demo shows one way. Outlines, pins
			and the comment box follow the page with Floating UI.
		</p>
		<PlateInstall name="markup" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Keys stay inside" example={example('keys')}>
		Open the comment and type. No key typed in a comment, the bar or its menus reaches the page, so a
		slide deck's space and arrows never turn the slide while you write. Escape closes the comment,
		then puts the tool down.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
			<li>Each group of tools and menus is one tab stop; the arrows move along it.</li>
			<li><code>Enter</code> or <code>Space</code> takes a tool up, or puts it down.</li>
			<li><code>Escape</code>, wherever focus is: an open menu closes, else the open comment, else the tool in hand is put down. With nothing open or in hand the page has its Escape back.</li>
			<li>A pin is a button: <code>Enter</code> or <code>Space</code> opens its comment, and focus goes into it.</li>
			<li>In a comment, <code>Enter</code> sends and <code>Shift+Enter</code> starts a new line. Sent or closed by Escape, focus goes back to its pin.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Markup">
				<p>The state, shared with the parts. Renders nothing of its own. Also exported as <code>Root</code>.</p>
				<PlateProps>
					<PlateProp name="tool" type={`"select" | "comment" | "pen" | "shape" | null`} default="null" bindable>The tool in hand; null: none, the page works as usual. Select picks elements; comment places a comment.</PlateProp>
					<PlateProp name="shape" type={`"line" | "arrow" | "rectangle" | "ellipse" | "step"`} default={`"rectangle"`} bindable>The kind the shape tool draws; a step is a numbered circle.</PlateProp>
					<PlateProp name="colour" type="string" default={`"var(--foreground)"`} bindable>Any CSS colour: the picked swatch's value.</PlateProp>
					<PlateProp name="width" type="number" default="3" bindable>In px.</PlateProp>
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
					<PlateProp name="value" type={`"select" | "comment" | "pen"`} required>The shape tool is MarkupShapes.</PlateProp>
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
			<PlatePart name="MarkupShapes">
				<p>The shape tool, drawn with the kind in hand, and a chevron that opens the kinds. Inside MarkupTools.</p>
				<PlateProps>
					<PlateProp name="icon" type={`Snippet<[{ shape }]>`} required>Draws the kind in hand on the button.</PlateProp>
					<PlateProp name="aria-label" type="string" required>Names the tool.</PlateProp>
					<PlateProp name="kindsLabel" type="string" required>Names the menu.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupShape">
				<p>One kind: its icon and name inside. Picking it takes the shape tool up.</p>
				<PlateProps>
					<PlateProp name="value" type={`"line" | "arrow" | "rectangle" | "ellipse" | "step"`} required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupAction">
				<p>A command (undo, redo, delete): a ghost icon Button with its label as a tooltip. What it does is your <code>onclick</code>.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="disabled" type="boolean">While there is nothing to do.</PlateProp>
					<PlateProp name="onclick" type="(e: MouseEvent) => void" />
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
			<PlatePart name="MarkupLayer">
				<p>The layer select and comment work on, over the page; it takes the pointer only while one of them is in hand. Select outlines the element under the pointer in grey with its tag, and a click adds it to <code>selected</code>, copper, or takes it out; picked elements stay outlined, following the page. Comment calls <code>onPlace</code> with where a click landed. Render it before the comments and the bar. Picking is by pointer only.</p>
				<PlateProps>
					<PlateProp name="selected" type="Element[]" default="[]" bindable>The picked elements, in the order picked.</PlateProp>
					<PlateProp name="onPlace" type={`(spot: { element: Element; at: { x: number; y: number } }) => void`}>The element under the comment tool's click and the point on it, as fractions of its box: give both to the pin.</PlateProp>
					<PlateProp name="root" type="Element | null">Only its descendants can be picked; the whole document by default.</PlateProp>
					<PlateProp name="label" type="(element: Element) => string">The tag on an outline; tag name and first class by default.</PlateProp>
					<PlateProp name="class" type="string">Covers the viewport (<code>fixed inset-0</code>); <code>absolute inset-0</code> covers a container.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupHighlight">
				<p>The outline around an element, its tag above it as children; MarkupLayer draws these, this is for one of your own. Draws only; clicks pass through.</p>
				<PlateProps>
					<PlateProp name="variant" type={`"default" | "muted"`} default={`"default"`}>Copper for picked; grey for only pointed at.</PlateProp>
					<PlateProp name="anchor" type="Element | null">The element; the outline follows it.</PlateProp>
					<PlateProp name="rect" type={`{ x, y, width, height }`}>Or a box, where you place it.</PlateProp>
					<PlateProp name="class" type="string">Position it: <code>fixed</code> or <code>absolute</code>.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupSelection">
				<p>Eight handles around a selected mark. Draws only: moving and resizing are yours.</p>
				<PlateProps>
					<PlateProp name="rect" type={`{ x, y, width, height }`} required>The mark's box.</PlateProp>
					<PlateProp name="onHold" type={`(handle: "move" | "n" | "ne" | … | "nw", e: PointerEvent) => void`}>A pointerdown on the body or a handle.</PlateProp>
					<PlateProp name="class" type="string">Position it.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupComment">
				<p>One comment: holds a pin and its box, renders nothing of its own. Open, it is on the Escape ladder; a press outside its box and pin closes it.</p>
				<PlateProps>
					<PlateProp name="open" type="boolean" default="false" bindable>Whether the box is open.</PlateProp>
					<PlateProp name="value" type="string" default={`""`} bindable>The text.</PlateProp>
					<PlateProp name="onSend" type="(text: string) => void">The trimmed text, when sent: save it here. The box closes, the text stays.</PlateProp>
					<PlateProp name="onOpenChange" type="(open: boolean) => void">To drop a comment closed empty.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupCommentPin">
				<p>The circle that opens the box; the number, or a check, goes inside. Give it the spot from <code>onPlace</code>, the element as <code>anchor</code> and the point as <code>at</code>: the pin places itself there and follows the element as the page scrolls, resizes or reflows. Anywhere else its centre sits on <code>left</code> and <code>top</code>; position it yourself. Either way, above your click layer. Other props go to its <code>button</code>.</p>
				<PlateProps>
					<PlateProp name="anchor" type="Element | null">The element the comment is on.</PlateProp>
					<PlateProp name="at" type={`{ x: number; y: number }`} default={`{ x: 0.5, y: 0.5 }`}>Where on the anchor, as fractions of its box.</PlateProp>
					<PlateProp name="variant" type={`"default" | "done"`} default={`"default"`}>Done is quiet.</PlateProp>
					<PlateProp name="aria-label" type="string" />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupCommentBox">
				<p>The box, while open: a field that grows with its text, with a MarkupCommentSend inside. It floats from the pin's corner to the side that has room, and that corner is pointed; with no side free it is moved to fit, round all round.</p>
				<PlateProps>
					<PlateProp name="placeholder" type="string" />
					<PlateProp name="aria-label" type="string">Names the box and its field.</PlateProp>
					<PlateProp name="name" type="string" />
					<PlateProp name="maxlength" type="number" />
					<PlateProp name="class" type="string">Goes to the box.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="MarkupCommentSend">
				<p>The box's submit, a primary icon Button; off while the text is empty.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Bar" value="popover surface, 1px line, 12px radius, 4px padding, shadow-lg; 16px from the bottom" />
			<PlateMeasure label="Tool" value="32px, 16px icon; in hand: primary" />
			<PlateMeasure label="Menu trigger" value="32px high: the value, then a 12px chevron" />
			<PlateMeasure label="Separator" value="1px × 20px, 4px each side" />
			<PlateMeasure label="Shape menu" value="a 32px tool and a 20px chevron; the menu a list of 32px rows, icon and name" />
			<PlateMeasure label="Highlight" value="1.5px primary outline, 2px out; its tag primary, 12px text, 6px above" />
			<PlateMeasure label="Handles" value="10px primary dots, 2px background ring, on the box's corners and sides; 26px targets" />
			<PlateMeasure label="Pin" value="24px circle, 2px background ring, shadow-md; primary, done: muted" />
			<PlateMeasure label="Comment" value="288px wide, popover surface, 12px radius (0 at the pin), shadow-lg; its corner on the pin's box corner; 8px from the screen's edge" />
			<PlateMeasure label="Comment field" value="one line, grows to 192px; send 28px inside, bottom right" />
		</PlateMeasures>
	</PlateSection>
</Plate>
