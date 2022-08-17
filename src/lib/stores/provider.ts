import { PROVIDER_KEY } from '../../hooks';
import { persistentWritable } from '../helpers/store/persistent';
import type { ProviderKey } from '../helpers/web3client/type';

export const providerKey = persistentWritable<ProviderKey | undefined>(PROVIDER_KEY, undefined);

export const clearLastProvider = () => providerKey.set(undefined);
