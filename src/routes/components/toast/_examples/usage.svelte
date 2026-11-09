<script lang="ts">
	import { Button } from '#lib/registry/ui/button/index.js';
	import { Toaster, toast } from '#lib/registry/ui/toast/index.js';
</script>

<div class="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm">
	<Toaster aria-label="Notifications" />
</div>

<Button onclick={() => toast({ verb: 'Saved', title: 'Project brief' })}>Save</Button>
