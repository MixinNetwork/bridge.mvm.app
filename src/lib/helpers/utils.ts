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

export const getTime = () => {
	const t = new Date();
	const h = t.getHours();
	const m = t.getMinutes();
	const s = t.getSeconds();
	return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
};
