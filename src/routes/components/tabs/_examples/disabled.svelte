<script lang="ts">
	import { Tabs, TabsList, TabsTrigger } from '#lib/registry/ui/tabs/index.js';
</script>

<div class="flex w-full max-w-md flex-col gap-4">
	<Tabs value="members">
		<TabsList aria-label="Team">
			<TabsTrigger value="members">Members</TabsTrigger>
			<TabsTrigger value="roles">Roles</TabsTrigger>
			<TabsTrigger value="audit" disabled>Audit log</TabsTrigger>
		</TabsList>
	</Tabs>
	<Tabs value="members" disabled>
		<TabsList aria-label="Team, read only">
			<TabsTrigger value="members">Members</TabsTrigger>
			<TabsTrigger value="roles">Roles</TabsTrigger>
			<TabsTrigger value="audit">Audit log</TabsTrigger>
		</TabsList>
	</Tabs>
</div>
