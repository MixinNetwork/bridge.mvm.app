<script lang="ts">
	import Modal from '../common/modal/modal.svelte';
	import DrawerItem from './drawer/drawer-item.svelte';
	import LogoutModal from './modal/logout-modal.svelte';
	import Logout from '$lib/assets/logout.svg?component';
	import LL from '$i18n/i18n-svelte';
	import { isLogged } from '../../stores/user';

	let logoutModalOpen = false;
	const toggle = () => (logoutModalOpen = !logoutModalOpen);
</script>

{#if $isLogged}
	<DrawerItem logo={Logout} title={$LL.logout.title()} on:click={toggle} />
{/if}

<Modal modal-opened={logoutModalOpen} this={LogoutModal} modal-on-close={toggle} />
