/*
 * The activity graph's layout: pure functions from (data, granularity, range, week start) to a
 * grid of cells plus the label positions. No DOM, no Svelte, no copy.
 *
 * All dates are local calendar days at midnight (`new Date(y, m, d)`); day differences are rounded
 * so a daylight-saving shift never moves a cell.
 */

/** How much time one cell covers. */
export type ActivityGranularity = 'day' | 'week' | 'month' | 'year';

/** Sunday = 0 … Saturday = 6, as `Date.getDay()`. */
export type ActivityWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** A calendar day: `YYYY-MM-DD` (a longer ISO string is cut to its first 10 characters) or a Date. */
export type ActivityDate = string | Date;

/** Values per calendar day, keyed `YYYY-MM-DD`; a coarser cell sums the days it covers. */
export type ActivityData = Record<string, number> | Map<string, number>;

/** The first and last day shown, both inclusive. */
export type ActivityRange = { start: ActivityDate; end: ActivityDate };

/** 0 = nothing in this cell; 1–4 = the intensity steps. */
export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

/** One cell: a day, a week, a month or a year inside the range. */
export type ActivityCell = {
	/** `YYYY-MM-DD` of the unit's first day (also for a unit the range cuts), unique in the grid. */
	key: string;
	granularity: ActivityGranularity;
	/** first day counted (the unit's start, or the range start if that is later) */
	start: Date;
	/** last day counted (the unit's end, or the range end if that is earlier) */
	end: Date;
	/** the sum of the days' values */
	value: number;
	level: ActivityLevel;
	row: number;
	col: number;
};

/** A label above a column (months, years) or beside a row (weekdays, years). */
export type ActivityLabel = {
	/** the date the label names (format it with Intl) */
	date: Date;
	/** column or row index it starts at */
	index: number;
	/** how many columns or rows it may take */
	span: number;
	/** what to format: a month, a weekday or a year */
	unit: 'month' | 'weekday' | 'year';
};

export type ActivityModel = {
	granularity: ActivityGranularity;
	/** row-major slots; `null` is a position outside the range (drawn blank, not focusable) */
	rows: (ActivityCell | null)[][];
	cols: number;
	/** the cells in time order (oldest first) */
	cells: ActivityCell[];
	columnLabels: ActivityLabel[];
	rowLabels: ActivityLabel[];
	/** the sum over every cell */
	total: number;
	/** the largest cell value (0 when empty) */
	max: number;
};

const DAY = 86_400_000;

export function toDay(d: ActivityDate): Date {
	if (d instanceof Date) return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	const [y, m, day] = d.slice(0, 10).split('-').map(Number);
	return new Date(y, (m ?? 1) - 1, day ?? 1);
}

