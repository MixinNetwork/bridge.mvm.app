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
	}, 15000);
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

export const getAsset = (assetId: string | null, assets: Asset[]) => {
	if (!assetId) return;
	return assets.find((a) => a.asset_id === assetId);
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
		asyncReadable(
			undefined,
			async () => {
				const { asset_id, chain_id, destination, tag } = parameters;
				const fee = await fetchWithdrawalFee(asset_id, destination, tag);

				if (!fee || Number(fee) === 0 || asset_id === chain_id) return fee;

				return await fetchFeeOnAsset(asset_id, chain_id, fee);
			},
			false
		)
);

export const buildBalanceStore = ({ assetId, network }: { assetId: string; network: Network }) => {
	return asyncDerived([assets, user], async ([$assets, $user]) => {
		if (!$user) return undefined;

		return getAssetBalance($assets, assetId, $user.address, network);
	});
};
