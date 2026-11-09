import Root, { toastVariants, type ToastVariant } from './toast.svelte';
import Message from './toast-message.svelte';
import Verb from './toast-verb.svelte';
import Action from './toast-action.svelte';
import Progress from './toast-progress.svelte';
import Toaster from './toaster.svelte';
import {
	toast,
	toaster,
	createToaster,
	ToastQueue,
	type ToastOptions,
	type ToastData,
	type ToastActionOptions,
	type ToastDismissReason
} from './toaster.svelte.js';

export {
	Root,
	Message,
	Verb,
	Action,
	Progress,
	//
	Root as Toast,
	Message as ToastMessage,
	Verb as ToastVerb,
	Action as ToastAction,
	Progress as ToastProgress,
	toastVariants,
	type ToastVariant,
	Toaster,
	toast,
	toaster,
	createToaster,
	ToastQueue,
	type ToastOptions,
	type ToastData,
	type ToastActionOptions,
	type ToastDismissReason
};
