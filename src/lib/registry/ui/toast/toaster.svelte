<script lang="ts">
	import { Middot } from '#lib/registry/ui/middot/index.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { TransitionConfig } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '#lib/utils.js';
	import { ClickSwallow, VelocityTracker, exitDuration, rubber } from '#lib/registry/ui/swipe/index.js';
	import Toast from './toast.svelte';
	import ToastMessage from './toast-message.svelte';
	import ToastVerb from './toast-verb.svelte';
	import ToastAction from './toast-action.svelte';
	import ToastProgress from './toast-progress.svelte';
	import { toaster as shared, type ToastData, type ToastQueue } from './toaster.svelte.js';
	import { modalLayers } from '#lib/registry/ui/inert-outside/index.js';
	import { topLayerWhile } from './top-layer.js';

	/**
	 * Toaster: renders a toast queue as one stack, the newest in front. Put it once per screen,
	 * right before the bar it hangs above in the DOM (so Shift+Tab from the bar reaches the action),
	 * then call `toast()` from anywhere.
	 *
	 * By default it hangs above its positioned parent (`absolute bottom-full`, 6px gap, 12px in
	 * from the sides): under a `relative z-10` bar, each toast rises from behind the bar (base
	 * 220ms, settle) and sinks back behind it when its time is up (quick 140ms).
	 *
	 * - Stack: older toasts step back 10px and 5% each, their words veiled. Hovering, focusing
	 *   or tapping the stack spreads it out (`expanded`, bindable); tap outside closes it again.
	 * - Time: every toast's window holds while the stack is spread, focused, held under a finger,
	 *   or the tab is in the background; the draining wash holds with it.
	 * - Swipe: down (into the bar) or sideways dismisses the front toast (any toast while spread);
	 *   a flick is enough. Upward it only gives a little. Short of the threshold it settles back.
	 * - Screen readers: one polite live region; each new toast is read once, action included.
	 *   After its action runs, focus goes back to where it came from.
	 * - Keyboard: Alt+T moves focus to the front toast's action (or the stack), from anywhere;
	 *   Alt+T again or Escape gives it back. Shift+Tab from the bar reaches it too.
	 * - Over a modal: while a layer using `inertOutside` is open, the stack stands in the top layer
	 *   (`popover="manual"`, where supported) at the same place, so a toast raised from inside the
	 *   modal shows above its veil, and Alt+T reaches it through the modal's focus trap. Without
	 *   the Popover API it stays where it is, under the veil.
	 *
	 * Renders `verb · title`, the action and the wash from each toast's data; pass `children`
	 * (a snippet taking the toast) to render the inside differently. Give it an `aria-label`.
	 *
	 * @example
	 * <div class="relative">
	 *   <Toaster aria-label="Notifications" />
	 *   <form class="relative z-10" onsubmit={add}>…</form>
	 * </div>
	 */
	let {
		toaster = shared,
		expanded = $bindable(false),
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		/** The queue to render. Default: the shared one behind `toast()`. */
		toaster?: ToastQueue;
		/** The stack is spread out (hover, focus, tap). Bindable. */
		expanded?: boolean;
		ref?: HTMLElement | null;
		/** Renders the inside of each Toast. Default: ToastMessage with ToastVerb, ToastAction, ToastProgress. */
		children?: Snippet<[ToastData]>;
	} = $props();

	const PEEK = 10; // px an older toast shows above the one in front of it
	const STEP = 0.05; // how much smaller each older toast is
	const GAP = 8; // px between spread toasts
	const SLOP = 6; // px before a drag picks its axis
	const FLICK = 0.3; // px/ms: faster than this in the dismiss direction is enough
	const DOWN = 36; // px down to dismiss without a flick
	const RUBBER = 20; // px it gives, asymptotically, when pulled up
	const STALE = 60; // ms: a finger that rested this long before lifting has no velocity
	const WINDOW = 100; // ms of samples the release velocity is measured over

	// A motion variable's value in ms, read on the node so a re-themed subtree is followed.
	function motionMs(node: Element, name: `--${string}`, fallback: number) {
		const raw = getComputedStyle(node).getPropertyValue(name).trim();
		const n = parseFloat(raw);
		if (!Number.isFinite(n)) return fallback;
		return raw.endsWith('ms') ? n : n * 1000;
	}

	const list = $derived(toaster.toasts);
	let heights = $state<Record<number, number>>({});
	let hovering = $state(false); // a mouse is over the stack
	let focusWithin = $state(false);
	let held = $state(false); // a finger or button is down on a toast
	let hidden = $state(false); // the tab is in the background
	const spread = $derived(list.length > 1 && (expanded || hovering || focusWithin));
	const paused = $derived(expanded || hovering || focusWithin || held || hidden);
	const frontHeight = $derived(list.length ? (heights[list[list.length - 1].id] ?? 50) : 0);

	// Place toast `i` (0 = front): spread, each one stands on the newer ones; collapsed, it peeks.
	function place(i: number) {
		if (!spread) return `translateY(${-i * PEEK}px) scale(${1 - i * STEP})`;
		let y = 0;
		for (let j = 0; j < i; j++) y += (heights[list[list.length - 1 - j].id] ?? 50) + GAP;
		return `translateY(${-y}px)`;
	}

	// A stack that empties forgets it was spread, so the next toast arrives collapsed.
	let wasEmpty = true;
	$effect(() => {
		const empty = !list.length;
		if (empty && !wasEmpty) {
			expanded = false;
			hovering = false;
		}
		wasEmpty = empty;
	});

	// The tab in the background holds every window (and the line with it).
	$effect(() => {
		const sync = () => (hidden = document.visibilityState === 'hidden');
		sync();
		document.addEventListener('visibilitychange', sync);
		return () => document.removeEventListener('visibilitychange', sync);
	});

	// A tap anywhere else closes a spread stack.
	$effect(() => {
		if (!expanded) return;
		const away = (event: PointerEvent) => {
			if (ref && !ref.contains(event.target as Node)) expanded = false;
		};
		window.addEventListener('pointerdown', away, true);
		return () => window.removeEventListener('pointerdown', away, true);
	});

	// ── focus: remember where it came from; give it back when its toast leaves ──
	let returnTo: HTMLElement | null = null;
	function handleFocusIn(event: FocusEvent) {
		const from = event.relatedTarget;
		if (!ref?.contains(from as Node | null)) returnTo = from instanceof HTMLElement ? from : null;
		focusWithin = true;
	}
	function handleFocusOut(event: FocusEvent) {
		if (!ref?.contains(event.relatedTarget as Node | null)) focusWithin = false;
	}
	$effect(() => {
		void list;
		if (!focusWithin) return;
		// After Svelte has started the outro (which makes the leaving toast inert).
		queueMicrotask(() => {
			const active = document.activeElement;
			if (ref && active && ref.contains(active) && !active.closest('[inert]')) return;
			focusWithin = false;
			if (returnTo?.isConnected) returnTo.focus({ preventScroll: true });
		});
	});

	// ── over a modal: the stack stands in the top layer (topLayerWhile, on the section) ──
	// A modal's focus trap pulls focus that leaves it back in (bits-ui, on the document): focus
	// that lands in the stack is let through, and the stack's own focus tracking runs here.
	$effect(() => {
		const node = ref;
		if (!node || !modalLayers.open) return;
		const pass = (event: FocusEvent) => {
			if (!(event.target instanceof Node) || !node.contains(event.target)) return;
			event.stopImmediatePropagation();
			handleFocusIn(event);
		};
		window.addEventListener('focusin', pass, true);
		return () => window.removeEventListener('focusin', pass, true);
	});

	// Alt+T: to the front toast and back. Escape inside gives focus back too (not to the modal).
	$effect(() => {
		const node = ref;
		if (!node) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.code !== 'KeyT' || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
			// Another Toaster on the page took it.
			if (event.defaultPrevented) return;
			if (node.contains(document.activeElement)) {
				event.preventDefault();
				giveBack();
				return;
			}
			if (!list.length) return;
			event.preventDefault();
			const front = node.querySelector<HTMLElement>('[data-front] button:not([disabled])');
			(front ?? node).focus();
		};
		const onEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape' || !returnTo?.isConnected) return;
			event.preventDefault();
			event.stopPropagation();
			giveBack();
		};
		window.addEventListener('keydown', onKey);
		node.addEventListener('keydown', onEscape);
		return () => {
			window.removeEventListener('keydown', onKey);
			node.removeEventListener('keydown', onEscape);
		};
	});
	function giveBack() {
		const to = returnTo;
		if (to?.isConnected) to.focus({ preventScroll: true });
		else (document.activeElement as HTMLElement | null)?.blur();
	}

	// ── leaving: a swiped toast carries on its way; everything else sinks back behind the bar ──
	type Exit = { x: number; y: number; opacity: number; dir: 'left' | 'right' | 'down'; speed: number };
	const exits = new Map<number, Exit>();

	function leave(node: HTMLElement, { id }: { id: number }): TransitionConfig {
		const exit = exits.get(id);
		exits.delete(id);
		const quick = motionMs(node, '--dur-quick', 140);
		const base = motionMs(node, '--dur-base', 220);
		if (prefersReducedMotion.current) return { duration: quick, css: (t) => `opacity:${t}` };
		const x0 = exit?.x ?? 0;
		const y0 = exit?.y ?? 0;
		const o0 = exit?.opacity ?? 1;
		if (exit && exit.dir !== 'down') {
			const to = (exit.dir === 'right' ? 1 : -1) * (node.offsetWidth + 24);
			// Keeps the finger's speed (see exitDuration).
			const duration = exitDuration(Math.abs(to - x0), exit.speed, quick, base);
			return {
				duration,
				easing: cubicOut,
				css: (t, u) => `translate:${x0 + (to - x0) * u}px ${y0}px;opacity:${o0 * t}`
			};
		}
		const to = node.offsetHeight + 6;
		return {
			duration: quick,
			easing: exit ? cubicOut : cubicIn,
			css: (t, u) => `translate:${x0}px ${y0 + (to - y0) * u}px;opacity:${o0 * t}`
		};
	}

	// ── swipe ──
	type Gesture = {
		pointer: number;
		id: number;
		el: HTMLElement;
		canDrag: boolean;
		downX: number;
		downY: number;
		axis: 'x' | 'y' | null;
		x: number;
		y: number;
		samples: VelocityTracker;
	};
	let gesture: Gesture | null = null;
	const clicks = new ClickSwallow();

	function handlePointerDown(
		event: PointerEvent & { currentTarget: EventTarget & HTMLLIElement },
		t: ToastData,
		i: number
	) {
		// One finger at a time.
		if (gesture || (event.pointerType === 'mouse' && event.button !== 0)) return;
		held = true;
		gesture = {
			pointer: event.pointerId,
			id: t.id,
			el: event.currentTarget,
			canDrag: i === 0 || spread,
			downX: event.clientX,
			downY: event.clientY,
			axis: null,
			x: 0,
			y: 0,
			samples: new VelocityTracker(WINDOW)
		};
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('pointercancel', handlePointerUp);
	}
	// A gesture in flight when the Toaster leaves takes its window listeners with it.
	$effect(() => release);
	function release() {
		gesture = null;
		held = false;
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
		window.removeEventListener('pointercancel', handlePointerUp);
	}
	function handlePointerMove(event: PointerEvent) {
		const g = gesture;
		if (!g || event.pointerId !== g.pointer) return;
		const dx = event.clientX - g.downX;
		const dy = event.clientY - g.downY;
		if (!g.axis) {
			if (Math.hypot(dx, dy) < SLOP || !g.canDrag) return;
			g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
			g.el.dataset.swiping = '';
			try {
				g.el.setPointerCapture(event.pointerId);
			} catch {
				/* the pointer may already be gone */
			}
		}
		g.x = g.axis === 'x' ? dx : 0;
		g.y = g.axis === 'y' ? (dy >= 0 ? dy : rubber(dy, RUBBER)) : 0;
		const far = g.axis === 'x' ? Math.abs(g.x) / g.el.offsetWidth : Math.max(0, g.y) / g.el.offsetHeight;
		// Set on the element itself, not through a variable its children would recompute.
		g.el.style.translate = `${g.x}px ${g.y}px`;
		g.el.style.opacity = String(1 - 0.5 * Math.min(1, far));
		g.samples.push(event.timeStamp, g.x, g.y);
	}
	function handlePointerUp(event: PointerEvent) {
		const g = gesture;
		if (!g || event.pointerId !== g.pointer) return;
		release();
		if (!g.axis) {
			// A tap on a collapsed stack spreads it (a mouse already did on hover).
			const onButton = (event.target as Element | null)?.closest('button');
			if (event.pointerType !== 'mouse' && !onButton && list.length > 1) expanded = true;
			return;
		}
		// The click that ends a drag must not run the action under the finger.
		clicks.arm();
		const v = g.samples.velocity(event.timeStamp, STALE);
		let dir: Exit['dir'] | null = null;
		if (event.type !== 'pointercancel') {
			if (g.axis === 'x') {
				const far = Math.abs(g.x) >= Math.min(96, 0.35 * g.el.offsetWidth);
				const flick = Math.abs(v.x) > FLICK && Math.sign(v.x) === Math.sign(g.x) && Math.abs(g.x) > 12;
				if (far || flick) dir = g.x > 0 ? 'right' : 'left';
			} else if (g.y >= DOWN || (v.y > FLICK && g.y > 8)) dir = 'down';
		}
		if (dir) {
			exits.set(g.id, { x: g.x, y: g.y, opacity: parseFloat(g.el.style.opacity) || 1, dir, speed: Math.abs(dir === 'down' ? v.y : v.x) });
			toaster.dismiss(g.id, 'swipe');
			return;
		}
		// Short of the line: back into place on the stack's own transition.
		delete g.el.dataset.swiping;
		g.el.style.translate = '';
		g.el.style.opacity = '';
	}
	function handleClickCapture(event: MouseEvent) {
		clicks.swallow(event);
	}
