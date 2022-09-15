<script lang="ts">
	import { createEventDispatcher, onDestroy, SvelteComponent } from 'svelte';
	import toastStore, { type ToastProps, renderToast, unRenderModal } from './toast-state';
	import { get } from '@square/svelte-store';

	let isOpen = false;
	let content: unknown;

	export { isOpen, content };

	const dispatch = createEventDispatcher();
	let onClose = () => {
		content && unRenderModal(content as SvelteComponent);
		dispatch('close');
	};

	onDestroy(() => {
		const currentlyOpen = $toastStore.find(({ node }) => node === content);
		if (currentlyOpen) onClose();
	});

	$: if (content) {
		const $toastStore = get(toastStore);
		const currentlyOpen = $toastStore.find(({ node }) => node === content);

		if (content && isOpen) {
			let props: ToastProps = {
				node: content as SvelteComponent,
				isOpen
			};
			renderToast(props);
		} else if (currentlyOpen && !isOpen) {
			onClose();
		}
	}
</script>
