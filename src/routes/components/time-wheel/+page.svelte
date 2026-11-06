<script lang="ts">
	import { TimeWheel } from '#lib/registry/ui/time-wheel/index.js';
	import {
		Plate,
		PlateStage,
		PlateNotes,
		PlateSection,
		PlateStates,
		PlateState,
		PlateMeasures,
		PlateMeasure
	} from '#lib/book/plate/index.js';

	let date = $state(new Date(2026, 10, 6, 9, 41));
	const pad = (n: number) => n.toString().padStart(2, '0');
	const time = $derived(`${pad(date.getHours())}:${pad(date.getMinutes())}`);
</script>

<Plate name="time-wheel" title="Time wheel" kind="Picker · Svelte">
	<PlateStage class="flex-col gap-4">
		<TimeWheel bind:date />
		<p class="text-muted-foreground m-0 font-mono text-sm">selected {time}</p>
	</PlateStage>

	<PlateNotes>
		<PlateSection title="Intention">
			<p>
				A time you set by turning, as the iOS picker does. Turning is how people already set a
				clock: the hand moves, and the value is wherever it stops.
			</p>
			<p>
				Others offer a dropdown of 1440 minutes, where the one you want is eleven screens down, or
				a text field that rejects "9:5" and says nothing about why. The wheel can only ever hold a
				valid time, so there is nothing to reject.
			</p>
			<p>
				Two styles share the one mechanism. Flat, where the neighbours shrink and fade, for a
				sheet on a phone. Drum, where the rows sit on a cylinder, where the picker is the whole
				screen's point.
			</p>
		</PlateSection>

		<PlateSection title="Left out">
			<p>Seconds: nobody sets a meeting to the second.</p>
			<p>A typed field beside the wheel. If typing is the right way in, use a text input and let it parse.</p>
			<p>Haptics: the web has none, and faking ticks with sound was worse than nothing.</p>
		</PlateSection>

		<PlateSection title="States">
			<PlateStates>
				<PlateState label="24 hours, flat">
					<TimeWheel date={new Date(2026, 10, 6, 9, 41)} class="px-4 py-2" />
				</PlateState>
				<PlateState label="12 hours, flat, with am and pm">
					<TimeWheel date={new Date(2026, 10, 6, 9, 41)} format="12" class="px-4 py-2" />
				</PlateState>
				<PlateState label="Drum">
					<TimeWheel date={new Date(2026, 10, 6, 9, 41)} variant="drum" class="px-4 py-2" />
				</PlateState>
				<PlateState label="Keyboard: a focused column shows its ring; the arrows step a row at once">
					<TimeWheel date={new Date(2026, 10, 6, 9, 41)} class="px-4 py-2" />
				</PlateState>
			</PlateStates>
		</PlateSection>

		<PlateSection title="Measurements">
			<PlateMeasures>
				<PlateMeasure label="Row, flat" value="34 px" />
				<PlateMeasure label="Row, drum" value="36 px" />
				<PlateMeasure label="Window, flat" value="240 px (7 rows)" />
				<PlateMeasure label="Window, drum" value="260 px" />
				<PlateMeasure label="Highlight bar" value="40 px, radius 6 px" />
				<PlateMeasure label="Column" value="48 px flat · 64 px drum" />
				<PlateMeasure label="Drum radius" value="90 px" />
				<PlateMeasure label="Drum perspective" value="850 px" />
				<PlateMeasure label="Flat scale" value="1.1 centre → 0.95 − 0.08 per row, min 0.7" />
				<PlateMeasure label="Flat opacity" value="1 centre → 1 − 0.35 per row, min 0.05" />
				<PlateMeasure label="Drum fade" value="1 − (angle / 90)³, hidden past 90°" />
				<PlateMeasure label="Settle" value="embla, 20 frames · keyboard instant" />
			</PlateMeasures>
		</PlateSection>
	</PlateNotes>
</Plate>
