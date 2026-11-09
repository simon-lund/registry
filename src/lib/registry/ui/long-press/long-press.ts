import type { Attachment } from 'svelte/attachments';

/** What started the press, and where. */
export type LongPressDetail = {
	/** `press`: a finger or pen held still; `contextmenu`: the platform's own gesture (right-click, Shift+F10, the Menu key, Android's long press). */
	source: 'press' | 'contextmenu';
	/** `touch`, `pen` or `mouse` (a right-click, or a key, reports `mouse`). */
	pointerType: string;
	/** Where the press is, in viewport pixels (a key's contextmenu reports the browser's point). */
	x: number;
	y: number;
	/** The element the press started on, inside the attached node. */
	target: EventTarget | null;
};

export type LongPressOptions = {
	/** How long the finger has to rest, in ms. Default 500. Not a motion token: reduced motion must not shorten it. */
	delay?: number;
	/** How far the finger may drift before the press becomes a scroll or a swipe, in px. Default 8. */
	slop?: number;
	/** A tick when it fires, in ms, where the device can (`navigator.vibrate`); `0` for none. Default 10. */
	vibrate?: number;
};

const SWALLOW_CLICK_MS = 400; // the click a lifted long press would still deliver

/**
 * longPress: an attachment that turns a held finger into one call, the touch counterpart of a
 * right-click. Use it where a touch screen shows an element's actions in a sheet or a list.
 *
 * - A finger or pen (`pointerType` touch / pen) resting `delay` ms (500) within `slop` px (8)
 *   fires `onLongPress` once, with a short vibration where supported. Moving further, lifting
 *   early or the browser taking the gesture (`pointercancel`, a scroll) cancels it, so scrolling
 *   past the element and swiping it keep working. A mouse's left button never long-presses.
 * - The platform's own context-menu gesture fires it too, and is always kept from opening the
 *   browser's menu: a right-click (a narrow window with a mouse), Shift+F10 or the Menu key from a
 *   control inside (the keyboard path), and Android's own long press, which never fires twice.
 * - The click a lifted long press would deliver to the node is swallowed (only there: the first
 *   tap on what the press opened goes through), so holding over a checkbox inside
 *   does not tick it. Text selection and the iOS callout are switched off on the node while it is
 *   attached (inline style, restored when it detaches). It never sets `touch-action`.
 *
 * The press is not reachable without a pointer or a context-menu key: whatever it opens must
 * also be reachable from a visible control.
 *
 * @example
 * <div {@attach longPress(() => (actionsOpen = true))}>…</div>
 */
export function longPress(
	onLongPress: (detail: LongPressDetail) => void,
	{ delay = 500, slop = 8, vibrate = 10 }: LongPressOptions = {}
): Attachment<HTMLElement> {
	return (node) => {
		type Press = {
			id: number;
			x: number;
			y: number;
			pointerType: string;
			target: EventTarget | null;
			timer: ReturnType<typeof setTimeout>;
			fired: boolean;
		};
		let press: Press | null = null;
		let swallowUntil = 0;

		const style = node.style;
		const before = {
			userSelect: style.getPropertyValue('user-select'),
			webkitUserSelect: style.getPropertyValue('-webkit-user-select'),
			callout: style.getPropertyValue('-webkit-touch-callout')
		};
		style.setProperty('user-select', 'none');
		style.setProperty('-webkit-user-select', 'none');
		style.setProperty('-webkit-touch-callout', 'none');

		function fire(detail: LongPressDetail) {
			if (vibrate > 0) {
				try {
					// Blocked before the page's first user activation (a touch grants it on lift).
					navigator.vibrate?.(vibrate);
				} catch {
					/* not supported */
				}
			}
			window.getSelection()?.removeAllRanges();
			onLongPress(detail);
		}

		function end() {
			if (!press) return;
			clearTimeout(press.timer);
			press = null;
			window.removeEventListener('pointermove', handleMove, true);
			window.removeEventListener('pointerup', handleUp, true);
			window.removeEventListener('pointercancel', handleUp, true);
		}

		function handleDown(event: PointerEvent) {
			if (press || !event.isPrimary || event.button !== 0) return;
			if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
			const p: Press = {
				id: event.pointerId,
				x: event.clientX,
				y: event.clientY,
				pointerType: event.pointerType,
				target: event.target,
				fired: false,
				timer: setTimeout(() => {
					if (press !== p) return;
					p.fired = true;
					fire({ source: 'press', pointerType: p.pointerType, x: p.x, y: p.y, target: p.target });
				}, delay)
			};
			press = p;
			window.addEventListener('pointermove', handleMove, true);
			window.addEventListener('pointerup', handleUp, true);
			window.addEventListener('pointercancel', handleUp, true);
		}

		function handleMove(event: PointerEvent) {
			if (!press || event.pointerId !== press.id || press.fired) return;
			if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > slop) end();
		}

		function handleUp(event: PointerEvent) {
			if (!press || event.pointerId !== press.id) return;
			if (press.fired) swallowUntil = performance.now() + SWALLOW_CLICK_MS;
			end();
		}

		function handleClick(event: MouseEvent) {
			if (performance.now() > swallowUntil) return;
			// Only the node's own click: Android delivers none after its long press, and the first
			// tap on what the press opened (a sheet row, in a portal) must go through.
			if (!(event.target instanceof Node) || !node.contains(event.target)) return;
			swallowUntil = 0;
			event.preventDefault();
			event.stopPropagation();
		}

		function handleContextMenu(event: MouseEvent) {
			event.preventDefault();
			// Android fires its own contextmenu during the same press: one press, one call.
			if (press?.fired || performance.now() < swallowUntil) return;
			if (press) {
				clearTimeout(press.timer);
				press.fired = true;
			}
			fire({
				source: 'contextmenu',
				pointerType: press?.pointerType ?? 'mouse',
				x: event.clientX,
				y: event.clientY,
				target: event.target
			});
		}

		node.addEventListener('pointerdown', handleDown);
		node.addEventListener('contextmenu', handleContextMenu);
		window.addEventListener('click', handleClick, true);

		return () => {
			end();
			node.removeEventListener('pointerdown', handleDown);
			node.removeEventListener('contextmenu', handleContextMenu);
			window.removeEventListener('click', handleClick, true);
			style.setProperty('user-select', before.userSelect);
			style.setProperty('-webkit-user-select', before.webkitUserSelect);
			style.setProperty('-webkit-touch-callout', before.callout);
		};
	};
}
