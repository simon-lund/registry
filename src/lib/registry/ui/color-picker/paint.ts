import { inGamut, maxChroma, oklchToRgbUnclamped } from './color.js';

/**
 * Paints the OKLCH area at one hue: chroma 0 → `peak` across, lightness 1 → 0 down. Pixels
 * outside sRGB stay clear, so the surface beneath draws the gamut's shape. The edge is
 * antialiased against each row's first exit from sRGB (its pixel covered by how far the edge
 * reaches into it); the blue corner's sliver further out is drawn wherever it is in gamut.
 */
export function paintOklchArea(canvas: HTMLCanvasElement, w: number, h: number, hue: number, peak: number) {
	if (canvas.width !== w) canvas.width = w;
	if (canvas.height !== h) canvas.height = h;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	const image = ctx.createImageData(w, h);
	const data = image.data;
	const pixel = peak / w;
	const to8 = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255);
	for (let y = 0; y < h; y++) {
		const l = 1 - (y + 0.5) / h;
		const edge = maxChroma(l, hue);
		for (let x = 0; x < w; x++) {
			const c = ((x + 0.5) / w) * peak;
			const i = (y * w + x) * 4;
			// coverage: 1 well inside the edge, 0 past it, the fraction in between
			let cover = Math.min(1, Math.max(0, (edge - c) / pixel + 0.5));
			if (cover === 0 && inGamut({ l, c, h: hue, a: 1 })) cover = 1;
			if (cover === 0) continue;
			// the edge pixel takes the colour at the edge, so no clamped tint bleeds in
			const [r, g, b] = oklchToRgbUnclamped({ l, c: Math.min(c, cover < 1 ? edge : c), h: hue, a: 1 });
			data[i] = to8(r);
			data[i + 1] = to8(g);
			data[i + 2] = to8(b);
			data[i + 3] = Math.round(cover * 255);
		}
	}
	ctx.putImageData(image, 0, 0);
}
