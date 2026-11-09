<script lang="ts">
	import {
		Plate,
		PlateSection,
		PlatePreview,
		PlateApi,
		PlatePart,
		PlateProps,
		PlateProp,
		PlateCode
	} from '#lib/book/plate/index.js';
	import { install } from '#lib/book/catalogue.js';
	import { examples, type Source } from '#lib/book/examples.js';
	import type { Component } from 'svelte';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
</script>

{#snippet preview(name: string)}
	<PlatePreview example={example(name)} class="min-h-56" />
{/snippet}

<Plate name="behaviours" title="Behaviours">
	<PlateSection title="Close watcher">
		<p>
			While a layer is open, the platform's close request closes it, last opened first. Reach for it
			on any layer you draw yourself, so a phone's back gesture closes the layer instead of leaving
			the page.
		</p>
		<p>
			The Android back gesture can't be shown on this page. On a phone, open both layers and go back
			once for each. On a desktop browser with <code>CloseWatcher</code>, the same close request is
			<code>Escape</code>, so try that here. Where the browser doesn't have it, the helper does
			nothing, and the line under the example says so.
		</p>
		{@render preview('close-watcher')}
		<PlateCode code={install('close-watcher')} label="install command" />
		<PlateApi>
			<PlatePart name="watchClose" kind="function">
				<p>
					Call it when the layer opens. It returns the function to call when the layer closes. A
					layer opened from a tap or a key gets its own back. One opened without a gesture (on load,
					from a timer) joins the watcher before it, and one back closes both.
				</p>
				<PlateProps head="Argument">
					<PlateProp name="onClose" type="() => void" required>
						Runs at most once, and may find the layer already closing: closing twice must be harmless.
					</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="closeWatcher" kind="attachment">
				<p><code>watchClose</code> for an element that exists exactly while the layer is open.</p>
				<PlateProps head="Argument">
					<PlateProp name="onClose" type="() => void" required />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Focus return">
		<p>
			Decides where focus goes when a layer closes or the focused control goes away, so it never
			drops to <code>body</code>. Reach for it whenever code removes what has focus.
		</p>
		<p>
			Open the files and remove them: focus moves to the next Remove, then to Close, then back to
			Open files. The line under the example follows it.
		</p>
		{@render preview('focus-return')}
		<PlateCode code={install('focus-return')} label="install command" />
		<PlateApi>
			<PlatePart name="returnFocus" kind="function">
				<p>
					For a layer's <code>onCloseAutoFocus</code>. In a microtask, if focus landed nowhere useful,
					it focuses the first target that can take it. A focused element that is still fine is left
					alone.
				</p>
				<PlateProps head="Argument">
					<PlateProp name="layer" type="Element | null | undefined" required>The layer that is closing.</PlateProp>
					<PlateProp name="...targets" type="FocusTarget[]">Where focus may go, in order; typically the trigger.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="focusFirst" kind="function">
				<p>Focuses the first target that can take focus and returns it, or <code>null</code> when none could.</p>
				<PlateProps head="Argument">
					<PlateProp name="...targets" type="FocusTarget[]" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="focusLost" kind="function">
				<p>
					True when focus is on <code>body</code>, gone from the document, inside <code>layer</code>,
					inside something inert, or in a dialog on its way out.
				</p>
				<PlateProps head="Argument">
					<PlateProp name="layer" type="Element | null" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="canFocus" kind="function">
				<p>True when the element is connected, shown, not disabled and not inside <code>inert</code>.</p>
				<PlateProps head="Argument">
					<PlateProp name="el" type="unknown" required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="tabStops" kind="function">
				<p>The Tab stops inside <code>root</code> that can take focus now, in document order.</p>
				<PlateProps head="Argument">
					<PlateProp name="root" type="ParentNode | Element" default="document" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="nextTabStop" kind="function">
				<p>The Tab stop after <code>from</code> in the whole document, or <code>null</code> at the end.</p>
				<PlateProps head="Argument">
					<PlateProp name="from" type="Element" required />
					<PlateProp name="direction" type="1 | -1" default="1">-1 is the one before it.</PlateProp>
					<PlateProp name="skip" type="Element | null">A layer that is being left.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="triggerOf" kind="function">
				<p>The control whose <code>aria-controls</code> names the layer's <code>id</code>, or <code>null</code>.</p>
				<PlateProps head="Argument">
					<PlateProp name="layer" type="Element | null | undefined" required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="FocusTarget" kind="type">
				<p>
					<code>{`Element | null | undefined | (() => Element | null | undefined)`}</code>: an element,
					or a function that finds one when it is needed.
				</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Inert outside">
		<p>
			While a modal layer is open, everything outside it is inert: not focusable, not clickable and
			gone for assistive tech. Reach for it on any modal surface you draw yourself. Nested layers
			give back only what they took.
		</p>
		{@render preview('inert-outside')}
		<PlateCode code={install('inert-outside')} label="install command" />
		<PlateApi>
			<PlatePart name="inertOutside" kind="attachment">
				<p>
					Put it on the layer's surface. Open means <code>data-state="open"</code> or no
					<code>data-state</code>; the page comes back the moment the state leaves <code>open</code>,
					before the exit motion. An element you made inert yourself is never touched.
				</p>
				<PlateProps head="Argument">
					<PlateProp name="options" type="InertOutsideOptions" default={'{}'} />
				</PlateProps>
			</PlatePart>
			<PlatePart name="InertOutsideOptions" kind="type">
				<p>The options of <code>inertOutside</code>.</p>
				<PlateProps head="Field">
					<PlateProp name="keep" type="string" default={`'[data-slot=toaster]'`}>
						A selector for what stays usable behind the layer, with the way up to it.
					</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="modalLayers" kind="object">
				<p>How many modal layers are open right now, for what has to stay reachable above them.</p>
				<PlateProps head="Field">
					<PlateProp name="open" type="number">Read only, and reactive.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="pressOnKept" kind="function">
				<p>
					True for a press on what stays usable. Pass it to the layer's
					<code>onInteractOutside</code>, so pressing Undo on a toast doesn't close the layer.
				</p>
				<PlateProps head="Argument">
					<PlateProp name="event" type="Event" required />
					<PlateProp name="keep" type="string" default={`'[data-slot=toaster]'`} />
				</PlateProps>
			</PlatePart>
			<PlatePart name="releaseInert" kind="function">
				<p>
					Gives the page back before the state says the layer closed. Call it from
					<code>onCloseAutoFocus</code>, because an inert trigger refuses focus. Layers opened after
					this one are released too. Harmless when nothing is held.
				</p>
				<PlateProps head="Argument">
					<PlateProp name="node" type="Element | null | undefined" required>The layer's surface.</PlateProp>
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Long press">
		<p>
			Turns a held finger into one call, the touch counterpart of a right-click. Reach for it where a
			touch screen shows an element's actions, and keep a visible control that opens the same thing.
		</p>
		<p>
			Hold the card with a finger or a pen for half a second. With a mouse, right-click it: the left
			button never long-presses. With a keyboard, focus Actions and press <code>Shift+F10</code> or
			the Menu key.
		</p>
		{@render preview('long-press')}
		<PlateCode code={install('long-press')} label="install command" />
		<PlateApi>
			<PlatePart name="longPress" kind="attachment">
				<p>
					Moving too far, lifting early or the browser starting a scroll cancels the press. The click a
					lifted press would deliver is swallowed for 400ms. Text selection and the iOS callout are off
					on the element while attached. It never sets <code>touch-action</code>.
				</p>
				<PlateProps head="Argument">
					<PlateProp name="onLongPress" type="(detail: LongPressDetail) => void" required />
					<PlateProp name="options" type="LongPressOptions" default={'{}'} />
				</PlateProps>
			</PlatePart>
			<PlatePart name="LongPressOptions" kind="type">
				<p>The options of <code>longPress</code>.</p>
				<PlateProps head="Field">
					<PlateProp name="delay" type="number" default="500">How long the finger rests, in ms. Reduced motion doesn't shorten it.</PlateProp>
					<PlateProp name="slop" type="number" default="8">How far it may drift, in px.</PlateProp>
					<PlateProp name="vibrate" type="number" default="10">A tick when it fires, in ms, where the device can; 0 for none.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="LongPressDetail" kind="type">
				<p>What started the press, and where.</p>
				<PlateProps head="Field">
					<PlateProp name="source" type={`'press' | 'contextmenu'`}>A held finger or pen, or the platform's own gesture.</PlateProp>
					<PlateProp name="pointerType" type="string"><code>touch</code>, <code>pen</code> or <code>mouse</code>; a right-click or a key reports <code>mouse</code>.</PlateProp>
					<PlateProp name="x" type="number">Viewport pixels.</PlateProp>
					<PlateProp name="y" type="number">Viewport pixels.</PlateProp>
					<PlateProp name="target" type="EventTarget | null">The element the press started on.</PlateProp>
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Form reset">
		<p>
			On a form's reset, puts a control drawn by bits-ui back to how it mounted, as a native control
			goes back to its attribute. Reach for it in any control that wraps a bits-ui primitive.
		</p>
		<p>Untick both and press Reset. The first goes back; the second stays as you left it.</p>
		{@render preview('form-reset')}
		<PlateCode code={install('form-reset')} label="install command" />
		<PlateApi>
			<PlatePart name="restoreOnReset" kind="function">
				<p>
					Call it from an <code>$effect</code> that reads the control's <code>ref</code>; it returns
					the cleanup. The form is the hidden input's, else the closest one. A cancelled reset is left
					alone. Take the mount snapshot in the component, because the effect can re-run.
				</p>
				<PlateProps head="Argument">
					<PlateProp name="el" type="Element" required>The control's root.</PlateProp>
					<PlateProp name="restore" type="() => void" required>Assign the mount state to the bound value. Don't call the change callback: a native reset fires none.</PlateProp>
					<PlateProp name="setDefault" type="(input: HTMLInputElement) => void">Runs once on the hidden input: set its <code>defaultChecked</code> or <code>defaultValue</code>.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="hiddenInputOf" kind="function">
				<p>The input bits-ui renders for a control with a <code>name</code>, right after its root, or <code>null</code>.</p>
				<PlateProps head="Argument">
					<PlateProp name="el" type="Element | null | undefined" required />
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Swipe">
		<p>
			The physics of a swipe, with no pointer handling and no defaults: the caller keeps the gesture
			and passes every number. Reach for it when you build something a finger throws, like a card or
			a toast.
		</p>
		<p>
			Drag the card right past about a fifth of its width, or flick it, and it leaves at your speed. Let go
			early and it springs home. Pull it left and it only gives a little. A click opens it, and the
			click that ends a drag doesn't.
		</p>
		{@render preview('swipe')}
		<PlateCode code={install('swipe')} label="install command" />
		<PlateApi>
			<PlatePart name="CARD_SWIPE_GESTURE" kind="constant">
				<p>The numbers a swiped card is tuned by. A named preset, never a default: pass it explicitly.</p>
				<PlateProps head="Field">
					<PlateProp name="slop" type="8">px before the axis locks.</PlateProp>
					<PlateProp name="hysteresis" type="6">px an armed zone holds below its threshold.</PlateProp>
					<PlateProp name="flick" type="0.5">px/ms: faster than this toward a side is a flick.</PlateProp>
					<PlateProp name="flickMin" type="16">px out before a flick counts.</PlateProp>
					<PlateProp name="rubber" type="32">px a side without zones can be pulled.</PlateProp>
					<PlateProp name="stale" type="60">ms: a finger that paused this long before lifting has no velocity.</PlateProp>
					<PlateProp name="window" type="100">ms of samples the velocity is measured over.</PlateProp>
					<PlateProp name="spring" type={'{ stiffness: 400, dampingRatio: 0.78 }'}>The way home.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="rubber" kind="function">
				<p>How far something pulled <code>d</code> px moves when it can give at most <code>max</code> px. Keeps the sign of <code>d</code>.</p>
				<PlateProps head="Argument">
					<PlateProp name="d" type="number" required />
					<PlateProp name="max" type="number" required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="exitDuration" kind="function">
				<p>How long something takes to leave on an ease-out at the finger's speed, in ms. No speed returns <code>base</code>.</p>
				<PlateProps head="Argument">
					<PlateProp name="dist" type="number" required>px to its exit.</PlateProp>
					<PlateProp name="speed" type="number" required>px/ms.</PlateProp>
					<PlateProp name="quick" type="number" required>The shortest it may take, in ms.</PlateProp>
					<PlateProp name="base" type="number" required>The longest it may take, in ms.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="VelocityTracker" kind="class">
				<p>The finger's velocity at release. <code>new VelocityTracker(window)</code> keeps <code>window</code> ms of samples, and always at least two. One per gesture.</p>
				<PlateProps head="Method">
					<PlateProp name="push" type="(t: number, x: number, y?: number) => void">One position per move, at an event's <code>timeStamp</code>. <code>y</code> defaults to 0.</PlateProp>
					<PlateProp name="velocity" type={'(at: number, stale: number) => { x: number; y: number }'}>px/ms on each axis. Zero with fewer than two samples, or when the last is older than <code>stale</code> ms.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="SwipeMotion" kind="class">
				<p>One animation-frame motion at a time for one swiped thing: a new one ends the one before.</p>
				<PlateProps head="Member">
					<PlateProp name="running" type="boolean">A motion is running. Read only.</PlateProp>
					<PlateProp name="stop" type="() => void">Ends the motion where it is.</PlateProp>
					<PlateProp name="tween" type="(duration: number, ease: (p: number) => number, frame: (eased: number, p: number) => void, done?: () => void) => void">A <code>duration</code> of 0 or less runs the last frame and <code>done</code> at once.</PlateProp>
					<PlateProp name="spring" type="(read: () => number[], write: (pos: number[]) => void, v0: number[], spring: SwipeSpring, done: () => void) => void">Home to 0 on every axis, starting at <code>v0</code> px/ms. At rest (within 0.3px, slower than 6px/s) it calls <code>done</code> without writing, so <code>done</code> puts it at 0.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="SwipeSpring" kind="type">
				<p>A spring's tuning for <code>SwipeMotion.spring</code>.</p>
				<PlateProps head="Field">
					<PlateProp name="stiffness" type="number" />
					<PlateProp name="dampingRatio" type="number" />
					<PlateProp name="timeScale" type="number">Above 1 speeds time up, below 1 slows it down.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ClickSwallow" kind="class">
				<p>Swallows the click that ends a drag. Armed only until the end of the task, so a click that never comes can't eat a later one.</p>
				<PlateProps head="Method">
					<PlateProp name="arm" type="() => void">On a drag's pointerup.</PlateProp>
					<PlateProp name="disarm" type="() => void">When a new press begins.</PlateProp>
					<PlateProp name="swallow" type="(event: Event) => boolean">From <code>onclickcapture</code>. Stops and cancels the event when armed, and returns whether it did.</PlateProp>
				</PlateProps>
			</PlatePart>
		</PlateApi>
	</PlateSection>
</Plate>
