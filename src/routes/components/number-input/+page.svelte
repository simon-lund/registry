<script lang="ts">
	import {
		Plate,
		PlateStage,
		PlateNotes,
		PlateSection,
		PlateStates,
		PlateState,
		PlateMeasures,
		PlateMeasure,
		PlateCode
	} from '#lib/book/plate/index.js';
	import { NumberInput, AnimatedNumber } from '#lib/registry/ui/number-input/index.js';

	let quantity = $state(1240);
	let seats = $state(8);
	let price = $state(49.9);
	let views = $state(12808);
	let typing = $state(42);
	let locked = $state(3);

	const usage = `<script lang="ts">
	import { NumberInput } from '#lib/components/ui/number-input/index.js';

	let quantity = $state(1);
<\/script>

<NumberInput bind:value={quantity} min={0} max={99} aria-label="Quantity" />`;
</script>

<Plate name="number-input" title="Number input" kind="Input · Svelte">
	<PlateStage class="flex-col gap-6">
		<div class="flex flex-col items-center gap-3">
			<label for="qty" class="text-muted-foreground text-sm">Quantity</label>
			<NumberInput id="qty" bind:value={quantity} min={0} max={99999} step={10} size="lg" class="w-56" />
		</div>
		<p class="text-muted-foreground font-mono text-xs">value: {quantity}</p>
	</PlateStage>

	<PlateCode code={usage} label="usage" />

	<PlateNotes>
		<PlateSection title="Intention">
			<p>
				A number you set by stepping or by typing, in one field. The digits roll to the new value, so
				you see what changed and which way, as an odometer shows a count going up. Most number fields
				get this wrong twice: the browser's own spinner is a pair of arrows a few pixels high that
				appear on hover, and the value changes without a trace. Here the chevrons are a column you
				can hit, and the change is visible.
			</p>
			<p>
				The field never holds an invalid value. What you type is taken the moment it reads as a
				number, and the bounds apply when you leave. Arrow keys step, Shift steps by ten, Home and
				End go to the bounds; a chevron held keeps stepping. Formatting is the locale's, through
				Intl.NumberFormat, so grouping, decimals and currencies come for free.
			</p>
			<p>The rolling digits follow NumberFlow by Maxwell Barvian, written again in Svelte with CSS only.</p>
		</PlateSection>

		<PlateSection title="Left out">
			<p>
				The mouse wheel does not change the value: a scroll over a form is not a decision. No
				slider: a slider is for roughly, this is for exactly. No unit typed into the field; a
				currency or a percent is part of the format, so it sits beside the digits and never gets
				edited away. No error state: a field that cannot hold an invalid value has none to show.
			</p>
		</PlateSection>

		<PlateSection title="States">
			<PlateStates>
				<PlateState label="Default">
					<NumberInput bind:value={typing} aria-label="Default" class="w-36" />
				</PlateState>
				<PlateState label="At the upper bound: Increase is off">
					<NumberInput bind:value={seats} min={1} max={8} aria-label="Seats" class="w-36" />
				</PlateState>
				<PlateState label="A price, two decimals, euro">
					<NumberInput
						bind:value={price}
						min={0}
						step={0.1}
						format={{ style: 'currency', currency: 'EUR' }}
						aria-label="Price"
						class="w-40"
					/>
				</PlateState>
				<PlateState label="Disabled">
					<NumberInput bind:value={locked} disabled aria-label="Disabled" class="w-36" />
				</PlateState>
				<PlateState label="AnimatedNumber alone: a count that only shows">
					<button
						type="button"
						class="hover:bg-accent focus-visible:ring-ring rounded-md px-3 py-2 text-2xl focus-visible:ring-2 focus-visible:outline-none"
						onclick={() => (views += Math.floor(Math.random() * 900) + 1)}
					>
						<AnimatedNumber value={views} />
						<span class="text-muted-foreground ml-2 text-sm">views · tap</span>
					</button>
				</PlateState>
			</PlateStates>
		</PlateSection>

		<PlateSection title="Measurements">
			<PlateMeasures>
				<PlateMeasure label="Height" value="40px · lg 56px" />
				<PlateMeasure label="Text" value="16px · lg 24px, tabular figures" />
				<PlateMeasure label="Padding" value="12px" />
				<PlateMeasure label="Chevron column" value="32px, two halves" />
				<PlateMeasure label="Radius" value="8px (--radius)" />
				<PlateMeasure label="Focus ring" value="2px ring at 40 %, border to ring" />
				<PlateMeasure label="Roll" value="600ms cubic-bezier(.22, 1, .36, 1)" />
				<PlateMeasure label="Digit mask" value="fades over the top and bottom 25 %" />
				<PlateMeasure label="Hold to repeat" value="after 400ms, every 60ms" />
			</PlateMeasures>
		</PlateSection>
	</PlateNotes>
</Plate>
