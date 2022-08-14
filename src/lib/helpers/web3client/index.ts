import type { Provider, ProviderKey } from './type';
import { provider, setLastProvider } from '../../stores/provider';
import { get } from '@square/svelte-store';

export const createWeb3Client = async (providerKey: ProviderKey = 'injected') => {
	let connect: () => Promise<unknown> | unknown;
	switch (providerKey) {
		case 'walletconnect':
			connect = (await import('./wallet-connect')).default;
			break;
		default:
			connect = (await import('./injected')).default;
	}

	return {
		cacheConnect: async () => {
			const cache = get(provider);
			if (!cache) return;
			return (await createWeb3Client(cache)).connect();
		},
		connect: async () => {
			const p = await connect();
			setLastProvider(providerKey);
			return p as Provider;
		}
	};
};
