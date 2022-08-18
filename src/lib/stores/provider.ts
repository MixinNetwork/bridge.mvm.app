import { session } from '$app/stores';
import { derived, get } from '@square/svelte-store';
import { PROVIDER_KEY } from '../../hooks';
import { persistentWritable } from '../helpers/store/persistent';
import type { ProviderKey } from '../helpers/web3client/type';

const persistentProviderKey = persistentWritable<ProviderKey | undefined>(PROVIDER_KEY, undefined);

export const providerKey = derived(
	persistentProviderKey,
	($providerKey) => $providerKey || get(session).provider
);

export const setProviderKey = (provider: ProviderKey) => persistentProviderKey.set(provider);
export const clearLastProvider = () => persistentProviderKey.set(undefined);
