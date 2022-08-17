import { get, writable } from '@square/svelte-store';
import type { SvelteComponent } from 'svelte';

export interface ModalProps {
	onClose: () => void;
	callback: ((data: unknown) => void) | undefined;
	node: SvelteComponent;
	maskClosable: boolean;
	keyboardClosable: boolean;
	overlayClass: string | undefined;
}

export const modalStore = writable<ModalProps[]>([]);

export function renderModal(props: ModalProps) {
	const $modalStore = get(modalStore);
	if ($modalStore.find(({ node }) => node === props.node)) return;
	modalStore.update((state) => [...state, props]);
}

export function unRenderModal(contentNode: SvelteComponent) {
	const $modalStore = get(modalStore);
	if (!$modalStore.find(({ node }) => node === contentNode)) return;

	modalStore.update((state) => [...state.filter((d) => d.node !== contentNode)]);
}

export default modalStore;
