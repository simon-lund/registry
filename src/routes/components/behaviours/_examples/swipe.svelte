<script lang="ts">
	import { onDestroy } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Button } from '#lib/registry/ui/button/index.js';
	import {
		CARD_SWIPE_GESTURE as G,
		ClickSwallow,
		SwipeMotion,
		VelocityTracker,
		exitDuration,
		rubber
	} from '#lib/registry/ui/swipe/index.js';

	const QUICK = 140; // ms, the fastest a card leaves
	const BASE = 220; // ms, the slowest
	const ARMS_AT = 0.22; // of the card's width

	let x = $state(0);
	let width = $state(0);
	let armed = $state(false);
	let archived = $state(false);
	let opened = $state(0);
	let speed = $state<number>();

	const motion = new SwipeMotion();
	const clicks = new ClickSwallow();
	onDestroy(() => motion.stop());

	type Gesture = { id: number; downX: number; downY: number; from: number; locked: boolean; samples: VelocityTracker };
	let gesture: Gesture | null = null;

	function down(event: PointerEvent & { currentTarget: HTMLElement }) {
		if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
		motion.stop(); // catch a card that is on its way home
		clicks.disarm();
		event.currentTarget.setPointerCapture(event.pointerId);
		gesture = {
			id: event.pointerId,
			downX: event.clientX,
			downY: event.clientY,
			from: x,
			locked: false,
			samples: new VelocityTracker(G.window)
		};
	}

	function move(event: PointerEvent) {
		const g = gesture;
		if (!g || event.pointerId !== g.id) return;
		const dx = event.clientX - g.downX;
		const dy = event.clientY - g.downY;
		if (!g.locked) {
			if (Math.hypot(dx, dy) < G.slop) return;
			if (Math.abs(dy) > Math.abs(dx)) {
				// Vertical: that is a scroll, not a swipe.
				gesture = null;
				home(0);
				return;
			}
			g.locked = true;
		}
		// Right archives and follows the finger. Left does nothing, so it only gives a little.
		const raw = g.from + dx;
		x = raw > 0 ? raw : rubber(raw, G.rubber);
		armed = x >= width * ARMS_AT - (armed ? G.hysteresis : 0);
		g.samples.push(event.timeStamp, x);
	}

	function up(event: PointerEvent) {
		const g = gesture;
		if (!g || event.pointerId !== g.id) return;
		gesture = null;
		if (!g.locked) return home(0); // a tap: the click goes through
		clicks.arm(); // the click that ends a drag must not open the card
		if (event.type === 'pointercancel') return home(0);
		const v = g.samples.velocity(event.timeStamp, G.stale).x;
		speed = Math.abs(v);
		const flickedOut = v > G.flick && x >= G.flickMin;
		const flickedBack = v < -G.flick;
		if (flickedOut || (armed && !flickedBack)) leave(v);
		else home(v);
	}

	function home(v: number) {
		armed = false;
		if (prefersReducedMotion.current || x === 0) {
			x = 0;
			return;
		}
		motion.spring(
			() => [x],
			([next]) => (x = next),
			[v],
			{ ...G.spring, timeScale: 1 },
			() => (x = 0)
		);
	}

	function leave(v = 0) {
		const from = x;
		const duration = prefersReducedMotion.current ? 0 : exitDuration(width - from, Math.abs(v), QUICK, BASE);
		motion.tween(
			duration,
			cubicOut,
			(eased) => (x = from + (width - from) * eased),
			() => {
				armed = false;
				archived = true;
			}
		);
	}

	function bringBack() {
		archived = false;
		motion.tween(prefersReducedMotion.current ? 0 : BASE, cubicOut, (eased) => (x = width * (1 - eased)));
	}
</script>

<div class="flex w-full max-w-sm flex-col gap-3">
	<div class="ring-border relative h-20 overflow-hidden rounded-lg ring-1" bind:clientWidth={width}>
		<span class={['absolute inset-y-0 left-4 flex items-center text-sm', armed ? 'text-primary' : 'text-muted-foreground']}>
			{archived ? 'Archived' : armed ? 'Release to archive' : 'Archive'}
		</span>
		<button
			type="button"
			style:translate="{x}px 0"
			class={[
				'bg-background border-border focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-0 flex touch-pan-y cursor-grab flex-col justify-center gap-1 rounded-lg border px-4 text-left outline-none select-none focus-visible:ring-3 active:cursor-grabbing',
				archived && 'invisible'
			]}
			onpointerdown={down}
			onpointermove={move}
			onpointerup={up}
			onpointercancel={up}
			onclickcapture={(event) => clicks.swallow(event)}
			onclick={() => opened++}
		>
			<span class="text-sm font-medium">Invoice 2041</span>
			<span class="text-muted-foreground text-xs">Swipe right, or click to open</span>
		</button>
	</div>

	<div class="flex items-center justify-between gap-3">
		<p class="text-muted-foreground font-mono text-xs">
			opened: {opened}<br />
			release: {speed === undefined ? 'none yet' : `${speed.toFixed(2)} px/ms`}
		</p>
		<Button variant="outline" size="sm" onclick={() => (archived ? bringBack() : leave())}>
			{archived ? 'Bring back' : 'Archive'}
		</Button>
	</div>
</div>
