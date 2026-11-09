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
	import meta from '#lib/registry/ui/color-picker/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/color-picker/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="color-picker" title="Color picker">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="color-picker" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Hex" example={example('format-hex')}>
		The default <code>format</code>. It writes <code>#rrggbb</code>, in lower case.
	</PlateExample>

	<PlateExample title="RGB" example={example('format-rgb')}>
		<code>format="rgb"</code> writes <code>rgb(r g b)</code> with channels from 0 to 255.
	</PlateExample>

	<PlateExample title="HSL" example={example('format-hsl')}>
		<code>format="hsl"</code> writes <code>hsl(h s% l%)</code>. A new format applies from the next
		change: the value is never rewritten on its own.
	</PlateExample>

	<PlateExample title="OKLCH" example={example('format-oklch')}>
		<code>format="oklch"</code> writes <code>oklch(l% c h)</code>. The picker reads all four formats
		whichever one it writes.
	</PlateExample>

	<PlateExample title="OKLCH area" example={example('oklch-area')}>
		<code>space="oklch"</code> makes the area chroma across and lightness up, so equal steps look
		equal, and evens out the hue track. Where sRGB ends the surface shows through: the gamut's real
		shape at this hue. A point outside is taken to the edge.
	</PlateExample>

	<PlateExample title="Alpha" example={example('alpha')}>
		Set <code>alpha</code> and add <code>ColorPickerAlpha</code>. Alpha is written only while the
		colour is not opaque. Without <code>alpha</code> the colour is always opaque and the slider
		renders nothing.
	</PlateExample>

	<PlateExample title="Swatches only" example={example('swatches')}>
		<code>ColorPickerSwatches</code> alone is the whole picker for a fixed palette. A swatch shows as
		picked when it matches at 8 bits per channel. Lay them out with a class.
	</PlateExample>

	<PlateExample title="Sliders and field" example={example('sliders')}>
		Every part is optional. Leave the area out where a small control is enough.
	</PlateExample>

	<PlateExample title="Invalid text" example={example('invalid')}>
		Enter or leaving the field checks it. Use <code>bind:invalid</code> to say what to fix, and
		<code>aria-describedby</code> to tie the message to the field. The colour stays as it was.
	</PlateExample>

	<PlateExample title="Saving" example={example('commit')}>
		<code>bind:value</code> follows every move. <code>onValueCommit</code> fires at the end of a
		gesture, so save there.
	</PlateExample>

	<PlateExample title="Eye dropper" example={example('eye-dropper')}>
		<code>ColorPickerEyeDropper</code> picks from anywhere on screen. Browsers without
		<code>EyeDropper</code> (Safari, Firefox, phones) get nothing at all, so lay it out to work without it.
	</PlateExample>

	<PlateExample title="In a popover" example={example('trigger')}>
		Render <code>ColorPickerTrigger</code> through an overlay's trigger and spread its props. The
		parts inside still read the root's colour. This one is the Popover from bits-ui.
	</PlateExample>

	<PlateExample title="Disabled" example={example('disabled')}>
		<code>disabled</code> on the root disables every part.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex flex-col gap-1 pl-5">
			<li>Area: arrows move 1%; with <code>Shift</code>, 10%.</li>
			<li>Area: <code>PageUp</code> and <code>PageDown</code> move up and down 10%, <code>Home</code> and <code>End</code> left and right 10%.</li>
			<li>Hue: arrows step 1 degree; with <code>Shift</code>, or <code>PageUp</code> and <code>PageDown</code>, 15. <code>Home</code> and <code>End</code> go to the ends.</li>
			<li>Alpha: arrows step 1%; with <code>Shift</code>, or <code>PageUp</code> and <code>PageDown</code>, 10%. <code>Home</code> and <code>End</code> go to the ends.</li>
			<li>Swatches: <code>Tab</code> enters at the picked one; arrows move and pick, wrapping.</li>
			<li>Field: <code>Enter</code> commits. <code>Escape</code> puts the current colour back; with nothing to undo it passes on, so an overlay still closes.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="ColorPicker">
				<p>Holds the colour and hands it to the parts. Renders nothing itself.</p>
				<PlateProps>
					<PlateProp name="value" type="string" bindable>A CSS colour string: hex, rgb(), hsl() or oklch(). Empty or unreadable shows black until someone picks.</PlateProp>
					<PlateProp name="format" type={`"hex" | "rgb" | "hsl" | "oklch"`} default={`"hex"`}>What it writes into value.</PlateProp>
					<PlateProp name="alpha" type="boolean" default="false">Keep and write the alpha, and show ColorPickerAlpha.</PlateProp>
					<PlateProp name="space" type={`"hsv" | "oklch"`} default={`"hsv"`}>The model of the area and the hue slider.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false">Disables every part.</PlateProp>
					<PlateProp name="onValueCommit" type="(value: string) => void">The end of a gesture: pointer up, a key step, a pick, the field's Enter or blur.</PlateProp>
					<PlateProp name="children" type="Snippet" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerArea">
				<p>The 2D field: a group of two range inputs, one per channel. Also takes a div's attributes.</p>
				<PlateProps>
					<PlateProp name="channelLabels" type="[string, string]" required>The two channels' names for assistive tech, across then up.</PlateProp>
					<PlateProp name="getValueText" type={`(value: { x: number; y: number }) => string`}>Both channels in words. hsv: 0 to 100 each. oklch: chroma with three decimals, lightness 0 to 100.</PlateProp>
					<PlateProp name="aria-label" type="string">Or aria-labelledby: name the group.</PlateProp>
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string">Full width and 4:3 by default.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerHue">
				<p>The hue slider, 0 to 360, on bits-ui's Slider.</p>
				<PlateProps>
					<PlateProp name="getValueText" type="(hue: number) => string">Its aria-valuetext.</PlateProp>
					<PlateProp name="aria-label" type="string" />
					<PlateProp name="aria-labelledby" type="string" />
					<PlateProp name="aria-describedby" type="string" />
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerAlpha">
				<p>The opacity slider, 0 to 100, on bits-ui's Slider. Renders only with the root's <code>alpha</code>.</p>
				<PlateProps>
					<PlateProp name="getValueText" type="(percent: number) => string">Its aria-valuetext.</PlateProp>
					<PlateProp name="aria-label" type="string" />
					<PlateProp name="aria-labelledby" type="string" />
					<PlateProp name="aria-describedby" type="string" />
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerSwatches">
				<p>A palette, on bits-ui's RadioGroup. Also takes its root's props, except <code>value</code>, <code>onValueChange</code> and <code>disabled</code>, which the picker owns.</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string">Or aria-labelledby: name the palette.</PlateProp>
					<PlateProp name="children" type="Snippet">The swatches.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string">A wrapping row with 8px gaps by default.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerSwatch">
				<p>One preset, on bits-ui's RadioGroup item.</p>
				<PlateProps>
					<PlateProp name="value" type="string" required>The colour: hex, rgb(), hsl() or oklch().</PlateProp>
					<PlateProp name="aria-label" type="string" required>The colour's name.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerInput">
				<p>
					The colour as hex in a stock Input, with a leading swatch, whatever <code>format</code> the
					root writes. A pasted <code>rgb()</code>, <code>hsl()</code> or <code>oklch()</code> reads too.
					Other attributes go on the input, except <code>type</code>, <code>value</code>,
					<code>files</code> and <code>disabled</code>.
				</p>
				<PlateProps>
					<PlateProp name="invalid" type="boolean" default="false" bindable>Whether the field holds something unreadable, after Enter or blur.</PlateProp>
					<PlateProp name="aria-label" type="string">Or aria-labelledby: name the field.</PlateProp>
					<PlateProp name="ref" type="HTMLInputElement | null" default="null" bindable />
					<PlateProp name="class" type="string">Goes on the wrapper.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerEyeDropper">
				<p>
					The pipette, a stock Button. Renders nothing during server rendering or where the browser
					has no <code>EyeDropper</code>. Also takes Button's props, except <code>href</code>.
				</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required />
					<PlateProp name="children" type="Snippet">Replaces the icon.</PlateProp>
					<PlateProp name="onclick" type="(e: MouseEvent) => void">Runs first; preventDefault stops the pick.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorPickerTrigger">
				<p>
					The colour as a stock Button, to open the picker in an overlay. Also takes Button's props,
					except <code>href</code>, <code>variant</code> and <code>size</code>.
				</p>
				<PlateProps>
					<PlateProp name="aria-label" type="string" required>Say what it is and, ideally, the colour.</PlateProp>
					<PlateProp name="disabled" type="boolean" default="false">The root's disabled wins.</PlateProp>
					<PlateProp name="children" type="Snippet">Drawn over the swatch.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="parseColor" kind="function">
				<p>
					<code>parseColor(input: string | null | undefined): Rgb | null</code>. Reads hex (the
					<code>#</code> optional), <code>rgb()</code>, <code>hsl()</code> and <code>oklch()</code>, in
					comma or space syntax. Out-of-gamut <code>oklch()</code> is mapped into sRGB. Anything else,
					named colours included, is <code>null</code>.
				</p>
			</PlatePart>
			<PlatePart name="formatColor" kind="function">
				<p>
					<code>formatColor(rgb: Rgb, format: ColorFormat, alpha = false): string</code>. Writes a colour
					in a format, in space syntax. Alpha appears only when <code>alpha</code> is on and the colour
					is not opaque.
				</p>
			</PlatePart>
			<PlatePart name="toHex" kind="function">
				<p><code>toHex(rgb: Rgb, alpha = false): string</code>. <code>#rrggbb</code>, or <code>#rrggbbaa</code> when <code>alpha</code> is on and the colour is not opaque.</p>
			</PlatePart>
			<PlatePart name="rgbToHsv" kind="function">
				<p><code>rgbToHsv(rgb: Rgb): Hsv</code>. A grey has hue 0; black has saturation 0.</p>
			</PlatePart>
			<PlatePart name="hsvToRgb" kind="function">
				<p><code>hsvToRgb(hsv: Hsv): Rgb</code>.</p>
			</PlatePart>
			<PlatePart name="rgbToHsl" kind="function">
				<p><code>rgbToHsl(rgb: Rgb): Hsl</code>.</p>
			</PlatePart>
			<PlatePart name="hslToRgb" kind="function">
				<p><code>hslToRgb(hsl: Hsl): Rgb</code>.</p>
			</PlatePart>
			<PlatePart name="rgbToOklch" kind="function">
				<p><code>rgbToOklch(rgb: Rgb): Oklch</code>. A grey has hue 0.</p>
			</PlatePart>
			<PlatePart name="oklchToRgb" kind="function">
				<p><code>oklchToRgb(color: Oklch): Rgb</code>. Channels are clamped; call <code>gamutMap</code> first for a true match.</p>
			</PlatePart>
			<PlatePart name="gamutMap" kind="function">
				<p><code>gamutMap(color: Oklch): Oklch</code>. Brings a colour into sRGB by reducing its chroma, keeping lightness and hue.</p>
			</PlatePart>
			<PlatePart name="inGamut" kind="function">
				<p><code>inGamut(color: Oklch): boolean</code>. Whether the colour lies inside sRGB.</p>
			</PlatePart>
			<PlatePart name="maxChroma" kind="function">
				<p><code>maxChroma(l: number, h: number): number</code>. The largest chroma at this lightness and hue reached from the grey axis without leaving sRGB.</p>
			</PlatePart>
			<PlatePart name="sameColor" kind="function">
				<p><code>sameColor(a: Rgb | null, b: Rgb | null): boolean</code>. Whether two colours match at 8 bits per channel, alpha included.</p>
			</PlatePart>
			<PlatePart name="Rgb" kind="type">
				<p>sRGB, each from 0 to 1.</p>
				<PlateProps head="Field">
					<PlateProp name="r" type="number" required />
					<PlateProp name="g" type="number" required />
					<PlateProp name="b" type="number" required />
					<PlateProp name="a" type="number" required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="Hsv" kind="type">
				<PlateProps head="Field">
					<PlateProp name="h" type="number" required>0 to 360.</PlateProp>
					<PlateProp name="s" type="number" required>0 to 1.</PlateProp>
					<PlateProp name="v" type="number" required>0 to 1.</PlateProp>
					<PlateProp name="a" type="number" required>0 to 1.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="Hsl" kind="type">
				<PlateProps head="Field">
					<PlateProp name="h" type="number" required>0 to 360.</PlateProp>
					<PlateProp name="s" type="number" required>0 to 1.</PlateProp>
					<PlateProp name="l" type="number" required>0 to 1.</PlateProp>
					<PlateProp name="a" type="number" required>0 to 1.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="Oklch" kind="type">
				<PlateProps head="Field">
					<PlateProp name="l" type="number" required>0 to 1.</PlateProp>
					<PlateProp name="c" type="number" required>Absolute chroma, 0 to about 0.37.</PlateProp>
					<PlateProp name="h" type="number" required>0 to 360.</PlateProp>
					<PlateProp name="a" type="number" required>0 to 1.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ColorFormat" kind="type">
				<p><code>"hex" | "rgb" | "hsl" | "oklch"</code></p>
			</PlatePart>
			<PlatePart name="ColorSpace" kind="type">
				<p><code>"hsv" | "oklch"</code></p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Area" value="full width, 4:3, radius 6px" />
			<PlateMeasure label="Area thumb" value="24px, 3px ring; 1.2x while held" />
			<PlateMeasure label="OKLCH canvas" value="at most 320px wide, one repaint a frame" />
			<PlateMeasure label="Slider" value="44px high, 32px track" />
			<PlateMeasure label="Slider thumb" value="30 x 32px, 22 x 30px drawn; 0.97x while held" />
			<PlateMeasure label="Hue track" value="13 stops, every 30 degrees; OKLCH at L 72%, C 0.15" />
			<PlateMeasure label="Checkerboard" value="12px squares" />
			<PlateMeasure label="Swatch" value="32px, 44px to touch, 8px gaps" />
			<PlateMeasure label="Picked swatch" value="2px ring, disc at 0.7x" />
			<PlateMeasure label="Field" value="32px high (stock Input), 20px swatch set in 6px" />
			<PlateMeasure label="Eye dropper" value="32px, 44px to touch" />
			<PlateMeasure label="Trigger" value="32px, 44px to touch; colour set in 4px" />
			<PlateMeasure label="Hairline" value="1px, foreground at 10%" />
			<PlateMeasure label="Disabled" value="50% opacity" />
			<PlateMeasure label="Motion" value="140ms on settle; a press 80ms" />
		</PlateMeasures>
	</PlateSection>
</Plate>
