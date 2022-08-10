import type { Provider, ProviderKey } from './type';
import { cachedProvider, setCachedProvider } from '../stores/cached-provider';

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
			const cache = cachedProvider.get();
			if (!cache) return;
			return (await createWeb3Client(cache)).connect();
		},
		connect: async () => {
			const p = await connect();
			setCachedProvider(provider);
			return p as Provider;
		}
	};
};
