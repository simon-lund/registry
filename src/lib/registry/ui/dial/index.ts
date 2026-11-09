import Root, { dialVariants, type DialSize } from './dial.svelte';
import Knob from './dial-knob.svelte';
import Stop, { dialStopVariants, type DialStopVariant } from './dial-stop.svelte';
import Unit from './dial-unit.svelte';

export {
	Root,
	Knob,
	Stop,
	Unit,
	//
	Root as Dial,
	Knob as DialKnob,
	Stop as DialStop,
	Unit as DialUnit,
	dialVariants,
	type DialSize,
	dialStopVariants,
	type DialStopVariant
};
