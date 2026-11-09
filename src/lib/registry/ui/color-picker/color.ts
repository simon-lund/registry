/*
 * The colour maths of the ColorPicker, ours and dependency-free: parse a CSS colour string
 * (hex, rgb(a), hsl(a), oklch), convert between sRGB, HSV, HSL and OKLCH, and format the result.
 *
 * Units: sRGB channels and alpha 0–1; HSV / HSL hue 0–360, the rest 0–1; OKLCH lightness 0–1,
 * chroma 0–~0.37 (absolute), hue 0–360. OKLCH and OKLab follow Ottosson's definition, the
 * one CSS Color 4 uses, so `oklch(…)` strings read the same here as in the browser.
 */

export type Rgb = { r: number; g: number; b: number; a: number };
export type Hsv = { h: number; s: number; v: number; a: number };
export type Hsl = { h: number; s: number; l: number; a: number };
export type Oklch = { l: number; c: number; h: number; a: number };

/** The output formats a ColorPicker can write into its value. */
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

/** The two models the 2D area and the hue slider can work in. */
export type ColorSpace = 'hsv' | 'oklch';

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const wrapHue = (h: number) => ((h % 360) + 360) % 360;

// ── parsing ──────────────────────────────────────────────────────────────────────────────────

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function parseHex(input: string): Rgb | null {
	const m = HEX.exec(input.trim());
	if (!m) return null;
	let hex = m[1];
	if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('');
	const n = (i: number) => parseInt(hex.slice(i, i + 2), 16) / 255;
	return { r: n(0), g: n(2), b: n(4), a: hex.length === 8 ? n(6) : 1 };
}

// A number, a percentage, or `none` (CSS Color 4: a missing component reads as zero).
function num(token: string | undefined, percentOf: number): number | null {
	if (token === undefined) return null;
	if (token === 'none') return 0;
	const pct = token.endsWith('%');
	const n = Number(pct ? token.slice(0, -1) : token);
	if (!Number.isFinite(n) || token === '') return null;
	return pct ? (n / 100) * percentOf : n;
}

function hueOf(token: string | undefined): number | null {
	if (token === undefined) return null;
	if (token === 'none') return 0;
	const m = /^(-?[\d.]+(?:e-?\d+)?)(deg|rad|grad|turn)?$/i.exec(token);
	if (!m) return null;
	const n = Number(m[1]);
	if (!Number.isFinite(n)) return null;
	const unit = (m[2] ?? 'deg').toLowerCase();
	const deg = unit === 'rad' ? (n * 180) / Math.PI : unit === 'grad' ? n * 0.9 : unit === 'turn' ? n * 360 : n;
	return wrapHue(deg);
}

// `name(a b c / d)` or `name(a, b, c, d)` → its name and up to four tokens.
function fn(input: string): { name: string; parts: string[] } | null {
	const m = /^([a-z]+)\(\s*([^)]*)\)$/i.exec(input.trim());
	if (!m) return null;
	const body = m[2].trim();
	let parts: string[];
	if (body.includes(',')) {
		parts = body.split(',').map((p) => p.trim());
	} else {
		const [main, alpha] = body.split('/').map((p) => p.trim());
		parts = main.split(/\s+/);
		if (alpha !== undefined) parts.push(alpha);
	}
	if (parts.length < 3 || parts.length > 4 || parts.some((p) => p === '')) return null;
	return { name: m[1].toLowerCase(), parts: parts.map((p) => p.toLowerCase()) };
}

/**
 * Reads a CSS colour string: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa` (the `#` optional), `rgb()` /
 * `rgba()`, `hsl()` / `hsla()` and `oklch()`, in comma or space syntax, with an optional alpha.
 * Out-of-gamut `oklch()` is brought into sRGB by reducing its chroma. Returns `null` for anything
 * else (named colours included).
 */
