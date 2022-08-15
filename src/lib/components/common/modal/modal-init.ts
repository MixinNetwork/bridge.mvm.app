import ModalContainer from './modal-container.svelte';

if (typeof window !== 'undefined') {
	const container = document.createElement('div');
	document.body?.parentElement?.appendChild(container);

	new ModalContainer({
		target: container
	});
}
