<script lang="ts">
	import { createEventDispatcher, onDestroy, SvelteComponent } from 'svelte';
	import modalStore, { renderModal, unRenderModal, type ModalProps } from './modal-state';
	import { get } from '@square/svelte-store';

	let isOpen = false;
	// type is SvelteComponent
	let content: unknown;
	let overlayClass: string | undefined = undefined;
	let maskClosable = true;
	let keyboardClosable = true;
	let contentProps: unknown = undefined;

	export {
		isOpen,
		content,
		overlayClass as class,
		maskClosable,
		keyboardClosable,
		callback,
		contentProps
	};

	const dispatch = createEventDispatcher();
	let onClose = () => {
		content && unRenderModal(content as SvelteComponent);
		dispatch('close');
	};
	let callback = (data: unknown) => {
		dispatch('callback', data);
	};

	onDestroy(() => {
		const currentlyOpen = $modalStore.find(({ node }) => node === content);
		if (currentlyOpen) onClose();
	});

	$: if (content) {
		const $modalStore = get(modalStore);
		const currentlyOpen = $modalStore.find(({ node }) => node === content);

		if (content && isOpen) {
			let props: ModalProps = {
				onClose,
				callback,
				node: content as SvelteComponent,
				maskClosable,
				keyboardClosable,
				overlayClass,
				contentProps
			};
			renderModal(props);
		} else if (currentlyOpen && !isOpen) {
			onClose();
		}
	}
</script>
