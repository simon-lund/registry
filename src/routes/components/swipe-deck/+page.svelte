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
	import meta from '#lib/registry/ui/swipe-deck/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/swipe-deck/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<!-- a flying card passes the deck's edges: on this page it ends at the edge of its preview -->
<div class="flights">
	<Plate name="swipe-deck" title="Swipe deck">
		<PlateStage example={example('demo')} />

		<PlateSection title="Installation">
			<PlateInstall name="swipe-deck" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
		</PlateSection>

		<PlateSection title="Usage">
			<p>
				Cards are children: any markup, or a snippet you render inside <code>SwipeDeckCard</code>. Give
				the content <code>h-full</code> and its own surface and border. A flying card passes the deck's
				edges, so give the column around it <code>overflow-x: clip</code>.
			</p>
			<PlateCode code={usage.code} html={usage.html} label="usage" />
		</PlateSection>

		<PlateExample title="Empty" example={example('empty')}>
			With no cards, <code>SwipeDeckEmpty</code> shows from the start. The buttons stay in place, disabled.
		</PlateExample>

		<PlateExample title="Finished" example={example('finished')}>
			Once the last card is gone, <code>SwipeDeckEmpty</code> stands where the cards stood and Undo stays
			live. An undo takes it away at once.
		</PlateExample>

		<PlateExample title="Undo" example={example('undo')}>
			Undo is live once a card has gone, and turns off when the history runs out. Reverse your own
			change in <code>onUndo</code>, and set the depth with <code>historyLimit</code>.
		</PlateExample>

		<PlateExample title="One direction" example={example('one-direction')}>
			A direction without a <code>SwipeDeckLabel</code> is off. Dragging that way only rubber-bands, up
			to 32px, and its button and key do nothing.
		</PlateExample>

		<PlateExample title="Three directions" example={example('three-directions')}>
			Add a label with <code>direction="up"</code>. An upward finger is then the card's, and a downward
			one still scrolls the page.
		</PlateExample>

		<PlateExample title="Keep a card" example={example('keep')}>
			Return <code>false</code> from <code>onSwipe</code> to keep the card. A dragged card springs home,
			and nothing goes into the history. Try archiving the pinned note.
		</PlateExample>

		<PlateExample title="Thresholds" example={example('thresholds')}>
			Set <code>thresholds</code> on a card, as a fraction of its width, to make one direction take a
			longer drag. Here Delete needs half the card. A flick still commits.
		</PlateExample>

		<PlateExample title="Peek" example={example('peek')}>
			Set <code>peek</code> from 0 to 3 for how many cards show behind the top one.
		</PlateExample>

		<PlateSection title="Keyboard">
			<ul class="m-0 flex list-disc flex-col gap-1 pl-5">
				<li>The deck is one tab stop.</li>
				<li><code>ArrowLeft</code>, <code>ArrowRight</code> and <code>ArrowUp</code> send the top card that way, if it has a label for it.</li>
				<li><code>Backspace</code>, <code>Cmd+Z</code> and <code>Ctrl+Z</code> undo.</li>
				<li>A held key does not repeat, and keys typed into a field inside a card are left alone.</li>
				<li>The words of the committed label are announced.</li>
			</ul>
		</PlateSection>

		<PlateSection title="API Reference">
			<PlateApi>
				<PlatePart name="SwipeDeck">
					<p>The root: one tab stop, the keys, the order and the history. Give it an <code>aria-label</code>. Other props go to its <code>div</code>.</p>
					<PlateProps>
						<PlateProp name="peek" type="number" default="2">How many cards show behind the top one, 0 to 3.</PlateProp>
						<PlateProp name="historyLimit" type="number" default="10">How many swipes undo can take back.</PlateProp>
						<PlateProp name="onSwipe" type="SwipeDeckSwipeHandler">A card started leaving. Return <code>false</code> to keep it.</PlateProp>
						<PlateProp name="onUndo" type="SwipeDeckUndoHandler">A card came back: reverse what its swipe did.</PlateProp>
						<PlateProp name="onkeydown" type="KeyboardEventHandler">Runs first; <code>preventDefault()</code> turns the deck's keys off for that press.</PlateProp>
						<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
						<PlateProp name="class" type="string" />
						<PlateProp name="children" type="Snippet" />
					</PlateProps>
				</PlatePart>
				<PlatePart name="swipe" kind="method">
					<p><code>swipe(direction, via = 'call')</code> through <code>bind:this</code> on the root. Sends the top card that way, as its button does. Returns whether it could.</p>
				</PlatePart>
				<PlatePart name="undo" kind="method">
					<p><code>undo(via = 'call')</code> through <code>bind:this</code> on the root. Brings the last swiped card back. Returns whether there was one.</p>
				</PlatePart>
				<PlatePart name="SwipeDeckStack">
					<p>The stage: every card and the empty state share one grid cell, stretched to the tallest card. Its bottom padding is the peek. Other props go to its <code>div</code>.</p>
					<PlateProps>
						<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
						<PlateProp name="class" type="string" />
						<PlateProp name="children" type="Snippet" />
					</PlateProps>
				</PlatePart>
				<PlatePart name="SwipeDeckCard">
					<p>
						One card, any content. Only the top card is live, and only while dragged does it have a shadow.
						Set <code>--swipe-deck-face</code> if the surface is not <code>--card</code>, and
						<code>--swipe-deck-radius</code> if it is not <code>rounded-lg</code>. Other props go to its <code>div</code>.
					</p>
					<PlateProps>
						<PlateProp name="value" type="string" required>Its identity, unique in the deck.</PlateProp>
						<PlateProp name="thresholds" type="SwipeDeckThresholds">Fractions of the card's width, per direction.</PlateProp>
						<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
						<PlateProp name="class" type="string" />
						<PlateProp name="children" type="Snippet" />
					</PlateProps>
				</PlatePart>
				<PlatePart name="SwipeDeckLabel">
					<p>
						Inside a card: turns a direction on, and is the word that grows while the card is dragged that
						way. Tonal until the threshold, then primary. Hidden from assistive tech. Other props and
						<code>class</code> go to the pill; its <code>data-state</code> is <code>hidden</code>,
						<code>approaching</code> or <code>armed</code>.
					</p>
					<PlateProps>
						<PlateProp name="direction" type="SwipeDeckDirection" required />
						<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
						<PlateProp name="class" type="string" />
						<PlateProp name="children" type="Snippet">An icon and a word. The word is what gets announced.</PlateProp>
					</PlateProps>
				</PlatePart>
				<PlatePart name="SwipeDeckEmpty">
					<p>Shown while no card is left, as a polite status. Other props go to its <code>div</code>.</p>
					<PlateProps>
						<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
						<PlateProp name="class" type="string" />
						<PlateProp name="children" type="Snippet" />
					</PlateProps>
				</PlatePart>
				<PlatePart name="SwipeDeckActions">
					<p>The centred row of buttons. Other props go to its <code>div</code>.</p>
					<PlateProps>
						<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
						<PlateProp name="class" type="string" />
						<PlateProp name="children" type="Snippet" />
					</PlateProps>
				</PlatePart>
				<PlatePart name="SwipeDeckAction">
					<p>A <code>Button</code> that sends the top card toward its direction. Disabled while the top card cannot go there; focus moves on first. Takes every other <code>Button</code> prop.</p>
					<PlateProps>
						<PlateProp name="direction" type="SwipeDeckDirection" required />
						<PlateProp name="variant" type="ButtonVariant" default={`"outline"`}>Give the one main action <code>"default"</code>.</PlateProp>
						<PlateProp name="disabled" type="boolean" default="false" />
						<PlateProp name="onclick" type="MouseEventHandler">Runs first; <code>preventDefault()</code> stops the swipe.</PlateProp>
						<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					</PlateProps>
				</PlatePart>
				<PlatePart name="SwipeDeckUndo">
					<p>A <code>Button</code> that brings the last swiped card back. Disabled while there is nothing to undo; focus moves to the deck first. Takes every other <code>Button</code> prop.</p>
					<PlateProps>
						<PlateProp name="aria-label" type="string" required />
						<PlateProp name="variant" type="ButtonVariant" default={`"ghost"`} />
						<PlateProp name="size" type="ButtonSize" default={`"icon"`} />
						<PlateProp name="disabled" type="boolean" default="false" />
						<PlateProp name="onclick" type="MouseEventHandler">Runs first; <code>preventDefault()</code> stops the undo.</PlateProp>
						<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					</PlateProps>
				</PlatePart>
				<PlatePart name="SWIPE_DECK_THRESHOLDS" kind="constant">
					<p>The default thresholds: <code>{`{ left: 0.22, right: 0.22, up: 0.22 }`}</code>.</p>
				</PlatePart>
				<PlatePart name="SwipeDeckThresholds" kind="type">
					<p><code>Partial&lt;Record&lt;SwipeDeckDirection, number&gt;&gt;</code>: where each direction commits, as a fraction of the card's width.</p>
				</PlatePart>
				<PlatePart name="SwipeDeckDirection" kind="type">
					<p><code>'left' | 'right' | 'up'</code>. What each one means is yours.</p>
				</PlatePart>
				<PlatePart name="SwipeDeckVia" kind="type">
					<p><code>'drag' | 'flick' | 'keyboard' | 'button' | 'call'</code>: how a swipe happened.</p>
				</PlatePart>
				<PlatePart name="SwipeDeckUndoVia" kind="type">
					<p><code>'keyboard' | 'button' | 'call'</code>: how an undo happened.</p>
				</PlatePart>
				<PlatePart name="SwipeDeckEntry" kind="type">
					<p><code>{`{ card: string; direction: SwipeDeckDirection }`}</code>: one step of the history.</p>
				</PlatePart>
				<PlatePart name="SwipeDeckSwipeHandler" kind="type">
					<p><code>{`(card: string, direction: SwipeDeckDirection, detail: { via: SwipeDeckVia }) => boolean | void`}</code></p>
				</PlatePart>
				<PlatePart name="SwipeDeckUndoHandler" kind="type">
					<p><code>{`(card: string, direction: SwipeDeckDirection, detail: { via: SwipeDeckUndoVia }) => void`}</code></p>
				</PlatePart>
			</PlateApi>
		</PlateSection>

		<PlateSection title="Measurements">
			<PlateMeasures>
				<PlateMeasure label="Axis lock" value="after 8px" />
				<PlateMeasure label="Commit threshold" value="22% of the card's width, holds 6px below" />
				<PlateMeasure label="Flick" value="over 0.5px/ms, from 16px out" />
				<PlateMeasure label="Velocity" value="last 100ms of samples; zero after a 60ms rest" />
				<PlateMeasure label="Rubber band" value="32px at most, on an asymptote" />
				<PlateMeasure label="Spring home" value="stiffness 400, damping ratio 0.78" />
				<PlateMeasure label="Tilt" value="12° per card width, 18° at most" />
				<PlateMeasure label="Exit" value="48px past its edge, 140 to 220ms, fading over the second half" />
				<PlateMeasure label="Undo return" value="320ms" />
				<PlateMeasure label="Each card behind" value="9px lower, 5% narrower, 320ms into place" />
				<PlateMeasure label="Blank face" value="22% toward the background per card, two steps at most, 1px border" />
				<PlateMeasure label="Dragged card" value="shadow-lg, fades in 140ms" />
				<PlateMeasure label="Label" value="44px high, 16px from the card's edge" />
				<PlateMeasure label="Label growth" value="72% to 86% with the drag, 100% at the threshold in 220ms" />
				<PlateMeasure label="Empty state" value="rises 8px, 220ms after 140ms" />
				<PlateMeasure label="History" value="last 10 swipes" />
			</PlateMeasures>
		</PlateSection>
	</Plate>
</div>

<style>
	.flights :global([role='tabpanel']:has([data-slot='swipe-deck'])) {
		overflow: clip;
	}
</style>
