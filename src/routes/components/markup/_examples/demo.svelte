<script lang="ts">
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CircleIcon from '@lucide/svelte/icons/circle';
	import MessageCircleIcon from '@lucide/svelte/icons/message-circle';
	import MousePointer2Icon from '@lucide/svelte/icons/mouse-pointer-2';
	import MoveUpRightIcon from '@lucide/svelte/icons/move-up-right';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Redo2Icon from '@lucide/svelte/icons/redo-2';
	import SlashIcon from '@lucide/svelte/icons/slash';
	import SquareIcon from '@lucide/svelte/icons/square';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
		import Undo2Icon from '@lucide/svelte/icons/undo-2';
	import XIcon from '@lucide/svelte/icons/x';
	import { ColorPickerSwatch } from '#lib/registry/ui/color-picker/index.js';
	import {
		Markup,
		MarkupBar,
		MarkupTools,
		MarkupTool,
		MarkupShapes,
		MarkupShape,
		MarkupSeparator,
		MarkupColors,
		MarkupWidths,
		MarkupWidth,
		MarkupAction,
		MarkupClose,
		MarkupLayer,
		MarkupSelection,
		MarkupComment,
		MarkupCommentPin,
		MarkupCommentBox,
		MarkupCommentSend,
		type MarkupHandle,
		type MarkupShapeName,
		type MarkupSpot,
		type MarkupToolName
	} from '#lib/registry/ui/markup/index.js';

	// The app's part: what the pen and shapes draw, the history behind undo and redo, and where
	// picked elements and comments are kept.

	const colours = [
		{ name: 'Red', value: '#e5484d' },
		{ name: 'Orange', value: '#f76b15' },
		{ name: 'Yellow', value: '#ffc53d' },
		{ name: 'Green', value: '#30a46c' },
		{ name: 'Blue', value: '#0090ff' }
	];

	type Point = [number, number];
	// pen: every point; line, arrow, rectangle, ellipse: start and end; step: where
	type Mark = { id: number; kind: 'pen' | MarkupShapeName; colour: string; width: number; points: Point[]; n?: number };
	type Comment = MarkupSpot & { id: number; text: string; open: boolean; done: boolean };
	type Box = { x: number; y: number; width: number; height: number };

	let tool = $state<MarkupToolName | null>('select');
	let shape = $state<MarkupShapeName>('rectangle');
	let colour = $state('#e5484d');
	let width = $state(3);
	let open = $state(true);

	let stage = $state<HTMLDivElement | null>(null);
	let page = $state<HTMLDivElement | null>(null);
	let marks = $state<Mark[]>([]);
	let past = $state<Mark[][]>([]);
	let future = $state<Mark[][]>([]);
	let selected = $state<number | null>(null);
	let picked = $state<Element[]>([]);
	let comments = $state<Comment[]>([]);
	let next = 1;

	// One comment from earlier, already done: just left of the title.
	let title = $state<HTMLElement | null>(null);
	$effect(() => {
		if (title && next === 1) comments.push({ id: next++, element: title, at: { x: -0.06, y: 0.5 }, text: 'A shorter title', open: false, done: true });
	});

	const drawing = $derived(tool === 'pen' || tool === 'shape');

	function local(e: { clientX: number; clientY: number }): Point {
		const r = stage!.getBoundingClientRect();
		return [Math.round(e.clientX - r.left), Math.round(e.clientY - r.top)];
	}

	// History: every change keeps what was before it.
	const snap = () => $state.snapshot(marks) as Mark[];
	function commit(before: Mark[]) {
		past.push(before);
		future = [];
	}
	function undo() {
		const prev = past.pop();
		if (!prev) return;
		future.push(snap());
		marks = prev;
		selected = null;
	}
	function redo() {
		const nextMarks = future.pop();
		if (!nextMarks) return;
		past.push(snap());
		marks = nextMarks;
		selected = null;
	}
	// Delete: the selected mark, or every mark when none is selected.
	function remove() {
		if (marks.length === 0) return;
		const before = snap();
		marks = selected === null ? [] : marks.filter((m) => m.id !== selected);
		selected = null;
		commit(before);
	}

	// The comment tool: a comment where it clicked.
	function place(spot: MarkupSpot) {
		selected = null;
		comments.push({ ...spot, id: next++, text: '', open: true, done: false });
	}
	// Closed with nothing written, a comment is dropped.
	function closed(c: Comment, isOpen: boolean) {
		if (!isOpen && !c.text.trim()) comments = comments.filter((o) => o.id !== c.id);
	}

	// Pen, shapes and steps.
	let drag: { pointer: number; id: number; before: Mark[] } | null = null;
	function down(e: PointerEvent & { currentTarget: HTMLElement }) {
		if (e.button !== 0) return;
		const p = local(e);
		const before = snap();
		const id = next++;
		selected = null;
		if (tool === 'shape' && shape === 'step') {
			marks.push({ id, kind: 'step', colour, width, points: [p], n: marks.filter((m) => m.kind === 'step').length + 1 });
			commit(before);
			return;
		}
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		marks.push({ id, kind: tool === 'pen' ? 'pen' : shape, colour, width, points: [p, p] });
		drag = { pointer: e.pointerId, id, before };
	}
	function move(e: PointerEvent) {
		if (drag?.pointer !== e.pointerId) return;
		const m = marks.find((o) => o.id === drag!.id);
		if (!m) return;
		if (m.kind === 'pen') m.points.push(local(e));
		else m.points[1] = local(e);
	}
	function up(e: PointerEvent) {
		if (drag?.pointer !== e.pointerId) return;
		const { id, before } = drag;
		drag = null;
		const m = marks.find((o) => o.id === id);
		if (!m) return;
		const [a, b] = [m.points[0], m.points.at(-1)!];
		// a click without a drag draws nothing
		if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 4) {
			marks = marks.filter((o) => o.id !== id);
			return;
		}
		commit(before);
		if (m.kind !== 'pen') selected = id;
	}

	// A mark's box: the points' extent.
	function boxOf(m: Mark): Box {
		const xs = m.points.map((p) => p[0]);
		const ys = m.points.map((p) => p[1]);
		const x = Math.min(...xs);
		const y = Math.min(...ys);
		return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
	}
	const chosen = $derived(marks.find((m) => m.id === selected && m.kind !== 'step'));

	// Moving and resizing the selected mark: its points follow its box.
	function hold(handle: MarkupHandle, e: PointerEvent) {
		const m = chosen;
		if (!m) return;
		e.preventDefault();
		const before = snap();
		const b = boxOf(m);
		const from = local(e);
		const pts = m.points.map((p) => [...p] as Point);
		const onMove = (ev: PointerEvent) => {
			const [dx, dy] = [local(ev)[0] - from[0], local(ev)[1] - from[1]];
			let [x0, y0, x1, y1] = [b.x, b.y, b.x + b.width, b.y + b.height];
			if (handle === 'move') [x0, y0, x1, y1] = [x0 + dx, y0 + dy, x1 + dx, y1 + dy];
			if (handle.includes('n')) y0 += dy;
			if (handle.includes('s') && handle !== 'move') y1 += dy;
			if (handle.includes('w')) x0 += dx;
			if (handle.includes('e') && handle !== 'move') x1 += dx;
			m.points = pts.map(([px, py]) => [
				b.width ? x0 + ((px - b.x) / b.width) * (x1 - x0) : px + (handle === 'move' ? dx : 0),
				b.height ? y0 + ((py - b.y) / b.height) * (y1 - y0) : py + (handle === 'move' ? dy : 0)
			]);
		};
		const onUp = () => {
			removeEventListener('pointermove', onMove);
			removeEventListener('pointerup', onUp);
			commit(before);
		};
		addEventListener('pointermove', onMove);
		addEventListener('pointerup', onUp);
	}

	function head(m: Mark) {
		const [[x1, y1], [x2, y2]] = m.points;
		const a = Math.atan2(y2 - y1, x2 - x1);
		const l = 8 + m.width * 2;
		return `${x2 - l * Math.cos(a - 0.5)},${y2 - l * Math.sin(a - 0.5)} ${x2},${y2} ${x2 - l * Math.cos(a + 0.5)},${y2 - l * Math.sin(a + 0.5)}`;
	}
