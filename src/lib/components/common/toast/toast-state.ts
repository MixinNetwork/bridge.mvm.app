import { get, writable } from '@square/svelte-store';
import type { SvelteComponent } from 'svelte';

export interface ToastProps {
	node: SvelteComponent;
	isOpen: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	contentProps?: any;
}

export const toastStore = writable<ToastProps[]>([]);

export const renderToast = (props: ToastProps) => {
	const $toastStore = get(toastStore);
	if ($toastStore.find(({ node }) => node === props.node)) return;
	toastStore.update((state) => [...state, props]);
};

export const unRenderModal = (contentNode: SvelteComponent) => {
	const $toastStore = get(toastStore);
	if (!$toastStore.find(({ node }) => node === contentNode)) return;

	toastStore.update((state) => [...state.filter((d) => d.node !== contentNode)]);
};

export default toastStore;