export function isoDay(d: Date): string {
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function daysBetween(a: Date, b: Date): number {
	return Math.round((b.getTime() - a.getTime()) / DAY);
}

export function startOfWeek(d: Date, weekStartsOn: ActivityWeekday): Date {
	return addDays(d, -((d.getDay() - weekStartsOn + 7) % 7));
}

// The week a day belongs to is filed under the year of its fourth day (ISO 8601 for a Monday
// start), so every week lands in exactly one year row.
function weekYear(weekStart: Date): number {
	return addDays(weekStart, 3).getFullYear();
}

// The first week of a year is the one that contains 4 January.
function firstWeekOfYear(year: number, weekStartsOn: ActivityWeekday): Date {
	return startOfWeek(new Date(year, 0, 4), weekStartsOn);
}

/** The default range per granularity, ending on `today`. */
export function defaultRange(granularity: ActivityGranularity, today: Date): { start: Date; end: Date } {
	const end = toDay(today);
	const y = end.getFullYear();
	switch (granularity) {
		case 'day':
			// the last 12 months, as GitHub: one year back, plus one day
			return { start: addDays(new Date(y - 1, end.getMonth(), end.getDate()), 1), end };
		case 'week':
			return { start: new Date(y - 1, 0, 1), end };
		case 'month':
			return { start: new Date(y - 2, 0, 1), end };
		case 'year':
			return { start: new Date(y - 4, 0, 1), end };
	}
}

function unitStart(d: Date, g: ActivityGranularity, weekStartsOn: ActivityWeekday): Date {
	switch (g) {
		case 'day':
			return d;
		case 'week':
			return startOfWeek(d, weekStartsOn);
		case 'month':
			return new Date(d.getFullYear(), d.getMonth(), 1);
		case 'year':
			return new Date(d.getFullYear(), 0, 1);
	}
}

function nextUnit(d: Date, g: ActivityGranularity): Date {
	switch (g) {
		case 'day':
			return addDays(d, 1);
		case 'week':
			return addDays(d, 7);
		case 'month':
			return new Date(d.getFullYear(), d.getMonth() + 1, 1);
		case 'year':
			return new Date(d.getFullYear() + 1, 0, 1);
	}
}

/**
 * The level of a value. With `thresholds` (the lowest value of levels 1–4, ascending), a value
 * gets the highest level whose threshold it reaches; without, the steps divide the largest value
 * in view into four equal parts. Zero and below is always level 0.
 */
export function levelOf(value: number, max: number, thresholds?: readonly number[]): ActivityLevel {
	if (!(value > 0)) return 0;
	if (thresholds?.length) {
		let level = 0;
		for (const t of thresholds.slice(0, 4)) if (value >= t) level++;
		return Math.max(1, level) as ActivityLevel;
	}
	return Math.min(4, Math.max(1, Math.ceil((value / max) * 4))) as ActivityLevel;
}

export type ActivityModelInput = {
	data: ActivityData;
	granularity: ActivityGranularity;
	weekStartsOn: ActivityWeekday;
	range?: ActivityRange;
	thresholds?: readonly number[];
	/** the end of the default range (default: now) */
	today?: Date;
};

/** Builds the grid for one granularity. */
export function buildActivityModel({
	data,
	granularity: g,
	weekStartsOn,
	range,
	thresholds,
	today = new Date()
}: ActivityModelInput): ActivityModel {
	const fallback = defaultRange(g, today);
	const start = range ? toDay(range.start) : fallback.start;
	const end = range ? toDay(range.end) : fallback.end;

	// 1. One cell per unit that touches the range, oldest first.
	const cells: ActivityCell[] = [];
	const byKey = new Map<string, ActivityCell>();
	if (start <= end) {
		for (let u = unitStart(start, g, weekStartsOn); u <= end; u = nextUnit(u, g)) {
			const last = addDays(nextUnit(u, g), -1);
			const cell: ActivityCell = {
				key: isoDay(u),
				granularity: g,
				start: u < start ? start : u,
				end: last > end ? end : last,
				value: 0,
				level: 0,
				row: 0,
				col: 0
			};
			cells.push(cell);
			byKey.set(cell.key, cell);
		}
	}

	// 2. Sum the days into their cells (days outside the range are ignored).
	const entries = data instanceof Map ? data.entries() : Object.entries(data);
	for (const [k, v] of entries) {
		if (!Number.isFinite(v)) continue;
		const d = toDay(k);
		if (Number.isNaN(d.getTime()) || d < start || d > end) continue;
		const cell = byKey.get(isoDay(unitStart(d, g, weekStartsOn)));
		if (cell) cell.value += v;
	}
	let total = 0;
	let max = 0;
	for (const c of cells) {
		total += c.value;
		if (c.value > max) max = c.value;
	}
	for (const c of cells) c.level = levelOf(c.value, max, thresholds);

	// 3. Place them, and the labels.
	const columnLabels: ActivityLabel[] = [];
	const rowLabels: ActivityLabel[] = [];
	let rowCount = 0;
	let cols = 0;

	if (g === 'day') {
		// GitHub's layout: a column per week, a row per weekday.
		const first = startOfWeek(start, weekStartsOn);
		for (const c of cells) {
			c.col = Math.floor(daysBetween(first, c.start) / 7);
			c.row = (c.start.getDay() - weekStartsOn + 7) % 7;
		}
		rowCount = 7;
		cols = cells.length ? cells[cells.length - 1].col + 1 : 0;
		// a month label at the column holding its 1st; the first, cut month only if it has room
		const marks: { date: Date; col: number }[] = [{ date: start, col: 0 }];
		for (let m = new Date(start.getFullYear(), start.getMonth() + 1, 1); m <= end; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) {
			marks.push({ date: m, col: Math.floor(daysBetween(first, m) / 7) });
		}
		if (marks.length > 1 && marks[1].col - marks[0].col < 3) marks.shift();
		marks.forEach((m, i) =>
			columnLabels.push({ date: m.date, index: m.col, span: (marks[i + 1]?.col ?? cols) - m.col, unit: 'month' })
		);
		for (let r = 0; r < 7; r++) rowLabels.push({ date: addDays(first, r), index: r, span: 1, unit: 'weekday' });
	} else if (g === 'week') {
		// A row per year, a column per week of that year (up to 53).
		const y0 = cells.length ? weekYear(toDay(cells[0].key)) : 0;
		for (const c of cells) {
			const ws = toDay(c.key);
			const y = weekYear(ws);
			c.row = y - y0;
			c.col = Math.floor(daysBetween(firstWeekOfYear(y, weekStartsOn), ws) / 7);
			cols = Math.max(cols, c.col + 1);
		}
		rowCount = cells.length ? cells[cells.length - 1].row + 1 : 0;
		for (let r = 0; r < rowCount; r++) rowLabels.push({ date: new Date(y0 + r, 0, 1), index: r, span: 1, unit: 'year' });
		// month labels from the newest year's weeks (the years differ by a column at most)
		const yLast = y0 + rowCount - 1;
		const w1 = firstWeekOfYear(yLast, weekStartsOn);
		const marks = Array.from({ length: 12 }, (_, m) => ({
			date: new Date(yLast, m, 1),
			col: Math.max(0, Math.floor(daysBetween(w1, startOfWeek(new Date(yLast, m, 1), weekStartsOn)) / 7))
		}));
		if (rowCount)
			marks.forEach((m, i) =>
				columnLabels.push({ date: m.date, index: m.col, span: (marks[i + 1]?.col ?? cols) - m.col, unit: 'month' })
			);
	} else if (g === 'month') {
		// A row per year, twelve columns.
		const y0 = cells.length ? toDay(cells[0].key).getFullYear() : 0;
		for (const c of cells) {
			const u = toDay(c.key);
			c.row = u.getFullYear() - y0;
			c.col = u.getMonth();
		}
		rowCount = cells.length ? cells[cells.length - 1].row + 1 : 0;
		cols = rowCount ? 12 : 0;
		for (let r = 0; r < rowCount; r++) rowLabels.push({ date: new Date(y0 + r, 0, 1), index: r, span: 1, unit: 'year' });
		for (let m = 0; m < cols; m++) columnLabels.push({ date: new Date(y0, m, 1), index: m, span: 1, unit: 'month' });
	} else {
		// One row, a column per year; the years label the columns.
		cells.forEach((c, i) => {
			c.row = 0;
			c.col = i;
			columnLabels.push({ date: toDay(c.key), index: i, span: 1, unit: 'year' });
		});
		rowCount = cells.length ? 1 : 0;
		cols = cells.length;
	}

	const rows: (ActivityCell | null)[][] = Array.from({ length: rowCount }, () => Array(cols).fill(null));
	for (const c of cells) rows[c.row][c.col] = c;

	return { granularity: g, rows, cols, cells, columnLabels, rowLabels, total, max };
}

/** Where an arrow key (or Home/End) moves from a cell; `null` when it stays. */
export function moveFrom(
	model: ActivityModel,
	from: ActivityCell,
	key: string,
	ctrl: boolean
): ActivityCell | null {
	const { rows, cells } = model;
	const row = rows[from.row];
	const scan = (dr: number, dc: number) => {
		for (let r = from.row + dr, c = from.col + dc; r >= 0 && r < rows.length && c >= 0 && c < model.cols; r += dr, c += dc) {
			const hit = rows[r][c];
			if (hit) return hit;
		}
		return null;
	};
	switch (key) {
		case 'ArrowRight':
			return scan(0, 1);
		case 'ArrowLeft':
			return scan(0, -1);
		case 'ArrowDown':
			return scan(1, 0);
		case 'ArrowUp':
			return scan(-1, 0);
		case 'Home':
			return ctrl ? (cells[0] ?? null) : (row.find(Boolean) ?? null);
		case 'End':
			return ctrl ? (cells[cells.length - 1] ?? null) : (row.findLast(Boolean) ?? null);
		default:
			return null;
	}
}
