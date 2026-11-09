<script lang="ts">
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CloudOffIcon from '@lucide/svelte/icons/cloud-off';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { Middot } from '#lib/registry/ui/middot/index.js';
	import { Toast, ToastAction, ToastMessage, ToastProgress, ToastVerb } from '#lib/registry/ui/toast/index.js';
</script>

<!-- paused: the clock holds, so the wash stays full and shows its tone -->
<div class="flex w-full max-w-sm flex-col gap-3">
	<Toast duration={5000} paused>
		<CircleCheckIcon aria-hidden="true" />
		<ToastMessage><ToastVerb>Archived</ToastVerb><Middot />Q3 report</ToastMessage>
		<ToastAction>Undo</ToastAction>
		<ToastProgress />
	</Toast>
	<Toast variant="notice" duration={5000} paused>
		<CloudOffIcon aria-hidden="true" />
		<ToastMessage><ToastVerb>Offline</ToastVerb><Middot />Syncs later</ToastMessage>
		<ToastAction>Details</ToastAction>
		<ToastProgress />
	</Toast>
	<Toast variant="news" duration={5000} paused>
		<InfoIcon aria-hidden="true" />
		<ToastMessage><ToastVerb>New</ToastVerb><Middot />Shared folders</ToastMessage>
		<ToastAction>View</ToastAction>
		<ToastProgress />
	</Toast>
</div>
