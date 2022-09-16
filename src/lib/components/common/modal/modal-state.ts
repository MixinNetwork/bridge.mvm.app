/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, writable } from '@square/svelte-store';
import type { SvelteComponentTyped } from 'svelte';

export interface ModalProps<T extends Record<string, any>> {
	onClose: () => void;
	callback?: (data: unknown) => void;
	node: typeof SvelteComponentTyped<T>;
	maskClosable: boolean;
	keyboardClosable: boolean;
	overlayClass?: string;
	contentProps?: T;
}

export const modalStore = writable<ModalProps<any>[]>([]);

export const renderModal = <T extends Record<string, any>>(props: ModalProps<T>) => {
	const $modalStore = get(modalStore);
	if ($modalStore.find(({ node }) => node === props.node)) return;
	modalStore.update((state) => [...state, props]);
};

export const unRenderModal = <T extends Record<string, any>>(
	contentNode: typeof SvelteComponentTyped<T>
) => {
	const $modalStore = get(modalStore);
	if (!$modalStore.find(({ node }) => node === contentNode)) return;

	modalStore.update((state) => [...state.filter((d) => d.node !== contentNode)]);
};

export default modalStore;
