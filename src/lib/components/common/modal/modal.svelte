<script lang="ts">
	import { createEventDispatcher, onDestroy, SvelteComponentTyped } from 'svelte';
	import modalStore, { renderModal, unRenderModal, type ModalProps } from './modal-state';
	import { get } from '@square/svelte-store';

	type ComponentTyped = $$Generic<typeof SvelteComponentTyped<Record<string, any>>>;
	type PropsTyped = ComponentTyped extends typeof SvelteComponentTyped<
		infer T extends Record<string, any>
	>
		? T
		: never;

	let isOpen = false;
	let content: ComponentTyped;
	let overlayClass: string | undefined = undefined;
	let maskClosable = true;
	let keyboardClosable = true;
	let contentProps: PropsTyped | undefined = undefined;

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
		content && unRenderModal(content);
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
			let props: ModalProps<any> = {
				onClose,
				callback,
				node: content,
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
