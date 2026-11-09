<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { getStepperItem } from './context.js';

	/**
	 * StepperTitle: the step's name, a word or two ("Account", "Profile"). It names the trigger. The
	 * current step's title is in full foreground and semibold, the others in muted-foreground (a done
	 * step is quieter, never struck through). In a narrow horizontal stepper only the current title
	 * stays in sight. A title that wraps is balanced (`text-wrap: balance`), so no word is left alone
	 * on a line.
	 *
	 * @example
	 * <StepperTitle>Profile</StepperTitle>
	 */
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLSpanElement> & { ref?: HTMLSpanElement | null } = $props();

	const item = getStepperItem('StepperTitle');

	$effect(() => {
		item.setTitle(true);
		return () => item.setTitle(false);
	});
</script>

<span
	bind:this={ref}
	id={item.titleId}
	data-slot="stepper-title"
	data-state={item.state}
	class={cn(
		'min-w-0 text-sm font-medium text-balance text-muted-foreground transition-colors duration-(--dur-quick) ease-(--ease-settle)',
		'data-[state=active]:font-semibold data-[state=active]:text-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
