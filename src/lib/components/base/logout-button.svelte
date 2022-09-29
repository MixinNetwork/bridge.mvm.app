<script lang="ts">
	import Modal from '../common/modal/modal.svelte';
	import LogoutModal from './modal/logout-modal.svelte';

	let logoutModalOpen = false;
	const toggle = () => (logoutModalOpen = !logoutModalOpen);

	// eslint-disable-next-line no-undef
	type $$Props = svelte.JSX.HTMLAttributes<HTMLButtonElement>;
</script>

<button on:click={toggle} {...$$props}>
	<slot />
</button>

<Modal modal-opened={logoutModalOpen} this={LogoutModal} modal-on-close={toggle} />
