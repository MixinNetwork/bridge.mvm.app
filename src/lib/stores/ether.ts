import { ethers } from 'ethers';
import { derived, get } from '@square/svelte-store';
import { deepWritable } from '../helpers/store/deep';
import { clearLastProvider } from './provider';

interface EtherStore {
	library?: ethers.providers.Web3Provider;
	provider?: ethers.providers.Web3Provider;
	chainId?: number;
	account?: `0x${string}`;
	// network?: string;
}

const store = deepWritable<EtherStore>({});

export const setProvider = async (
	provider: (ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) &
		ethers.providers.Web3Provider
) => {
	const library: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(provider, 'any');
	const accounts = (await library.listAccounts()) as `0x${string}`[];
	const network = await library.getNetwork();

	const handleChainChanged = (chainId: number) => {
		store.set({
			...get(store),
			chainId: chainId
		});
	};

	const handleDisconnect = () => {
		clearLastProvider();
		store.set({});
	};

	const handleAccountsChanged = (accounts: `0x${string}`[] | undefined) => {
		if (!accounts || !accounts.length) {
			handleDisconnect();
			return;
		}
		store.set({
			...get(store),
			account: accounts[0]
		});
	};

	get(store).provider?.removeAllListeners();

	store.set({
		provider,
		library,
		account: accounts[0],
		chainId: network.chainId
	});

	provider.on('accountsChanged', handleAccountsChanged);
	provider.on('chainChanged', handleChainChanged);
};

export const provider = derived(store, ($store) => $store.provider);
export const library = derived(store, ($store) => $store.library);
export const chainId = derived(store, ($store) => $store.chainId);
export const account = derived(store, ($store) => $store.account);
