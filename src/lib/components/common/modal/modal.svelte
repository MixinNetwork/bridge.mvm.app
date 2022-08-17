<script lang="ts">
	import { afterUpdate, createEventDispatcher, onDestroy, SvelteComponent } from 'svelte';
	import modalStore, { renderModal, unRenderModal, type ModalProps } from './modal-state';
	import './modal-init';
	import { get } from '@square/svelte-store';

	let isOpen = false;
	// type is SvelteComponent
	let content: unknown;
	let overlayClass: string | undefined = undefined;
	let maskClosable = true;
	let keyboardClosable = true;

	export { isOpen, content, overlayClass as class, maskClosable, keyboardClosable, callback };

	const dispatch = createEventDispatcher();
	let onClose = () => {
		content && unRenderModal(content as SvelteComponent);
		dispatch('close');
	};
	let callback = (data: unknown) => {
		dispatch('callback', data);
	};

	const sync = (isOpen: boolean) => {
		if (!content) return;

		const $modalStore = get(modalStore);
		const currentlyOpen = $modalStore.find(({ node }) => node === content);

		if (content && !currentlyOpen && isOpen) {
			let props: ModalProps = {
				onClose,
				callback,
				node: content as SvelteComponent,
				maskClosable,
				keyboardClosable,
				overlayClass
			};
			renderModal(props);
		} else if (currentlyOpen && !isOpen) {
			onClose();
		}
	};

	onDestroy(() => {
		onClose();
	});

	$: afterUpdate(() => sync(isOpen));
</script>
