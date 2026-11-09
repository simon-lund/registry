/*
 * A small ANSI parser for terminal output: SGR (Select Graphic Rendition, `ESC [ … m`) styles
 * become data, every other escape is dropped. No HTML is produced and no input is ever
 * interpreted as markup: the Terminal renders the segments as text in spans.
 *
 * Supported SGR: 0 reset, 1 bold, 2 dim, 3 italic, 4 underline, 7 inverse, 22 / 23 / 24 / 27
 * (their resets; 22 clears bold and dim), 30–37 / 90–97 foreground, 40–47 / 100–107 background,
 * 38 / 48 with `;5;n` (256 colours) or `;2;r;g;b` (truecolour), 39 / 49 default colour.
 * Ignored on purpose: 5/6 blink, 8 conceal, 9 strike, fonts.
 *
 * Dropped: every other CSI (cursor moves, erase line …), OSC (`ESC ] … BEL` or `ESC \`, so an
 * OSC 8 hyperlink keeps its text), other two-byte escapes and C0 controls except tab.
 * A carriage return without a newline starts the line over (progress bars that redraw a line).
 * Styles carry across newlines, as they do in a terminal.
 */

/** A colour: one of the 16 terminal colours (0–7 normal, 8–15 bright) or an exact RGB. */
export type AnsiColor = { kind: 'ansi'; index: number } | { kind: 'rgb'; r: number; g: number; b: number };

/** The style of a run of text. */
export type AnsiStyle = {
	fg?: AnsiColor;
	bg?: AnsiColor;
	bold?: boolean;
	dim?: boolean;
	italic?: boolean;
	underline?: boolean;
	inverse?: boolean;
};

/** A run of text with one style. */
export type AnsiSegment = { text: string; style: AnsiStyle };

/** One line of output: its runs, in order. An empty line has no segments. */
export type AnsiLine = AnsiSegment[];

/** The 16 colour names, in SGR order (30 + i, then 90 + i for the bright ones). */
export const ANSI_COLOR_NAMES = [
	'black',
	'red',
	'green',
	'yellow',
	'blue',
	'magenta',
	'cyan',
	'white',
	'bright-black',
	'bright-red',
	'bright-green',
	'bright-yellow',
	'bright-blue',
	'bright-magenta',
	'bright-cyan',
	'bright-white'
] as const;

const ESC = '\u001b';

// The 6×6×6 cube steps and the 24 greys of the 256-colour table (xterm's values).
const CUBE = [0, 95, 135, 175, 215, 255];

function color256(n: number): AnsiColor | undefined {
	if (!Number.isInteger(n) || n < 0 || n > 255) return undefined;
	if (n < 16) return { kind: 'ansi', index: n };
	if (n < 232) {
		const i = n - 16;
		return { kind: 'rgb', r: CUBE[Math.floor(i / 36)], g: CUBE[Math.floor(i / 6) % 6], b: CUBE[i % 6] };
	}
	const v = 8 + (n - 232) * 10;
	return { kind: 'rgb', r: v, g: v, b: v };
}

const byte = (n: number | undefined) =>
	n === undefined || Number.isNaN(n) ? undefined : Math.max(0, Math.min(255, Math.round(n)));

// Reads an extended colour (38 / 48) starting after the 38 / 48; returns the colour and how
// many parameters it used.
function extended(params: number[], at: number): [AnsiColor | undefined, number] {
	const mode = params[at];
	if (mode === 5) return [color256(params[at + 1]), 2];
	if (mode === 2) {
		const [r, g, b] = [byte(params[at + 1]), byte(params[at + 2]), byte(params[at + 3])];
		return [r === undefined || g === undefined || b === undefined ? undefined : { kind: 'rgb', r, g, b }, 4];
	}
	return [undefined, 1];
}

function applySgr(style: AnsiStyle, raw: string): AnsiStyle {
	// `ESC[m` is a reset; empty parameters count as 0.
	const params = (raw === '' ? '0' : raw).split(/[;:]/).map((p) => (p === '' ? 0 : Number(p)));
	const s: AnsiStyle = { ...style };
	for (let i = 0; i < params.length; i++) {
		const p = params[i];
		if (p === 0) {
			for (const k of Object.keys(s) as (keyof AnsiStyle)[]) delete s[k];
		} else if (p === 1) s.bold = true;
		else if (p === 2) s.dim = true;
		else if (p === 3) s.italic = true;
		else if (p === 4) s.underline = true;
		else if (p === 7) s.inverse = true;
		else if (p === 22) {
			delete s.bold;
			delete s.dim;
		} else if (p === 23) delete s.italic;
		else if (p === 24) delete s.underline;
		else if (p === 27) delete s.inverse;
		else if (p >= 30 && p <= 37) s.fg = { kind: 'ansi', index: p - 30 };
		else if (p >= 90 && p <= 97) s.fg = { kind: 'ansi', index: p - 90 + 8 };
		else if (p >= 40 && p <= 47) s.bg = { kind: 'ansi', index: p - 40 };
		else if (p >= 100 && p <= 107) s.bg = { kind: 'ansi', index: p - 100 + 8 };
		else if (p === 39) delete s.fg;
		else if (p === 49) delete s.bg;
		else if (p === 38 || p === 48) {
			const [c, used] = extended(params, i + 1);
			i += used;
			if (c) s[p === 38 ? 'fg' : 'bg'] = c;
		}
	}
	return s;
}

