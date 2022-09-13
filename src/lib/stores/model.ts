import type { ExchangeRateResponse } from '@mixin.dev/mixin-node-sdk';
import { asyncReadable, derived, get } from '@square/svelte-store';
import { fetchPairs, type Pair } from '../helpers/4swap/api';
import { fetchFeeOnAsset, fetchWithdrawalFee } from '../helpers/api';
import { bigAdd, bigMul } from '../helpers/big';
import { deepWritable } from '../helpers/store/deep';
import { mapTemplate } from '../helpers/store/map-template';
import type { Asset } from '../types/asset';

export const assets = deepWritable<Asset[]>([]);

export const getAsset = (assetId: string) => {
	const $assets = get(assets);
	return $assets.find((a) => a.asset_id === assetId);
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
	if (!$assets) return;
	return $assets.reduce((total, asset) => {
		if (!asset.balance) return total;
		return bigAdd(total, bigMul(asset.balance, asset.price_usd));
	}, '0');
});

export const totalBalanceBtc = derived(assets, ($assets) => {
	if (!$assets) return;
	return $assets.reduce((total, asset) => {
		if (!asset.balance) return total;
		return bigAdd(total, bigMul(asset.balance, asset.price_btc));
	}, '0');
});

export const AssetWithdrawalFee = mapTemplate(
	(parameters: { asset_id: string; chain_id: string; destination: string }) =>
		asyncReadable(
			undefined,
			async () => {
				const { asset_id, chain_id, destination } = parameters;
				const fee = await fetchWithdrawalFee(asset_id, destination);

				if (!fee || Number(fee) === 0 || asset_id === chain_id) return fee;

				return await fetchFeeOnAsset(asset_id, chain_id, fee);
			},
			false
		)
);
