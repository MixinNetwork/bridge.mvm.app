import { derived } from '@square/svelte-store';
import { persistentWritable } from '../helpers/store/persistent';
import type { ProviderKey } from '../helpers/web3client/type';
import metaMask from '$lib/assets/logo/metamask.svg';
import walletConnect from '$lib/assets/logo/wallet-connect.svg';
import { PROVIDER_KEY } from '$lib/constants/common';
import { page } from '$app/stores';

const persistentProviderKey = persistentWritable<ProviderKey | undefined>(PROVIDER_KEY, undefined);

export const providerKey = derived(
	[persistentProviderKey, page],
	([$providerKey, $page]) => $providerKey || $page.data.provider
);

export const setProviderKey = (provider: ProviderKey) => persistentProviderKey.set(provider);
export const clearLastProvider = () => persistentProviderKey.set(undefined);

export const providerName = derived(providerKey, ($providerKey) => {
	if ($providerKey === 'injected') return 'MetaMask';
	if ($providerKey === 'walletconnect') return 'WalletConnect';

	return undefined;
});

export const providerLogo = derived(providerKey, ($providerKey) => {
	if ($providerKey === 'injected') return metaMask;
	if ($providerKey === 'walletconnect') return walletConnect;

	return '';
});
