/** Options for `trackVoiceLevel`. */
export type VoiceLevelOptions = {
	/** Milliseconds between two samples handed to `onLevel` (one meter slot each). Default 90. */
	interval?: number;
	/** Loudness in dBFS that reads as silence (0). Default −55, just above a quiet room. */
	floorDb?: number;
	/** Loudness in dBFS that reads as full (1). Default −15, close speech. */
	ceilingDb?: number;
};

/** A source `trackVoiceLevel` can read: an AnalyserNode the caller owns, or a MediaStream. */
export type VoiceLevelSource = AnalyserNode | MediaStream;

// Time constants of the envelope: it rises quickly with a syllable and sinks slowly after it,
// so the meter breathes with the voice instead of flickering with every frame.
const ATTACK_MS = 40;
const RELEASE_MS = 160;

// Root mean square of one frame of samples (−1..1).
function rms(buffer: Float32Array<ArrayBuffer>) {
	let sum = 0;
	for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
	return Math.sqrt(sum / buffer.length);
}

/**
 * trackVoiceLevel: reads how loud a voice is, as one 0..1 value every `interval` ms.
 *
 * Every animation frame it takes the RMS of the analyser's time-domain samples, maps it from
 * `floorDb` (0) to `ceilingDb` (1) on a decibel scale (how loudness is heard), and runs it through
 * an envelope that rises in ~40ms and decays over ~160ms. Each `interval` it hands the loudest
 * envelope value since the last sample to `onLevel`. Feed those values to `VoiceMeter`'s
 * `levels`, or give the meter the `analyser` / `stream` directly and it calls this itself.
 *
 * With a MediaStream it opens its own AudioContext (a source node into an analyser, never into
 * the speakers) and closes it on cleanup; it never stops the stream's tracks, which belong to
 * the caller. With an AnalyserNode it only reads it. Call it after a user gesture (the press
 * that started recording), or the browser keeps a new AudioContext suspended.
 *
 * Returns the cleanup: it cancels the frame loop and disconnects / closes what it opened.
 *
 * @example
 * const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
 * let levels = $state<number[]>([]);
 * const stop = trackVoiceLevel(stream, (l) => (levels = [...levels, l].slice(-25)));
 * // later: stop(); stream.getTracks().forEach((t) => t.stop());
 */
export function trackVoiceLevel(
	source: VoiceLevelSource,
	onLevel: (level: number) => void,
	{ interval = 90, floorDb = -55, ceilingDb = -15 }: VoiceLevelOptions = {}
): () => void {
	if (typeof window === 'undefined' || typeof requestAnimationFrame !== 'function') return () => {};

	let context: AudioContext | null = null;
	let input: MediaStreamAudioSourceNode | null = null;
	let analyser: AnalyserNode;

	if (source instanceof AnalyserNode) {
		analyser = source;
	} else {
		context = new AudioContext();
		input = context.createMediaStreamSource(source);
		analyser = context.createAnalyser();
		analyser.fftSize = 1024;
		input.connect(analyser);
		if (context.state === 'suspended') void context.resume();
	}

	const buffer = new Float32Array(analyser.fftSize);
	let envelope = 0;
	let peak = 0;
	let last = performance.now();
	let due = last + interval;
	let frame = 0;

	const tick = (now: number) => {
		const dt = Math.max(0, now - last);
		last = now;
		analyser.getFloatTimeDomainData(buffer);
		const db = 20 * Math.log10(Math.max(rms(buffer), 1e-6));
		const target = Math.min(1, Math.max(0, (db - floorDb) / (ceilingDb - floorDb)));
		const tau = target > envelope ? ATTACK_MS : RELEASE_MS;
		envelope += (target - envelope) * (1 - Math.exp(-dt / tau));
		peak = Math.max(peak, envelope);
		if (now >= due) {
			onLevel(peak);
			peak = envelope;
			// Catch up after a hidden tab (rAF pauses) without a burst of samples.
			due = Math.max(due + interval, now);
		}
		frame = requestAnimationFrame(tick);
	};
	frame = requestAnimationFrame(tick);

	return () => {
		cancelAnimationFrame(frame);
		input?.disconnect();
		if (context && context.state !== 'closed') void context.close();
	};
}
