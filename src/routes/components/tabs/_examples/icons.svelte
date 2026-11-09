<script lang="ts">
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import CheckIcon from '@lucide/svelte/icons/check';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import { Tabs, TabsList, TabsTrigger } from '#lib/registry/ui/tabs/index.js';
</script>

<Tabs value="inbox" class="w-full max-w-md">
	<TabsList aria-label="Mail">
		<TabsTrigger value="inbox"><InboxIcon aria-hidden="true" />Inbox</TabsTrigger>
		<TabsTrigger value="done"><CheckIcon aria-hidden="true" />Done</TabsTrigger>
		<TabsTrigger value="archive"><ArchiveIcon aria-hidden="true" />Archive</TabsTrigger>
	</TabsList>
</Tabs>
