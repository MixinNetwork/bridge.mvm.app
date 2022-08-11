import type { AssetResponse } from '@mixin.dev/mixin-node-sdk';
import { asyncDerived, derived } from '@square/svelte-store';
import { ETH_ASSET_ID, WHITELIST } from '../constants/common';
import { bigAdd, bigMul } from '../helpers/big';
import { asyncDerivedStores } from '../helpers/store/async-derived-stores';
import { mapTemplate } from '../helpers/store/map-template';
import { getBalance, getERC20Balance } from '../helpers/web3/common';
import { fetchAssetContract } from '../helpers/web3/registry';
import { assetClient } from './client';
import { account } from './ether';

export const asset = mapTemplate((key) =>
	asyncDerived(assetClient, async ($assetClient) => {
		if (!$assetClient) return;
		return $assetClient.fetch(key);
	})
);

export const assetContract = mapTemplate((key) =>
	asyncDerived([], async () => {
		if (key === ETH_ASSET_ID) return;
		return fetchAssetContract(key);
	})
);

export const whiteAssets = asyncDerivedStores(
	assetClient,
	($assetClient) => {
		if (!$assetClient) return;
		return WHITELIST.map((assetId) => asset(assetId));
	},
	(values) => values.filter((asset) => asset !== undefined) as AssetResponse[]
);

type AssetWithContract = AssetResponse & {
	contract?: string;
};
export const whiteAssetWithContract = asyncDerived(whiteAssets, async ($whiteAssets) => {
	if (!$whiteAssets) return;
	const promises = $whiteAssets.map(async (asset): Promise<AssetWithContract> => {
		if (asset.asset_id === ETH_ASSET_ID) return asset;
		const contract = await fetchAssetContract(asset.asset_id);
		return Object.assign(asset, { contract });
	});
	return await Promise.all(promises);
});

type AssetWithBalance = AssetWithContract & {
	balance: string;
};

export const whiteAssetBalances = asyncDerived(
	[whiteAssetWithContract, account],
	async ([$whiteAssetWithContract, $account]) => {
		if (!$whiteAssetWithContract || !$account) return;
		const promises = $whiteAssetWithContract.map(async (asset): Promise<AssetWithBalance> => {
			if (asset.asset_id === ETH_ASSET_ID) {
				return Object.assign(asset, {
					balance: await getBalance({
						account: $account,
						network: 'mvm'
					})
				});
			} else {
				return Object.assign(asset, {
					balance: asset.contract
						? await getERC20Balance({
								account: $account,
								contractAddress: asset.contract,
								network: 'mvm'
						  })
						: undefined
				});
			}
		});
		return await Promise.all(promises);
	}
);

export const totalBalanceUsd = derived(whiteAssetBalances, ($whiteAssetBalances) => {
	if (!$whiteAssetBalances) return;
	return $whiteAssetBalances.reduce((total, asset) => {
		if (!asset.balance) return total;
		return bigAdd(total, bigMul(asset.balance, asset.price_usd));
	}, '0');
});

export const totalBalanceBtc = derived(whiteAssetBalances, ($whiteAssetBalances) => {
	if (!$whiteAssetBalances) return;
	return $whiteAssetBalances.reduce((total, asset) => {
		if (!asset.balance) return total;
		return bigAdd(total, bigMul(asset.balance, asset.price_btc));
	}, '0');
});
