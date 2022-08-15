<script lang="ts">
	import { get } from '@square/svelte-store';
	import { focus } from 'focus-svelte';
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

{#each $modalState as { node, onClose, maskClosable } (node)}
	<Overlay {onClose} {maskClosable}>
		<div use:focus={true}>
			<svelte:component this={node} {onClose} />
		</div>
	</Overlay>
{/each}
