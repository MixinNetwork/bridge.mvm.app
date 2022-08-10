<script context="module" lang="ts">
	import Brand from '$lib/components/brand.svelte';
	import walletConnect from '$lib/assets/logo/wallet-connect.svg';
	import metamask from '$lib/assets/logo/metamask.svg';
	import type { ProviderKey } from '$lib/web3/type';
	import { account, provider, setProvider, switchMVM } from '$lib/stores/ether';
	import SpinnerModal from '$lib/components/common/spinner-modal.svelte';
	import { legalUser, registerAndSave } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { lastUrl } from '$lib/stores/last-url';
	import { createWeb3Client } from '$lib/web3';
	import { clearCachedProvider } from '$lib/stores/cached-provider';

	interface IProvider {
		key: ProviderKey;
		title: string;
		desc: string;
		icon: string;
	}

	const providers: IProvider[] = [
		{
			key: 'injected',
			title: 'Metamask',
			desc: 'Connect using browser wallet',
			icon: metamask
		},
		{
			key: 'walletconnect',
			title: 'WalletConnect',
			desc: 'Connect using WalletConnect',
			icon: walletConnect
		}
	];
</script>

<script lang="ts">
	let loading = false;

	const connect = async (provider: ProviderKey) => {
		try {
			loading = true;

			const web3Client = await createWeb3Client(provider);
			clearCachedProvider();
			const p = await web3Client.connect();
			await setProvider(p);

			if (!$account) throw new Error('No account found');

			await registerAndSave($account);
			await switchMVM();
		} finally {
			loading = false;
		}
	};

	$: if ($legalUser && $provider) {
		goto($lastUrl || '/');
	}
</script>

<div class="flex flex-col items-center pt-12">
	<Brand />
	<div class=" mt-14 flex flex-col items-start space-y-9 rounded-2xl bg-white pt-8 pb-12 shadow-md">
		<div class="self-center text-xl font-bold">Login</div>

		{#each providers as { title, desc, icon, key } (key)}
			<button class="flex space-x-3 px-8" on:click={() => connect(key)}>
				<img src={icon} alt={title} width="48" height="48" />
				<div class="flex flex-col items-start">
					<div class="font-bold">{title}</div>
					<div class="text-sm font-semibold opacity-20">{desc}</div>
				</div>
			</button>
		{/each}
	</div>
</div>

<SpinnerModal isOpen={loading} />
