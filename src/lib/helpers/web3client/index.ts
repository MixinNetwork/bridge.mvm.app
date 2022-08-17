import type { Provider, ProviderKey } from './type';
import { providerKey } from '../../stores/provider';
import { get } from '@square/svelte-store';

export const createWeb3Client = async (provider: ProviderKey = 'injected') => {
	let connect: () => Promise<unknown> | unknown;
	switch (provider) {
		case 'walletconnect':
			connect = (await import('./wallet-connect')).default;
			break;
		default:
			connect = (await import('./injected')).default;
	}

	return {
		cacheConnect: async () => {
			const cache = get(providerKey);
			if (!cache) return;
			return (await createWeb3Client(cache)).connect();
		},
		connect: async () => {
			const p = await connect();
			providerKey.set(provider);
			return p as Provider;
		}
	};
};
