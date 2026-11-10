// What the two menus share: their trigger's look, and keeping keys away from the page.

/** A menu's trigger in the bar: its current value, then a small chevron. */
export const TRIGGER =
	'text-muted-foreground hover:text-foreground hover:bg-foreground/6 focus-visible:ring-ring data-[state=open]:bg-foreground/6 data-[state=open]:text-foreground flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 outline-none focus-visible:ring-2 transition-colors duration-(--dur-quick) ease-(--ease-settle)';

/** A menu's panel floats above the bar; its keys, too, never reach the page. */
export const stopKeys = (e: KeyboardEvent) => e.stopPropagation();
