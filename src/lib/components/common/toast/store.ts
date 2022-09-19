import type { SvelteComponentTyped } from 'svelte';
import { writable } from '@square/svelte-store';
import Success from './success.svelte';

type ToastType = 'success';
type Component = typeof SvelteComponentTyped<Record<string, any>>;
type ToastMap = {
	[key in ToastType]: Component;
};

const toastMap: ToastMap = {
	success: Success
};

export interface ToastProps<T extends Record<string, any>> {
	index: number;
	message: string;
	component: Component;
}

export const toastStore = writable<ToastProps<any>[]>([]);

export const showToast = (type: ToastType, message: string, duration = 3000) => {
	const index = Date.now();

	toastStore.update((toasts) => [
		...toasts,
		{
			index,
			message,
			component: toastMap[type]
		}
	]);

	setTimeout(() => {
		toastStore.update((toasts) => toasts.filter((toast) => toast.index !== index));
	}, duration);
};
