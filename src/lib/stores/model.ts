import {
	AssetClient,
	type AssetResponse,
	type ExchangeRateResponse
} from '@mixin.dev/mixin-node-sdk';
import { asyncDerived, asyncReadable, derived, get } from '@square/svelte-store';
import { fetchPairs, type Pair } from '../helpers/4swap/api';
import { fetchAssets, fetchFeeOnAsset, fetchWithdrawalFee } from '../helpers/api';
import { bigAdd, bigMul } from '../helpers/big';
import { deepWritable } from '../helpers/store/deep';
import { mapTemplate } from '../helpers/store/map-template';
import { getAssetBalance } from '../helpers/web3/common';
import type { Asset } from '../types/asset';
import type { Network } from '../types/network';
import { user } from './user';

export const assets = deepWritable<Asset[]>([], (set) => {
	const timer = setInterval(async () => {
		const $user = get(user);
		if (!$user) return;
		const assets = await fetchAssets($user);
		set(assets);
	}, 5000);
	return () => {
		clearInterval(timer);
	};
});

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
			const $user = get(user);
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
	const $user = get(user);
	if (!$user) return;
	const $assets = await fetchAssets($user);
	assets.set($assets);
};

export const pairs = deepWritable<Pair[]>([], (set) => {
	const timer = setInterval(async () => {
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

export const AssetWithdrawalFee = mapTemplate(
	(parameters: { asset_id: string; chain_id: string; destination: string; tag: string }) =>
		asyncReadable(undefined, async () => {
			const { asset_id, chain_id, destination, tag } = parameters;
			const fee = await fetchWithdrawalFee(asset_id, destination, tag);

			if (!fee || Number(fee) === 0 || asset_id === chain_id) return fee;

			return await fetchFeeOnAsset(asset_id, chain_id, fee);
		})
);

export const buildBalanceStore = ({ assetId, network }: { assetId: string; network: Network }) => {
	return asyncDerived([assets, user], async ([$assets, $user]) => {
		if (!$user) return '0';
		return getAssetBalance($assets, assetId, $user.address, network);
	});
};
