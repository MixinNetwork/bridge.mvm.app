<script lang="ts">
	import { afterUpdate, createEventDispatcher, onDestroy, SvelteComponent } from 'svelte';
	import modalStore, { renderModal, unRenderModal, type ModalProps } from './modal-state';
	import './modal-init';
	import { get } from '@square/svelte-store';

	export let isOpen = false;
	// type is SvelteComponent
	export let content: unknown;
	export let maskClosable = true;
	export let keyboardClosable = true;

	const dispatch = createEventDispatcher();
	let onClose = () => {
		content && unRenderModal(content as SvelteComponent);
		dispatch('close');
	};

	const sync = (isOpen: boolean) => {
		if (!content) return;

		const $modalStore = get(modalStore);
		const currentlyOpen = $modalStore.find(({ node }) => node === content);

		if (content && !currentlyOpen && isOpen) {
			let props: ModalProps = {
				onClose,
				node: content as SvelteComponent,
				maskClosable,
				keyboardClosable
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
