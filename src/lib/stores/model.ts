import {
	AssetClient,
	type AssetResponse,
	type ExchangeRateResponse
} from '@mixin.dev/mixin-node-sdk';
import { asyncDerived, derived, get } from '@square/svelte-store';
import type { Pair } from '../helpers/4swap/api';
import { bigAdd, bigMul } from '../helpers/big';
import type { Transaction } from '../helpers/mvm/api';
import { deepWritable } from '../helpers/store/deep';
import type { Asset } from '../types/asset';
import type { Network } from '../types/network';
import { getAssetBalance } from '../helpers/web3/common';
import { user } from './user';

export const assets = deepWritable<Asset[]>([], (set) => {
	const timer = setInterval(async () => {
		const { user } = await import('./user');
		const $user = get(user);
		if (!$user) return;
		const { fetchAssets } = await import('../helpers/api');
		const assets = await fetchAssets($user);
		set(assets);
	}, 5000);

	return () => {
		clearInterval(timer);
	};
});

export const logging = deepWritable<boolean>(false);

export const userDestinations = (() => {
	const destinations = deepWritable<Pick<AssetResponse, 'asset_id' | 'deposit_entries'>[]>([]);

	const findDestination = (assetId: string) => {
		const $destinations = get(destinations);
		const destination = $destinations.find(({ asset_id }) => asset_id === assetId);
		return destination;
	};
	return {
		subscribe: destinations.subscribe,
		fetchDestination: async (assetId: string) => {
			const { user } = await import('./user');
			const $user = get(user);
			if (!$user) throw new Error('User not found');

			const assetClient = AssetClient({
				keystore: { ...$user, ...$user.key },
				requestConfig: { timeout: 1000 * 60 }
			});

			const $destinations = get(destinations);
			if (!$destinations.length) {
				const list = await assetClient.fetchList();
				destinations.set(list);
			}

			let destination = findDestination(assetId);
			if (destination) return destination.deposit_entries;

			const asset = await assetClient.fetch(assetId);
			destinations.update((list) => [...list, asset]);

			destination = findDestination(assetId);

			if (!destination) throw new Error('Destination not found');

			return destination.deposit_entries;
		}
	};
})();

export const updateAssets = async () => {
	const { user } = await import('./user');
	const $user = get(user);
	if (!$user) return;
	const { fetchAssets } = await import('../helpers/api');
	const $assets = await fetchAssets($user);
	assets.set($assets);
};

export const pairs = deepWritable<Pair[]>([], (set) => {
	const timer = setInterval(async () => {
		const { fetchPairs } = await import('../helpers/4swap/api');
		const pairs = await fetchPairs();
		set(pairs);
	}, 15000);
	return () => {
		clearInterval(timer);
	};
});

export const exchangeRates = deepWritable<ExchangeRateResponse[]>([]);

export const totalBalanceUsd = derived(assets, ($assets) => {
	if (!$assets.length) return;
	return $assets.reduce((total, asset) => {
		if (!asset.balance) return total;
		return bigAdd(total, bigMul(asset.balance, asset.price_usd));
	}, '0');
});

export const totalBalanceBtc = derived(assets, ($assets) => {
	if (!$assets.length) return;
	return $assets.reduce((total, asset) => {
		if (!asset.balance) return total;
		return bigAdd(total, bigMul(asset.balance, asset.price_btc));
	}, '0');
});

export const transactions = deepWritable<Transaction[] | undefined>(undefined);

export const buildBalanceStore = ({ assetId, network }: { assetId: string; network: Network }) => {
	const asset = derived(assets, ($assets) => $assets.find((a) => a.asset_id === assetId));
	return asyncDerived([asset, user], async ([$asset, $user]) => {
		if (!$user) return '0';
		if (!$asset) return '0';
		return getAssetBalance($asset, $user.address, network);
	});
};
