import type { DepositEntryResponse } from '@mixin.dev/mixin-node-sdk';
import { BTC_ASSET_ID } from '../constants/common';
import type { Asset } from '../types/asset';
import {
	EOS_ASSET_ID,
	ETH_ASSET_ID,
	TRX_ASSET_ID,
	MOB_ASSET_ID,
	BNB_1_ASSET_ID,
	BNB_2_ASSET_ID,
	MATIC_ASSET_ID
} from '$lib/constants/common';

export const getChainLabel = (assetId: string, chainId: string) => {
	return assetId !== ETH_ASSET_ID && chainId === ETH_ASSET_ID
		? 'ERC20'
		: assetId !== TRX_ASSET_ID && chainId === TRX_ASSET_ID
		? Number.isFinite(Number.parseInt(assetId))
			? 'TRC10'
			: 'TRC20'
		: assetId !== EOS_ASSET_ID && chainId === EOS_ASSET_ID
		? 'EOS'
		: assetId !== MOB_ASSET_ID && chainId === MOB_ASSET_ID
		? 'MOB'
		: assetId !== BNB_1_ASSET_ID && chainId === BNB_1_ASSET_ID
		? 'BEP10'
		: assetId !== BNB_2_ASSET_ID && chainId === BNB_2_ASSET_ID
		? 'BEP20'
		: assetId !== MATIC_ASSET_ID && chainId === MATIC_ASSET_ID
		? 'POLYGON'
		: undefined;
};

export const toHex = (num: string | number) => {
	const val = Number(num);
	return '0x' + val.toString(16);
};

export const filterNumericInputEvent = (e: Event, oldValue: string | undefined) => {
	if (!e) return;
	if (!e.target) return;
	if (!('value' in e.target)) return;
	if (typeof e.target.value !== 'string') return;

	if (e.target.value?.match(/^(\d*\.?\d*)?$/)?.[0] === undefined) {
		e.target.value = oldValue ?? '';
	}
};

export const searchAssets = (keyword: string, assets: Asset[]) => {
	const lowerCaseKeyword = keyword.trim().toLowerCase();
	return assets.filter((asset) => {
		if (!lowerCaseKeyword) return true;
		return (
			asset.name.toLowerCase().includes(lowerCaseKeyword) ||
			asset.symbol.toLowerCase().includes(lowerCaseKeyword) ||
			asset.contract?.toLowerCase() === lowerCaseKeyword
		);
	});
};

export const getAsset = (assetId: string | null, assets: Asset[]) => {
	if (!assetId) return;
	return assets.find((a) => a.asset_id === assetId);
};

export const getDepositEntry = (
	assetId: string,
	depositEntries: DepositEntryResponse[] | undefined
) => {
	return assetId === BTC_ASSET_ID
		? depositEntries?.filter(({ properties }) => properties?.includes('P2WPKH_V0'))?.[0]
		: depositEntries?.[0];
};
