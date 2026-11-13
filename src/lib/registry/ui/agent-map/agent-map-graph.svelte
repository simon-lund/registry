<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { CENTRE, getMap, type AgentCall } from './context.svelte.js';

	/**
	 * AgentMapGraph: the map. The agent in the middle (put AgentMapHub inside), its nodes evenly
	 * round it, the first at the top, and a line from the agent to each. A node lights up in ink as
	 * it is used: its count beside its name, a turning ring while a call to it runs, a dot travelling
	 * out along its line, and the failed calls as a number on its corner. A call from another node
	 * (a subagent reading files) draws its own curve between the two. Clicking a node selects it:
	 * its line in copper, and AgentMapLog shows only its calls. `icon` draws each node's icon.
	 *
	 * @example
	 * <AgentMapGraph {icon} aria-label="What the agent is using"><AgentMapHub>Claude</AgentMapHub></AgentMapGraph>
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** A node's icon, by its id: a 16px icon in currentColor. */
		icon?: Snippet<[string]>;
	}

	let { icon, class: className, children, ...rest }: Props = $props();

	const map = getMap('AgentMapGraph');

	// A call from another node bends round the agent instead of crossing it: the curve's middle sits
	// 22% from the centre, on the side of the shorter way round, clear of the hub. Neighbours bow in,
	// opposite nodes swing wide.
	const CLEAR = 22;
	function curve(from: string, to: string) {
		const a = map.at.get(from)!;
		const b = map.at.get(to)!;
		const ax = a.x - CENTRE.x;
		const ay = a.y - CENTRE.y;
		let mx = ax + (b.x - CENTRE.x);
		let my = ay + (b.y - CENTRE.y);
		const sum = Math.hypot(mx, my);
		let len = sum;
		// opposite each other: no shorter way, so go clockwise
		if (len < 1) [mx, my, len] = [-ay, ax, Math.hypot(ax, ay)];
		// the quadratic's middle is a quarter of each end plus half the control point
		const reach = 2 * (CLEAR - sum / 4);
		const c = { x: CENTRE.x + (mx / len) * reach, y: CENTRE.y + (my / len) * reach };
		return { a, b, c, d: `M${a.x} ${a.y}Q${c.x} ${c.y} ${b.x} ${b.y}` };
	}

	// Where a running call's dot is, `p` of the way out: along the spoke from the agent, or along the
	// curve from the node it came from.
	function point(call: AgentCall, p: number) {
		const to = map.at.get(call.node);
		if (!to) return null;
		if (call.from && map.at.has(call.from)) {
			const { a, b, c } = curve(call.from, call.node);
			const q = 1 - p;
			return { x: q * q * a.x + 2 * q * p * c.x + p * p * b.x, y: q * q * a.y + 2 * q * p * c.y + p * p * b.y };
		}
		return { x: CENTRE.x + (to.x - CENTRE.x) * p, y: CENTRE.y + (to.y - CENTRE.y) * p };
	}

	// Each call's dot starts where its id puts it, so two calls on one line never travel as one.
	const offset = (id: string | number) => [...String(id)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 997, 7) / 997;

	// The dots travel on the motion tokens (six of --dur-calm a trip), so the book's slow motion
	// slows them too; under reduced motion there are none, and the inked line says running.
	let now = $state(0);
	let still = $state(false);
	$effect(() => {
		const query = matchMedia('(prefers-reduced-motion: reduce)');
		still = query.matches;
		const change = () => (still = query.matches);
		query.addEventListener('change', change);
		return () => query.removeEventListener('change', change);
	});
	let trip = $state(1920);
	$effect(() => {
		if (still || map.running.length === 0) return;
		let frame = 0;
		let read = 0;
		const tick = (t: number) => {
			if (t - read > 500) {
				read = t;
				const calm = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-calm'));
				if (calm > 0) trip = calm * 6;
			}
			now = t;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});

	// The smallest map a ring of ten names fits (measured: at 295px none touches another); a narrower
	// one is this one, scaled.
	const MIN = 296;
	let width = $state(0);
	const scale = $derived(width > 0 && width < MIN ? width / MIN : 1);

	function line(id: string) {
		const t = map.tally.get(id);
		if (map.selected === id) return 'stroke-primary';
		if (t?.running) return 'stroke-foreground';
		if (t?.calls) return 'stroke-muted-foreground/45';
		return 'stroke-border';
	}

	function describe(id: string, label: string) {
		const t = map.tally.get(id);
		if (!t?.calls) return `${label}, not used yet`;
		const parts = [`${label}, ${t.calls} ${t.calls === 1 ? 'call' : 'calls'}`];
		if (t.failed) parts.push(`${t.failed} failed`);
		if (t.running) parts.push('running');
		return parts.join(', ');
	}
</script>

<div
	data-slot="agent-map-graph"
	role="group"
	bind:clientWidth={width}
	class={cn('relative mx-auto aspect-square w-full max-w-md select-none', className)}
	{...rest}
>
	<!-- laid out at no less than the smallest width it fits, and scaled down evenly below that -->
	<div
		class="@container/map absolute top-0 left-0 origin-top-left"
		style:width={scale < 1 ? `${MIN}px` : '100%'}
		style:height={scale < 1 ? `${MIN}px` : '100%'}
		style:scale={scale < 1 ? scale : undefined}
	>
		<svg viewBox="0 0 100 100" class="absolute inset-0 size-full overflow-visible" fill="none" aria-hidden="true">
			{#each map.nodes as n (n.id)}
				{@const at = map.at.get(n.id)!}
				<line
					x1={CENTRE.x}
					y1={CENTRE.y}
					x2={at.x}
					y2={at.y}
					vector-effect="non-scaling-stroke"
					stroke-width={map.selected === n.id || map.tally.get(n.id)?.running ? 1.5 : 1}
					class={cn('transition-[stroke] duration-(--dur-base)', line(n.id))}
				/>
			{/each}
			{#each map.links as l (l.from + '>' + l.to)}
				<path
					d={curve(l.from, l.to).d}
					vector-effect="non-scaling-stroke"
					stroke-width={l.running ? 1.5 : 1}
					class={cn(
						'transition-[stroke] duration-(--dur-base)',
						map.selected === l.from || map.selected === l.to
							? 'stroke-primary'
							: l.running
								? 'stroke-foreground'
								: 'stroke-muted-foreground/45'
					)}
				/>
			{/each}
			{#if !still}
				{#each map.running as call (call.id)}
					{@const p = (now / trip + offset(call.id)) % 1}
					{@const at = point(call, p)}
					{#if at}
						<circle cx={at.x} cy={at.y} r="1.1" class="fill-foreground" opacity={Math.sin(Math.PI * p)} />
					{/if}
				{/each}
			{/if}
		</svg>

		{#each map.nodes as n (n.id)}
			{@const at = map.at.get(n.id)!}
			{@const t = map.tally.get(n.id)!}
			{@const selected = map.selected === n.id}
			<button
				type="button"
				data-slot="agent-map-node"
				data-node={n.id}
				data-running={t.running > 0 || undefined}
				data-failed={t.failed > 0 || undefined}
				aria-pressed={selected}
				aria-label={describe(n.id, n.label)}
				onclick={() => map.select(selected ? null : n.id)}
				class={cn(
					'group/node absolute flex -translate-x-1/2 cursor-pointer items-center gap-1.5 whitespace-nowrap outline-none',
					// the circle's centre on the point, the name outward
					at.above
						? 'translate-y-[calc(-100%+18px)] flex-col-reverse @min-[22rem]/map:translate-y-[calc(-100%+20px)]'
						: '-translate-y-[18px] flex-col @min-[22rem]/map:-translate-y-5'
				)}
				style:left="{at.x}%"
				style:top="{at.y}%"
			>
				<span
					class={cn(
						'bg-background relative grid size-9 place-items-center rounded-full border @min-[22rem]/map:size-10 transition-[border-color,color,outline-color] duration-(--dur-base)',
						'outline-2 outline-offset-2 outline-transparent outline-solid',
						'group-focus-visible/node:ring-ring group-focus-visible/node:ring-2 group-focus-visible/node:ring-offset-2 group-focus-visible/node:ring-offset-background',
						"[&_svg:not([class*='size-'])]:size-4",
						t.calls ? 'border-muted-foreground/45 text-foreground' : 'border-border text-muted-foreground',
						t.running && 'border-transparent',
						selected && 'outline-primary'
					)}
				>
					{@render icon?.(n.id)}
					{#if t.running}
						<!-- the working mark of the agent tree, the size of the node: it turns while a call runs -->
						<svg viewBox="0 0 40 40" class="absolute -inset-px size-[calc(100%+2px)]" fill="none" aria-hidden="true">
							<circle cx="20" cy="20" r="19.25" class="stroke-muted-foreground/30" stroke-width="1.5" />
							<path
								d="M20 0.75A19.25 19.25 0 1 1 0.75 20"
								class="stroke-foreground origin-center motion-safe:animate-[spin_3s_linear_infinite]"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
						</svg>
					{/if}
					{#if t.failed}
						<!-- inverted, as the agent tree marks what wants you: the darkest thing on the map -->
						<span
							class="bg-foreground text-background absolute -top-1 -left-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] leading-none font-medium tabular-nums"
							>{t.failed}</span
						>
					{/if}
				</span>
				<!-- the name and its count on one line; a phone-sized map shows the name alone, so a ring of
				     ten stays clear of its neighbours (the count is in the log and the node's name for a reader) -->
				<span class="flex items-baseline gap-1 text-xs leading-4">
					<span class={cn(t.calls ? 'text-foreground' : 'text-muted-foreground')}>{n.label}</span>
					{#if t.calls}<span class="text-muted-foreground hidden font-mono text-[11px] tabular-nums @min-[22rem]/map:inline">{t.calls}</span>{/if}
				</span>
			</button>
		{/each}

		{@render children?.()}
	</div>
</div>
