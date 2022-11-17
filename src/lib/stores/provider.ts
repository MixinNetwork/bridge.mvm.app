import { derived, get } from '@square/svelte-store';
import { persistentWritable } from '../helpers/store/persistent';
import type { ProviderKey } from '../helpers/web3client/type';
import { PROVIDER_KEY, PROVIDER_LOGO } from '$lib/constants/common';
import { page } from '$app/stores';
import { dedupe } from '../helpers/store/dedupe';
import { disconnectWallet } from '../helpers/web3client';
import { browser } from '$app/environment';

export const persistentProviderKey = persistentWritable<ProviderKey | undefined>(
	PROVIDER_KEY,
	undefined
);
export const persistentProviderLogo = persistentWritable<string | undefined>(
	PROVIDER_LOGO,
	undefined,
	{
		encode: (value) => value as string,
		decode: (value) => value,
		store: 'localstorage'
	}
);

export const providerKey = dedupe<ProviderKey | undefined>(
	derived(
		[persistentProviderKey, page],
		([$providerKey, $page]) =>
			(browser && $providerKey) || (!browser && $page.data?.provider) || undefined
	)
);

export const setProviderKey = (provider: ProviderKey) => persistentProviderKey.set(provider);
export const setProviderLogo = (logo: string) => persistentProviderLogo.set(logo);

export const clearLastProvider = async () => {
	persistentProviderKey.set(undefined);
	persistentProviderLogo.set(undefined);

	const $persistentProviderKey = get(persistentProviderKey);
	$persistentProviderKey && (await disconnectWallet($persistentProviderKey));
};

export const providerName = providerKey;
export const providerLogo = dedupe(
	derived(
		[persistentProviderLogo, page],
		([$providerLogo, $page]) =>
			(browser && $providerLogo) || (!browser && $page.data?.providerLogo) || undefined
	)
);
