<script lang="ts">
	import { Checkbox } from '#lib/registry/ui/checkbox/index.js';
</script>

<div class="flex flex-col gap-2">
	<label class="text-muted-foreground flex items-center gap-2 text-sm">
		<Checkbox disabled />
		Unchecked
	</label>
	<label class="text-muted-foreground flex items-center gap-2 text-sm">
		<Checkbox disabled checked />
		Checked
	</label>
</div>
