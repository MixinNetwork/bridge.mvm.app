import { persistentAtom } from '@nanostores/persistent';
import type { ProviderKey } from '../web3/type';

export const cachedProvider = persistentAtom<ProviderKey | undefined>('CACHED_PROVIDER', undefined);

export const setCachedProvider = cachedProvider.set;
export const clearCachedProvider = () => cachedProvider.set(undefined);
