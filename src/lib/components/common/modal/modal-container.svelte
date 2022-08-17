<script lang="ts">
	import { get } from '@square/svelte-store';
	import Overlay from './overlay.svelte';
	import modalState from './modal-state';

	const keyDown = (evt: KeyboardEvent) => {
		if (evt.code === 'Escape') {
			const currentModals = get(modalState);
			const currentModal = currentModals[currentModals.length - 1];

			currentModal.keyboardClosable &&
				currentModal &&
				currentModal.onClose &&
				currentModal.onClose();
		}
	};
</script>

<svelte:window on:keydown={keyDown} />

{#each $modalState as { node, onClose, callback, maskClosable, overlayClass } (node)}
	<Overlay {onClose} {maskClosable} class={overlayClass}>
		<svelte:component this={node} {onClose} {callback} />
	</Overlay>
{/each}
