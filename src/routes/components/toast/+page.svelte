<script lang="ts">
	import {
		Plate,
		PlateStage,
		PlateSection,
		PlateInstall,
		PlateExample,
		PlateApi,
		PlatePart,
		PlateProps,
		PlateProp,
		PlateMeasures,
		PlateMeasure,
		PlateCode
	} from '#lib/book/plate/index.js';
	import { examples, files, type Source } from '#lib/book/examples.js';
	import type { Component } from 'svelte';
	import meta from '#lib/registry/ui/toast/meta.json';

	const example = examples(
		import.meta.glob<Component>('./_examples/*.svelte', { eager: true, import: 'default' }),
		import.meta.glob<Source>('./_examples/*.svelte', { eager: true, import: 'default', query: '?highlight' })
	);
	const source = files(
		import.meta.glob<Source>('/src/lib/registry/ui/toast/*.{svelte,ts}', { eager: true, import: 'default', query: '?highlight' })
	);
	const usage = example('usage');
</script>

<Plate name="toast" title="Toast">
	<PlateStage example={example('demo')} />

	<PlateSection title="Installation">
		<PlateInstall name="toast" dependencies={meta.dependencies} needs={meta.registryDependencies} files={source} />
	</PlateSection>

	<PlateSection title="Usage">
		<PlateCode code={usage.code} html={usage.html} label="usage" />
	</PlateSection>

	<PlateExample title="Default" example={example('default')}>
		Pass a <code>verb</code> and a <code>title</code>. The toast leaves after 5 seconds. Without an
		action it has no wash, because the wash is the action's window.
	</PlateExample>

	<PlateExample title="Undo" example={example('undo')}>
		Set <code>action</code> for one button and the draining wash. <code>onDismiss</code> gets the
		reason, so commit the change on anything but <code>action</code>.
	</PlateExample>

	<PlateExample title="Failure" example={example('failure')}>
		A failure is a default toast with a leading icon in <code>text-destructive</code>. Pass a
		<code>children</code> snippet to <code>Toaster</code> to render the inside yourself.
	</PlateExample>

	<PlateExample title="Variants" example={example('variants')}>
		Set <code>variant</code> to <code>notice</code> or <code>news</code>. All three share the surface
		and differ only in the action's ink and the wash's tone. The words and the icon say what it means.
	</PlateExample>

	<PlateExample title="Stack" example={example('stack')}>
		Older toasts step back behind the newest, and hover, focus or a tap spreads them. Past
		<code>limit</code> (3 by default) the oldest leaves with the reason <code>overflow</code>.
	</PlateExample>

	<PlateExample title="No timeout" example={example('no-timeout')}>
		Set <code>duration: null</code> and keep the id for <code>dismiss(id)</code>. There is no promise
		helper and no update in place: for a long task, dismiss this toast and raise the result.
	</PlateExample>

	<PlateSection title="Keyboard">
		<ul class="m-0 flex flex-col gap-1 pl-5">
			<li><code>Alt+T</code> moves focus to the front toast's action, or to the stack if it has none. Again, it gives focus back.</li>
			<li><code>Escape</code> inside the stack gives focus back.</li>
			<li><code>Tab</code> and <code>Shift+Tab</code> reach the action in DOM order; <code>Enter</code> or <code>Space</code> runs it.</li>
			<li>A window holds while focus is in the stack. After an action runs, focus goes back to where it came from.</li>
		</ul>
	</PlateSection>

	<PlateSection title="API Reference">
		<PlateApi>
			<PlatePart name="Toaster">
				<p>
					Renders a queue as one stack and handles the swipe, the hold and <code>Alt+T</code>. It hangs
					above its positioned parent. One polite live region. Other attributes go to the
					<code>section</code>; give it an <code>aria-label</code>.
				</p>
				<PlateProps>
					<PlateProp name="toaster" type="ToastQueue" default="toaster">The queue to render. By default the shared one behind <code>toast()</code>.</PlateProp>
					<PlateProp name="expanded" type="boolean" default="false" bindable>The stack is spread out. Hover, focus and a tap also spread it.</PlateProp>
					<PlateProp name="children" type="Snippet<[ToastData]>">Renders the inside of each toast, in place of the message, action and wash.</PlateProp>
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="Toast">
				<p>The floating block. It owns the clock. Other attributes go to the <code>div</code>.</p>
				<PlateProps>
					<PlateProp name="variant" type={`"default" | "notice" | "news"`} default={`"default"`}>The action's ink and the wash's tone.</PlateProp>
					<PlateProp name="duration" type="number | null" default="5000">The window in ms; <code>null</code> means no clock. Read once, on mount.</PlateProp>
					<PlateProp name="paused" type="boolean" default="false">Holds the clock and the wash.</PlateProp>
					<PlateProp name="onExpire" type="() => void">The clock ran out. Not called when the toast is removed early.</PlateProp>
					<PlateProp name="children" type="Snippet" />
					<PlateProp name="ref" type="HTMLDivElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ToastMessage">
				<p>The one line. It takes the free width and truncates. Other attributes go to the <code>p</code>.</p>
				<PlateProps>
					<PlateProp name="children" type="Snippet" />
					<PlateProp name="ref" type="HTMLParagraphElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ToastVerb">
				<p>The bold first word of a message. Other attributes go to the <code>b</code>.</p>
				<PlateProps>
					<PlateProp name="children" type="Snippet" />
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ToastAction">
				<p>The one action, a ghost <code>Button</code>. It takes the Button's props, except <code>variant</code> and <code>size</code>.</p>
				<PlateProps>
					<PlateProp name="onclick" type="MouseEventHandler">Inside a <code>Toaster</code> snippet, call <code>queue.act(id)</code> so it dismisses with the reason <code>action</code>.</PlateProp>
					<PlateProp name="children" type="Snippet" />
					<PlateProp name="ref" type="HTMLElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ToastProgress">
				<p>The clock as a tonal wash behind the words, draining right to left. Without a clock it stays full. Hidden from assistive tech. Other attributes go to the <code>span</code>.</p>
				<PlateProps>
					<PlateProp name="ref" type="HTMLSpanElement | null" default="null" bindable />
					<PlateProp name="class" type="string" />
				</PlateProps>
			</PlatePart>
			<PlatePart name="toast" kind="function">
				<p><code>toast(options: ToastOptions): number</code>. Shows a toast on the shared queue and returns its id. The same function as <code>toaster.toast</code>.</p>
			</PlatePart>
			<PlatePart name="toaster" kind="const">
				<p>The shared <code>ToastQueue</code> that a <code>Toaster</code> renders by default. Its toasts wait until one is mounted.</p>
			</PlatePart>
			<PlatePart name="createToaster" kind="function">
				<p><code>createToaster(options?: {'{'} limit?: number {'}'}): ToastQueue</code>. A queue of its own, for a screen that needs its own stack.</p>
			</PlatePart>
			<PlatePart name="ToastQueue" kind="class">
				<p>The queue: plain state, no DOM. <code>new ToastQueue({'{'} limit {'}'})</code> is what <code>createToaster</code> does.</p>
				<PlateProps>
					<PlateProp name="toasts" type="ToastData[]" default="[]">Oldest first. Replaced, never mutated.</PlateProp>
					<PlateProp name="limit" type="number" default="3">Read-only, at least 1. A newer toast past it pushes the oldest out.</PlateProp>
					<PlateProp name="toast" type="(options: ToastOptions) => number">Shows a toast and returns its id.</PlateProp>
					<PlateProp name="dismiss" type="(id?: number, reason?: ToastDismissReason) => void">Removes one toast, or all of them without an id. The reason defaults to <code>dismiss</code>. Unknown ids are ignored.</PlateProp>
					<PlateProp name="act" type="(id: number) => void">Runs a toast's action, then removes it with the reason <code>action</code>.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ToastOptions" kind="type">
				<p>What <code>toast()</code> takes.</p>
				<PlateProps>
					<PlateProp name="title" type="string" required>What it happened to. One line; it truncates.</PlateProp>
					<PlateProp name="verb" type="string">The bold first word: what just happened.</PlateProp>
					<PlateProp name="action" type="ToastActionOptions">One action. While there is one, the wash shows its window.</PlateProp>
					<PlateProp name="variant" type="ToastVariant" default={`"default"`} />
					<PlateProp name="duration" type="number | null" default="5000"><code>null</code> stays until dismissed.</PlateProp>
					<PlateProp name="onDismiss" type="(reason: ToastDismissReason) => void">Called once, whatever made it leave.</PlateProp>
				</PlateProps>
			</PlatePart>
			<PlatePart name="ToastData" kind="type">
				<p><code>ToastOptions</code> with its <code>id: number</code>. What a <code>Toaster</code> snippet receives.</p>
			</PlatePart>
			<PlatePart name="ToastActionOptions" kind="type">
				<p>The action of a toast.</p>
				<PlateProps>
					<PlateProp name="label" type="string" required />
					<PlateProp name="onClick" type="() => void" required />
				</PlateProps>
			</PlatePart>
			<PlatePart name="ToastDismissReason" kind="type">
				<p>Why a toast left. Exactly one applies.</p>
				<ul class="m-0 flex flex-col gap-1 pl-5">
					<li><code>timeout</code>: its window ran out.</li>
					<li><code>swipe</code>: swiped away by hand.</li>
					<li><code>action</code>: its action ran.</li>
					<li><code>overflow</code>: a newer toast pushed it past the limit.</li>
					<li><code>dismiss</code>: the caller removed it with <code>dismiss()</code>.</li>
				</ul>
			</PlatePart>
			<PlatePart name="ToastVariant" kind="type">
				<p><code>"default" | "notice" | "news"</code>.</p>
			</PlatePart>
			<PlatePart name="toastVariants" kind="function">
				<p>The Toast's classes from <code>tailwind-variants</code>, for your own element: <code>toastVariants({'{'} variant {'}'})</code>.</p>
			</PlatePart>
		</PlateApi>
	</PlateSection>

	<PlateSection title="Measurements">
		<PlateMeasures>
			<PlateMeasure label="Height" value="at least 50px" />
			<PlateMeasure label="Text" value="14px medium, verb semibold" />
			<PlateMeasure label="Padding" value="18px · 6px beside an action" />
			<PlateMeasure label="Action" value="36px drawn, 44px to touch" />
			<PlateMeasure label="Leading icon" value="20px" />
			<PlateMeasure label="Radius" value="8px (--radius-lg)" />
			<PlateMeasure label="Default window" value="5000ms" />
			<PlateMeasure label="Limit" value="3 toasts" />
			<PlateMeasure label="Stack, collapsed" value="10px up and 5% smaller per toast, veiled 30 % then 51 %" />
			<PlateMeasure label="Stack, spread" value="8px between toasts" />
			<PlateMeasure label="Position" value="6px above the parent, 12px in from its sides" />
			<PlateMeasure label="Enter" value="220ms (--dur-base), --ease-settle" />
			<PlateMeasure label="Leave" value="140ms (--dur-quick); a sideways swipe 140 to 220ms at the finger's speed" />
			<PlateMeasure label="Swipe axis" value="after 6px" />
			<PlateMeasure label="Swipe to dismiss" value="36px down, or sideways 96px or 35 % of the width, whichever is less" />
			<PlateMeasure label="Flick" value="0.3px/ms, from 8px down or 12px sideways" />
			<PlateMeasure label="Pull up" value="rubber band, 20px at most" />
			<PlateMeasure label="Release velocity" value="last 100ms; zero after a 60ms rest" />
		</PlateMeasures>
	</PlateSection>
</Plate>