export function parseColor(input: string | null | undefined): Rgb | null {
	if (!input) return null;
	const hex = parseHex(input);
	if (hex) return hex;
	const f = fn(input);
	if (!f) return null;
	const [p0, p1, p2, p3] = f.parts;
	const alpha = p3 === undefined ? 1 : num(p3, 1);
	if (alpha === null) return null;
	const a = clamp(alpha);
	if (f.name === 'rgb' || f.name === 'rgba') {
		const [r, g, b] = [p0, p1, p2].map((p) => num(p, 255));
		if (r === null || g === null || b === null) return null;
		return { r: clamp(r / 255), g: clamp(g / 255), b: clamp(b / 255), a };
	}
	if (f.name === 'hsl' || f.name === 'hsla') {
		const h = hueOf(p0);
		const s = num(p1, 100);
		const l = num(p2, 100);
		if (h === null || s === null || l === null) return null;
		return hslToRgb({ h, s: clamp(s / 100), l: clamp(l / 100), a });
	}
	if (f.name === 'oklch') {
		const l = num(p0, 1);
		const c = num(p1, 0.4);
		const h = hueOf(p2);
		if (l === null || c === null || h === null) return null;
		return oklchToRgb(gamutMap({ l: clamp(l), c: Math.max(0, c), h, a }));
	}
	return null;
}

// ── sRGB ↔ HSV / HSL ─────────────────────────────────────────────────────────────────────────

/** sRGB → HSV. A grey has no hue (0); black has no saturation (0). */
export function rgbToHsv({ r, g, b, a }: Rgb): Hsv {
	const max = Math.max(r, g, b);
	const d = max - Math.min(r, g, b);
	let h = 0;
	if (d > 0) {
		if (max === r) h = ((g - b) / d) % 6;
		else if (max === g) h = (b - r) / d + 2;
		else h = (r - g) / d + 4;
	}
	return { h: wrapHue(h * 60), s: max === 0 ? 0 : d / max, v: max, a };
}

export function hsvToRgb({ h, s, v, a }: Hsv): Rgb {
	const f = (n: number) => {
		const k = (n + h / 60) % 6;
		return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
	};
	return { r: f(5), g: f(3), b: f(1), a };
}

export function rgbToHsl(rgb: Rgb): Hsl {
	const { h, s: sv, v, a } = rgbToHsv(rgb);
	const l = v * (1 - sv / 2);
	const s = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
	return { h, s, l, a };
}

export function hslToRgb({ h, s, l, a }: Hsl): Rgb {
	const v = l + s * Math.min(l, 1 - l);
	return hsvToRgb({ h, s: v === 0 ? 0 : 2 * (1 - l / v), v, a });
}

// ── sRGB ↔ OKLCH ─────────────────────────────────────────────────────────────────────────────

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) =>
	c <= 0.0031308 ? c * 12.92 : 1.055 * Math.sign(c) * Math.abs(c) ** (1 / 2.4) - 0.055;

/** sRGB → OKLCH. A grey has no hue (0). */
export function rgbToOklch({ r, g, b, a }: Rgb): Oklch {
	const [lr, lg, lb] = [r, g, b].map(toLinear);
	const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	const c = Math.hypot(A, B);
	return { l: L, c, h: c < 1e-4 ? 0 : wrapHue((Math.atan2(B, A) * 180) / Math.PI), a };
}

/** OKLCH → sRGB channels without clamping: a channel outside 0–1 means out of gamut. */
export function oklchToRgbUnclamped({ l: L, c, h }: Oklch): [number, number, number] {
	const rad = (h * Math.PI) / 180;
	const A = c * Math.cos(rad);
	const B = c * Math.sin(rad);
	const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
	const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
	const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
	return [
		fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
		fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
		fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
	];
}

const EPS = 1e-4;

/** Whether an OKLCH colour lies inside sRGB. */
export function inGamut(color: Oklch): boolean {
	return oklchToRgbUnclamped(color).every((v) => v >= -EPS && v <= 1 + EPS);
}

/** OKLCH → sRGB (channels clamped; bring it into gamut first with `gamutMap` for a true match). */
export function oklchToRgb(color: Oklch): Rgb {
	const [r, g, b] = oklchToRgbUnclamped(color);
	return { r: clamp(r), g: clamp(g), b: clamp(b), a: color.a };
}

/**
 * The largest chroma at this lightness and hue reached from the grey axis without leaving sRGB.
 * (Near the blue corner the constant-hue line leaves the gamut and touches it again further out;
 * this is the first exit, so everything below it is in gamut.)
 */
