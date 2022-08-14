import { derived } from '@square/svelte-store';
import { bigAdd, bigMul } from '../helpers/big';
import { deepWritable } from '../helpers/store/deep';
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
