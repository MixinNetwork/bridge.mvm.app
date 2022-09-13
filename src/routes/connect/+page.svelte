<script lang="ts">
	import Brand from '$lib/components/base/brand.svelte';
	import type { ProviderKey } from '$lib/helpers/web3client/type';
	import { account, setProvider } from '$lib/stores/ether';
	import SpinnerModal from '$lib/components/common/spinner-modal.svelte';
	import { registerAndSave } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { createWeb3Client } from '$lib/helpers/web3client';
	import { providerKey as cacheProvider, clearLastProvider } from '$lib/stores/provider';
	import { page } from '$app/stores';
	import Modal from '$lib/components/common/modal/modal.svelte';
	import { providers } from './+page';
	import { LAST_URL } from '$lib/constants/common';

	let loading = false;

	const connect = async (provider: ProviderKey) => {
		try {
			loading = true;

			const web3Client = await createWeb3Client(provider);
			clearLastProvider();
			const p = await web3Client.connect();
			await setProvider(p);

			if (!$account) throw new Error('No account found');
			if (!$cacheProvider) throw new Error('No cached provider found');

			await registerAndSave($account);
			await goto($page.url.searchParams.get(LAST_URL) || '/');
		} finally {
			loading = false;
		}
	};
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

<Modal isOpen={loading} content={SpinnerModal} maskClosable={false} keyboardClosable={false} />
