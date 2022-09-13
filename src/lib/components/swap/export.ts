import { page } from '$app/stores';
import { get } from '@square/svelte-store';
import { ETH_ASSET_ID, XIN_ASSET_ID } from '../../constants/common';
import { deepWritable } from '../../helpers/store/deep';
import { assets } from '../../stores/model';
import type { Asset } from '../../types/asset';

export const INPUT_KEY = 'input';
export const OUTPUT_KEY = 'output';
export const SLIPPAGE_KEY = 'slippage';

export const DEFAULT_INPUT_KEY = ETH_ASSET_ID;
export const DEFAULT_OUTPUT_KEY = XIN_ASSET_ID;
export const DEFAULT_SLIPPAGE = 0.99;

export const getAsset = (key: string, defaultKey?: string) => {
	const $page = get(page);
	const $assets = get(assets);
	const assetId = $page.url.searchParams.get(key);
	const asset = $assets.find((a) => a.asset_id === (assetId || defaultKey));
	return asset;
};

export const inputAsset = deepWritable<Asset | undefined>(undefined);
export const outputAsset = deepWritable<Asset | undefined>(undefined);
export const slippage = deepWritable<number>(DEFAULT_SLIPPAGE);
