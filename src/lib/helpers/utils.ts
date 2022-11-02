import {
	BTC_ASSET_ID,
	DOGE_ASSET_ID,
	EOS_ASSET_ID,
	ETH_ASSET_ID,
	MOB_ASSET_ID,
	TRX_ASSET_ID
} from '../constants/common';
import type { Asset } from '../types/asset';

export const toHex = (num: string | number) => {
	const val = Number(num);
	return '0x' + val.toString(16);
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

export const explorerTransaction = (chainId: string, txId: string) => {
	if (chainId === TRX_ASSET_ID) return `https://tronscan.org/#/transaction/${txId}`;
	if (chainId === ETH_ASSET_ID) return `https://etherscan.io/tx/${txId}`;
	if (chainId === BTC_ASSET_ID) return `https://www.blockchain.com/btc/tx/${txId}`;
	if (chainId === EOS_ASSET_ID) return `https://bloks.io/transaction/${txId}`;
	if (chainId === MOB_ASSET_ID) return `https://block-explorer.mobilecoin.foundation/`;
	if (chainId === DOGE_ASSET_ID) return `https://dogechain.info/tx/${txId}`;
};
