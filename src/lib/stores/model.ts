import type { ExchangeRateResponse } from '@mixin.dev/mixin-node-sdk';
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

export const updateAssets = async () => {
	const $user = get(user);
	if (!$user) return;
	const $assets = await fetchAssets($user);
	assets.set($assets);
};

export const pairs = deepWritable<{
	data: Pair[];
	loading: boolean;
}>({
	data: [],
	loading: false
}, () => {
	const timer = setInterval(async () => {
		await updatePairs()
	}, 15000);
	return () => {
		clearInterval(timer);
	};
});

const updatePairs = async () => {
	const $pair = get(pairs);

	pairs.set({
		data: $pair.data,
		loading: true
	})
	const data = await fetchPairs();
	pairs.set({
		data,
		loading: false
	})
}

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
