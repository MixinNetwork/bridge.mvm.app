import { ethers } from 'ethers';
import { derived, get } from '@square/svelte-store';
import { deepWritable } from '../helpers/store/deep';
import { clearLastProvider } from './provider';
import type { EIP1193Provider } from '@web3-onboard/core';
import { isLogged, registerAndSave, user } from './user';
import { assets, logging } from './model';
import { fetchAssets } from '../helpers/api';
import { invalidateAll } from '$app/navigation';
import { browser } from '$app/environment';

interface EtherStore {
	library?: ethers.providers.Web3Provider;
	provider?: EIP1193Provider;
	chainId?: string;
	account?: string;
	// network?: string;
}

const store = deepWritable<EtherStore>({});

export const connectWallet = async () => {
	if (!browser) return;
	try {
		logging.set(true);
		const { connectWallet } = await import('../helpers/web3client');
		const provider = await connectWallet();
		await setProvider(provider);
		const $account = get(account);
		if (!$account) throw new Error('No account found');
		await registerAndSave($account);
		assets.set(await fetchAssets(get(user)));
		await invalidateAll();
	} finally {
		logging.set(false);
	}
};

export const needConnectWallet = (fn: () => unknown) => {
	return async () => {
		const $isLogged = get(isLogged);
		if (!$isLogged) await connectWallet();
		fn();
	};
};

export const setProvider = async (provider: EIP1193Provider) => {
	const library: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(provider, 'any');
	const accounts = (await library.listAccounts()) as string[];
	const network = await library.getNetwork();

	const handleChainChanged = (chainId: string) => {
		store.set({
			...get(store),
			chainId: chainId
		});
	};

	const handleDisconnect = () => {
		clearLastProvider();
		store.set({});
	};

	const handleAccountsChanged = (accounts: string[]) => {
		if (!accounts || !accounts.length) {
			handleDisconnect();
			return;
		}
		store.set({
			...get(store),
			account: accounts[0]
		});
	};

	get(store).provider?.disconnect?.();

	store.set({
		provider,
		library,
		account: accounts[0],
		chainId: `${network.chainId}`
	});

	provider.on('accountsChanged', handleAccountsChanged);
	provider.on('chainChanged', handleChainChanged);
};

export const provider = derived(store, ($store) => $store.provider);
export const library = derived(store, ($store) => $store.library);
export const chainId = derived(store, ($store) => $store.chainId);
export const account = derived(store, ($store) => $store.account);