/**
 * A parse that can be continued: what `parseAnsiIncremental` keeps between calls. `complete` is
 * how many of `lines` ended with a newline the parser read (not one inside an OSC); `boundary` is
 * the index in `source` just after that newline, and `style` the style open there. Everything
 * after `boundary` (the last, unfinished line, a cut-off escape) is parsed again next time.
 */
export type AnsiParse = {
	readonly source: string;
	readonly lines: readonly AnsiLine[];
	readonly complete: number;
	readonly boundary: number;
	readonly style: AnsiStyle;
};

// Parses `text` from `start` with `style` open; returns the lines it produced, how many of them
// a newline ended, and the index and style just after the last such newline.
function parseFrom(text: string, start: number, style: AnsiStyle) {
	const lines: AnsiLine[] = [];
	let line: AnsiLine = [];
	let buf = '';
	let boundary = start;
	let boundaryStyle = style;

	const flush = () => {
		if (!buf) return;
		const last = line[line.length - 1];
		// Merge into the previous run when nothing changed (an SGR that set what was already set).
		if (last && last.style === style) last.text += buf;
		else line.push({ text: buf, style });
		buf = '';
	};

	for (let i = start; i < text.length; i++) {
		const ch = text[i];
		if (ch === ESC) {
			flush();
			const next = text[i + 1];
			if (next === '[') {
				// CSI: parameters 0x30–0x3F, intermediates 0x20–0x2F, one final byte 0x40–0x7E.
				let j = i + 2;
				while (j < text.length && text.charCodeAt(j) >= 0x30 && text.charCodeAt(j) <= 0x3f) j++;
				const params = text.slice(i + 2, j);
				while (j < text.length && text.charCodeAt(j) >= 0x20 && text.charCodeAt(j) <= 0x2f) j++;
				const final = text[j];
				if (final === 'm' && /^[\d;:]*$/.test(params)) style = applySgr(style, params);
				i = j; // the final byte (or the end of a cut-off sequence)
			} else if (next === ']') {
				// OSC: up to BEL or ST (ESC \). A cut-off one swallows the rest, as a terminal would.
				let j = i + 2;
				while (j < text.length && text[j] !== '\u0007' && !(text[j] === ESC && text[j + 1] === '\\')) j++;
				i = text[j] === ESC ? j + 1 : j;
			} else {
				i += 1; // a two-byte escape (ESC c, ESC 7 …): drop both
			}
			continue;
		}
		if (ch === '\n') {
			flush();
			lines.push(line);
			line = [];
			boundary = i + 1;
			boundaryStyle = style;
			continue;
		}
		if (ch === '\r') {
			if (text[i + 1] === '\n') continue; // CRLF: the \n ends the line
			// A bare CR redraws the line: start it over.
			buf = '';
			line = [];
			continue;
		}
		const code = text.charCodeAt(i);
		if ((code < 0x20 && ch !== '\t') || code === 0x7f) continue; // other controls
		buf += ch;
	}
	flush();
	const complete = lines.length;
	if (line.length || (text.length && !text.endsWith('\n'))) lines.push(line);
	return { lines, complete, boundary, style: boundaryStyle };
}

/**
 * Parses terminal output into lines of styled segments. A trailing newline does not add an
 * empty last line. Accepts a string or an array of lines (joined with newlines first, so
 * styles carry across, as in one stream).
 */
export function parseAnsi(output: string | readonly string[]): AnsiLine[] {
	const text = typeof output === 'string' ? output : output.join('\n');
	return parseFrom(text, 0, {}).lines;
}

/**
 * Like parseAnsi, but continues `previous` when the output only grew (a stream): the lines a
 * newline already ended are kept as they were (the same objects, so a keyed render skips them)
 * and only the rest is parsed, with the style that was open there. Anything else (cleared,
 * replaced, edited) is parsed in full. The result's `lines` equal parseAnsi's for the same output.
 *
 * @example
 * let parse = parseAnsiIncremental('');
 * parse = parseAnsiIncremental(log, parse); // on every chunk; parse.lines to render
 */
export function parseAnsiIncremental(output: string | readonly string[], previous?: AnsiParse): AnsiParse {
	const source = typeof output === 'string' ? output : output.join('\n');
	if (previous && source === previous.source) return previous;
	if (!previous || previous.boundary === 0 || !source.startsWith(previous.source)) {
		return { source, ...parseFrom(source, 0, {}) };
	}
	const tail = parseFrom(source, previous.boundary, previous.style);
	const kept = previous.lines.slice(0, previous.complete);
	return {
		source,
		lines: kept.concat(tail.lines),
		complete: previous.complete + tail.complete,
		boundary: tail.boundary,
		style: tail.style
	};
}

/** The text without any escape sequences (what the copy button puts on the clipboard). */
export function stripAnsi(output: string | readonly string[]): string {
	return parseAnsi(output)
		.map((l) => l.map((s) => s.text).join(''))
		.join('\n');
}
