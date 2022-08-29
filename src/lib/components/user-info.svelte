<script lang="ts">
	import clsx from 'clsx';

	import { providerKey } from '../stores/provider';
	import { shortAddress } from '../stores/user';

	import MetaMask from '$lib/assets/logo/metamask.svg';
	import WalletConnect from '$lib/assets/logo/wallet-connect.svg';
	import Logout from '$lib/assets/logout.svg?component';
	import Arrow from '$lib/assets/arrow.svg?component';

	import { totalBalanceUsd } from '../stores/model';
	import { formatCurrency } from '../helpers/big';
	import Modal from './common/modal/modal.svelte';
	import LogoutModal from './modal/logout-modal.svelte';

	let clazz: string | undefined = undefined;
	export { clazz as class };
	let logoutModalOpen = false;

	$: providerLogo = $providerKey === 'injected' ? MetaMask : WalletConnect;
</script>

<div
	class={clsx(
		'group relative flex md:h-10 items-center space-x-3 md:py-2 md:px-4 md:rounded-full md:bg-white w-fit transition',
		clazz
	)}
>
	<img src={providerLogo} alt={$providerKey} class="h-14 w-14 md:h-4 md:w-4" />
	<div class="font-bold md:text-sm md:font-semibold">
		<div class="text-xl md:hidden">{formatCurrency($totalBalanceUsd || 0)}</div>
		<div class="inline-flex">
			<span class="sm:hidden md:block">Account&nbsp;</span>
			<span class="text-sm opacity-30 md:opacity-100">{$shortAddress}</span>
		</div>
	</div>
	<Arrow class="rotate-90 sm:hidden md:block" />

	<div
		class="invisible absolute top-9 right-0 mt-2 hidden w-96 flex-col rounded-2xl bg-white pb-5 opacity-0 transition-all delay-100 group-hover:visible group-hover:opacity-100 md:flex"
	>
		<div class=" flex items-center space-x-3 p-6">
			<img src={providerLogo} alt={$providerKey} class="h-12 w-12" />
			<div class=" font-semibold">
				<div>
					{$shortAddress}
				</div>
			</div>
		</div>
		<button
			class="flex h-14 items-center space-x-3 px-6 hover:bg-brand-primary hover:bg-opacity-5"
			on:click={() => (logoutModalOpen = !logoutModalOpen)}
		>
			<Logout />
			<div class="grow text-start">Log out</div>
			<Arrow />
		</button>
	</div>

	<Modal
		isOpen={logoutModalOpen}
		content={LogoutModal}
		on:close={() => (logoutModalOpen = !logoutModalOpen)}
	/>
</div>