export function maxChroma(l: number, h: number): number {
	if (l <= 0 || l >= 1) return 0;
	let lo = 0;
	while (lo < 0.4 && inGamut({ l, c: lo + 0.005, h, a: 1 })) lo += 0.005;
	let hi = lo + 0.005;
	for (let i = 0; i < 10; i++) {
		const mid = (lo + hi) / 2;
		if (inGamut({ l, c: mid, h, a: 1 })) lo = mid;
		else hi = mid;
	}
	return lo;
}

const peakCache = new Map<number, number>();

/**
 * The largest in-gamut chroma at this hue over all lightnesses (the tip of the hue's slice of
 * sRGB, the blue corner's sliver included), so an OKLCH area can span the chroma this hue
 * actually reaches. Cached per degree.
 */
export function peakChroma(h: number): number {
	const key = Math.round(wrapHue(h)) % 360;
	const cached = peakCache.get(key);
	if (cached !== undefined) return cached;
	let peak = 0;
	for (let i = 1; i < 100; i++) {
		const l = i / 100;
		for (let c = 0.4; c > peak; c -= 0.002) {
			if (inGamut({ l, c, h: key, a: 1 })) {
				peak = c;
				break;
			}
		}
	}
	// headroom: the sampled tip can sit just under the true one, and a neighbouring hue's further out
	peak = peak * 1.02 + 0.002;
	peakCache.set(key, peak);
	return peak;
}

/** Brings an OKLCH colour into sRGB by reducing its chroma, keeping lightness and hue. */
export function gamutMap(color: Oklch): Oklch {
	if (inGamut(color)) return color;
	return { ...color, c: Math.min(color.c, maxChroma(color.l, color.h)) };
}

// ── formatting ───────────────────────────────────────────────────────────────────────────────

const round = (n: number, digits: number) => {
	const f = 10 ** digits;
	return Math.round(n * f) / f;
};
const byte = (c: number) => Math.round(clamp(c) * 255);
const hex2 = (c: number) => byte(c).toString(16).padStart(2, '0');

/** `#rrggbb`, or `#rrggbbaa` when `alpha` is on and the colour is not opaque. Lower case. */
export function toHex(rgb: Rgb, alpha = false): string {
	const base = `#${hex2(rgb.r)}${hex2(rgb.g)}${hex2(rgb.b)}`;
	return alpha && byte(rgb.a) < 255 ? base + hex2(rgb.a) : base;
}

/**
 * Writes a colour in `format`. Alpha appears only when `alpha` is on and the colour is not
 * opaque (`#rrggbbaa`, `rgb(r g b / a)`, `hsl(h s l / a)`, `oklch(l c h / a)`); otherwise the
 * opaque form. Space syntax (CSS Color 4) for the functions.
 *
 * @example
 * formatColor({ r: 1, g: 0, b: 0, a: 1 }, 'oklch') // 'oklch(62.8% 0.258 29.23)'
 */
export function formatColor(rgb: Rgb, format: ColorFormat, alpha = false): string {
	const showAlpha = alpha && round(rgb.a, 2) < 1;
	const tail = showAlpha ? ` / ${round(rgb.a, 2)}` : '';
	switch (format) {
		case 'hex':
			return toHex(rgb, alpha);
		case 'rgb':
			return `rgb(${byte(rgb.r)} ${byte(rgb.g)} ${byte(rgb.b)}${tail})`;
		case 'hsl': {
			const { h, s, l } = rgbToHsl(rgb);
			return `hsl(${round(h, 1)} ${round(s * 100, 1)}% ${round(l * 100, 1)}%${tail})`;
		}
		case 'oklch': {
			const { l, c, h } = rgbToOklch(rgb);
			return `oklch(${round(l * 100, 1)}% ${round(c, 3)} ${round(h, 2)}${tail})`;
		}
	}
}

/** Whether two colours are the same at 8 bits per channel (alpha included). */
export function sameColor(a: Rgb | null, b: Rgb | null): boolean {
	if (!a || !b) return false;
	return toHex(a, true) === toHex(b, true);
}