</script>

<section
	bind:this={ref}
	{@attach topLayerWhile(() => modalLayers.open > 0)}
	data-slot="toaster"
	tabindex="-1"
	aria-keyshortcuts="Alt+T"
	aria-live="polite"
	aria-relevant="additions text"
	aria-atomic="false"
	class={cn(
		'pointer-events-none absolute inset-x-3 bottom-full mb-1.5 outline-none',
		// Alt+T on a toast without an action focuses the stack: the front toast's border shows it.
		'focus-visible:[&_[data-front]_[data-slot=toast]]:border-ring',
		className
	)}
	onfocusin={handleFocusIn}
	onfocusout={handleFocusOut}
	{...restProps}
>
	<ol
		data-slot="toaster-list"
		data-expanded={spread || undefined}
		class="pointer-events-auto relative"
		style:height="{frontHeight}px"
		onpointerenter={(e) => e.pointerType === 'mouse' && (hovering = true)}
		onpointerleave={(e) => e.pointerType === 'mouse' && (hovering = false)}
		onclickcapture={handleClickCapture}
	>
		{#each list as t, k (t.id)}
			{@const i = list.length - 1 - k}
			<li
				data-slot="toaster-item"
				data-front={i === 0 || undefined}
				data-behind={(i > 0 && !spread) || undefined}
				bind:offsetHeight={heights[t.id]}
				class={cn(
					'absolute inset-x-0 bottom-0 origin-top touch-none data-swiping:select-none',
					'transition-[transform,translate,opacity] duration-(--dur-base) ease-(--ease-settle) data-swiping:transition-none',
					// Behind: the toast's contents fade out (its block stays).
					'[&_[data-slot=toast]>*]:transition-opacity [&_[data-slot=toast]>*]:duration-(--dur-base) data-behind:[&_[data-slot=toast]>*]:opacity-0',
					// Rises from behind the bar: its own height plus the gap, fading in.
					'starting:opacity-0 motion-safe:starting:translate-y-[calc(100%+6px)]',
					// Spread: fill the gap below each toast, so the pointer never falls out between them.
					spread && 'after:absolute after:inset-x-0 after:top-full after:h-2'
				)}
				style:transform={place(i)}
				onpointerdown={(e) => handlePointerDown(e, t, i)}
				out:leave={{ id: t.id }}
			>
				<Toast variant={t.variant} duration={t.duration} {paused} onExpire={() => toaster.dismiss(t.id, 'timeout')}>
					{#if children}
						{@render children(t)}
					{:else}
						<ToastMessage>
							{#if t.verb}<ToastVerb>{t.verb}</ToastVerb><Middot />{/if}{t.title}
						</ToastMessage>
						{#if t.action}
							<ToastAction onclick={() => toaster.act(t.id)}>{t.action.label}</ToastAction>
							<ToastProgress />
						{/if}
					{/if}
				</Toast>
				<!--
					Depth: an older toast recedes into the ground, so each layer reads as
					its own step in both themes (30%, then 51%); its words are hidden until the stack spreads.
				-->
				<span
					aria-hidden="true"
					class="bg-background pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-(--dur-base) ease-(--ease-settle)"
					style:opacity={i > 0 && !spread ? 1 - 0.7 ** i : 0}
				></span>
			</li>
		{/each}
	</ol>
</section>
