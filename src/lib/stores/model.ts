import { asyncReadable, derived } from '@square/svelte-store';
import { fetchFeeOnAsset, fetchWithdrawalFee } from '../helpers/api';
import { bigAdd, bigMul } from '../helpers/big';
import { deepWritable } from '../helpers/store/deep';
import { mapTemplate } from '../helpers/store/map-template';
import type { Asset } from '../types/asset';

export const assets = deepWritable<Asset[]>([]);

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

export const AssetWithdrawalFee = mapTemplate((stringParameters: string) =>
	asyncReadable(undefined, async () => {
		const [ asset_id, chain_id, destination ] = stringParameters.split('&&');
		const fee = await fetchWithdrawalFee(asset_id, destination);

		if (
			!fee
			|| Number(fee) === 0
			|| asset_id === chain_id
		) return fee;

		return await fetchFeeOnAsset(asset_id, chain_id, fee);
	}, false)
);