</script>

{#snippet shapeIcon(kind: MarkupShapeName)}
	{#if kind === 'line'}<SlashIcon />
	{:else if kind === 'arrow'}<MoveUpRightIcon />
	{:else if kind === 'ellipse'}<CircleIcon />
	{:else if kind === 'step'}<span aria-hidden="true" class="grid size-4 place-items-center rounded-full border-[1.5px] border-current text-[9px] leading-none font-semibold">1</span>
	{:else}<SquareIcon />{/if}
{/snippet}

{#snippet drawn()}
	<svg class="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
		{#each marks as m (m.id)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<g
				fill="none"
				stroke={m.colour}
				stroke-width={m.width}
				stroke-linecap="round"
				stroke-linejoin="round"
				pointer-events={tool === 'select' ? 'visiblePainted' : 'none'}
				class="cursor-pointer"
				onpointerdown={() => (selected = m.id)}
			>
				{#if m.kind === 'pen'}
					<polyline points={m.points.map((p) => p.join(',')).join(' ')} />
				{:else if m.kind === 'line' || m.kind === 'arrow'}
					<line x1={m.points[0][0]} y1={m.points[0][1]} x2={m.points[1][0]} y2={m.points[1][1]} />
					{#if m.kind === 'arrow'}<polyline points={head(m)} />{/if}
				{:else if m.kind === 'rectangle'}
					{@const b = boxOf(m)}
					<rect x={b.x} y={b.y} width={b.width} height={b.height} rx="2" />
				{:else if m.kind === 'ellipse'}
					{@const b = boxOf(m)}
					<ellipse cx={b.x + b.width / 2} cy={b.y + b.height / 2} rx={b.width / 2} ry={b.height / 2} />
				{:else if m.kind === 'step'}
					<circle cx={m.points[0][0]} cy={m.points[0][1]} r="12" fill={m.colour} stroke="none" />
					<text x={m.points[0][0]} y={m.points[0][1]} fill="white" stroke="none" text-anchor="middle" dominant-baseline="central" class="text-xs font-semibold">{m.n}</text>
				{/if}
			</g>
		{/each}
	</svg>
{/snippet}

<div bind:this={stage} class="relative h-96 w-full overflow-hidden select-none">
	<div bind:this={page} class="page mx-auto flex max-w-sm flex-col gap-3 px-6 pt-10">
		<h3 bind:this={title} class="title m-0 text-lg font-semibold">Quarterly review</h3>
		<p class="lead text-muted-foreground m-0 text-sm">Revenue grew in every region but one.</p>
		<div class="figures flex items-baseline gap-4">
			<span class="figure text-4xl font-light tabular-nums">+12%</span>
			<span class="caption text-muted-foreground text-sm">North, South, West</span>
		</div>
	</div>

	{#if open}
		<Markup bind:tool bind:shape bind:colour bind:width>
			<!-- select picks elements of the page; comment places a comment -->
			<MarkupLayer class="absolute inset-0" root={page} bind:selected={picked} onPlace={place} />
			{#if drawing}
				<!-- pen, shapes, steps -->
				<div
					class="absolute inset-0 touch-none cursor-crosshair"
					role="presentation"
					onpointerdown={down}
					onpointermove={move}
					onpointerup={up}
					onpointercancel={up}
				></div>
			{/if}
			{@render drawn()}
			{#if chosen}
				<MarkupSelection class="absolute" rect={boxOf(chosen)} onHold={hold} />
			{/if}

			{#each comments as c, i (c.id)}
				<MarkupComment bind:open={c.open} bind:value={c.text} onOpenChange={(o) => closed(c, o)}>
					<MarkupCommentPin variant={c.done ? 'done' : 'default'} anchor={c.element} at={c.at} aria-label="Comment {i + 1}">
						{#if c.done}<CheckIcon />{:else}{i + 1}{/if}
					</MarkupCommentPin>
					<MarkupCommentBox placeholder="Add a comment" aria-label="Comment {i + 1}">
						<MarkupCommentSend aria-label="Save"><ArrowUpIcon /></MarkupCommentSend>
					</MarkupCommentBox>
				</MarkupComment>
			{/each}

			<MarkupBar aria-label="Mark up this page" class="absolute max-w-[calc(100%-1rem)]">
				<MarkupTools aria-label="Tools">
					<MarkupTool value="select" aria-label="Select"><MousePointer2Icon /></MarkupTool>
					<MarkupTool value="comment" aria-label="Comment"><MessageCircleIcon /></MarkupTool>
					<MarkupTool value="pen" aria-label="Pen"><PencilIcon /></MarkupTool>
					<MarkupShapes aria-label="Shape" kindsLabel="Shapes">
						{#snippet icon({ shape: kind })}{@render shapeIcon(kind)}{/snippet}
						<MarkupShape value="line">{@render shapeIcon('line')} Line</MarkupShape>
						<MarkupShape value="arrow">{@render shapeIcon('arrow')} Arrow</MarkupShape>
						<MarkupShape value="rectangle">{@render shapeIcon('rectangle')} Rectangle</MarkupShape>
						<MarkupShape value="ellipse">{@render shapeIcon('ellipse')} Ellipse</MarkupShape>
						<MarkupShape value="step">{@render shapeIcon('step')} Step</MarkupShape>
					</MarkupShapes>
				</MarkupTools>
				{#if drawing || marks.length > 0}
					<!-- drawing, or something drawn: its colour, its width, and the history -->
					<MarkupSeparator />
					<MarkupTools aria-label="Style">
						<MarkupColors aria-label="Colour">
							{#each colours as c (c.value)}
								<ColorPickerSwatch value={c.value} aria-label={c.name} />
							{/each}
						</MarkupColors>
						<MarkupWidths aria-label="Width">
							<MarkupWidth value={2} aria-label="Thin" />
							<MarkupWidth value={3} aria-label="Medium" />
							<MarkupWidth value={6} aria-label="Thick" />
						</MarkupWidths>
					</MarkupTools>
					<!-- on a phone the history wraps to a second row: no line in front of it there -->
					<MarkupSeparator class="max-sm:hidden" />
					<MarkupAction aria-label="Undo" disabled={past.length === 0} onclick={undo}><Undo2Icon /></MarkupAction>
					<MarkupAction aria-label="Redo" disabled={future.length === 0} onclick={redo}><Redo2Icon /></MarkupAction>
					<MarkupAction aria-label={selected === null ? 'Delete all' : 'Delete'} disabled={marks.length === 0} onclick={remove}><Trash2Icon /></MarkupAction>
				{/if}
				<MarkupSeparator />
				<MarkupClose aria-label="Close" onclick={() => (open = false)}><XIcon /></MarkupClose>
			</MarkupBar>
		</Markup>
	{:else}
		{@render drawn()}
		<button type="button" class="text-muted-foreground absolute bottom-6 left-1/2 -translate-x-1/2 text-sm underline" onclick={() => (open = true)}>Open the bar again</button>
	{/if}
</div>
