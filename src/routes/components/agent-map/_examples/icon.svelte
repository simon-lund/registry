<script lang="ts">
	import UserIcon from '@lucide/svelte/icons/user';
	import CpuIcon from '@lucide/svelte/icons/cpu';
	import DatabaseIcon from '@lucide/svelte/icons/database';
	import FileIcon from '@lucide/svelte/icons/file';
	import TerminalIcon from '@lucide/svelte/icons/terminal';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import AppWindowIcon from '@lucide/svelte/icons/app-window';
	import NetworkIcon from '@lucide/svelte/icons/network';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import FishingHookIcon from '@lucide/svelte/icons/fishing-hook';
	import type { Component } from 'svelte';

	// The examples' icons, one per node of run.ts.
	const icons: Record<string, Component> = {
		you: UserIcon,
		model: CpuIcon,
		memory: DatabaseIcon,
		files: FileIcon,
		shell: TerminalIcon,
		network: GlobeIcon,
		browser: AppWindowIcon,
		agents: NetworkIcon,
		skills: ZapIcon,
		hooks: FishingHookIcon
	};

	let { id }: { id: string } = $props();
	const Icon = $derived(icons[id]);
</script>

{#if Icon}<Icon />{/if}
