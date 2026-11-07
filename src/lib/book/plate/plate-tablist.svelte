<script lang="ts">
	interface Tab {
		value: string;
		label: string;
	}

	interface Props {
		tabs: Tab[];
		/** The shown tab's value. */
		value: string;
		/** Prefix of the ids: the tab is `{id}-{value}-tab`, its panel `{id}-{value}`. */
		id: string;
		/** What the tabs choose between, read out, e.g. "Preview or code". */
		label: string;
		class?: string;
	}

	let { tabs, value = $bindable(), id, label, class: className }: Props = $props();

	const buttons: Record<string, HTMLButtonElement | undefined> = $state({});

	// The tabs pattern: the arrows move along the tabs and show the one they land on.
	function onkeydown(e: KeyboardEvent) {
		const at = tabs.findIndex((t) => t.value === value);
		let next: number;
		if (e.key === 'ArrowRight') next = (at + 1) % tabs.length;
		else if (e.key === 'ArrowLeft') next = (at - 1 + tabs.length) % tabs.length;
		else if (e.key === 'Home') next = 0;
		else if (e.key === 'End') next = tabs.length - 1;
		else return;
		e.preventDefault();
		value = tabs[next].value;
		buttons[value]?.focus();
	}
</script>

<div role="tablist" aria-label={label} class={['bg-muted inline-flex rounded-md p-0.5', className]}>
	{#each tabs as tab (tab.value)}
		<button
			bind:this={buttons[tab.value]}
			type="button"
			role="tab"
			id="{id}-{tab.value}-tab"
			aria-selected={value === tab.value}
			aria-controls="{id}-{tab.value}"
			tabindex={value === tab.value ? 0 : -1}
			onclick={() => (value = tab.value)}
			{onkeydown}
			class="text-muted-foreground hover:text-foreground focus-visible:ring-ring aria-selected:bg-background aria-selected:text-foreground rounded px-2.5 py-1 text-xs focus-visible:ring-2 focus-visible:outline-none"
		>
			{tab.label}
		</button>
	{/each}
</div>
