import { persistentWritable } from '../helpers/store/persistent';
import type { ProviderKey } from '../helpers/web3client/type';

export const cachedProvider = persistentWritable<ProviderKey | undefined>(
	'CACHED_PROVIDER',
	undefined
);

export const setCachedProvider = cachedProvider.set;
export const clearCachedProvider = () => cachedProvider.set(undefined);
