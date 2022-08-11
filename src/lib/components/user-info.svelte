<script lang="ts">
	import type { ProviderKey } from '../helpers/web3client/type';
	import clsx from 'clsx';

	import { cachedProvider } from '../stores/cached-provider';
	import { shortAddress } from '../stores/user';

	import Arrow from '$lib/assets/arrow.svg?component';

	let clazz: string | undefined = undefined;
	export { clazz as class };

	const importProviderLogo = async (provider?: ProviderKey) => {
		if (!provider) return;
		switch (provider) {
			case 'injected':
				return (await import('$lib/assets/logo/metamask.svg')).default;
			case 'walletconnect':
				return (await import('$lib/assets/logo/wallet-connect.svg')).default;
		}
	};

	let providerLogo: string | undefined;

	$: importProviderLogo($cachedProvider).then((logo) => (providerLogo = logo));
</script>

<div
	class={clsx(
		'flex items-center space-x-3 md:py-2 md:px-4 md:rounded-full md:bg-white w-fit opacity-0 transition',
		clazz,
		{
			'opacity-100': $shortAddress
		}
	)}
>
	<div class="w-14 md:w-4">
		{#if !!providerLogo}
			<img src={providerLogo} alt={$cachedProvider} />
		{/if}
	</div>
	<div class="font-bold md:text-sm md:font-semibold">
		<div class="text-xl md:hidden">999999</div>
		<div class="inline-flex">
			<span class="sm:hidden md:block">Account&nbsp;</span>
			<span class="text-sm opacity-30 md:opacity-100">{$shortAddress}</span>
		</div>
	</div>
	<Arrow class="rotate-90 sm:hidden md:block" />
</div>
