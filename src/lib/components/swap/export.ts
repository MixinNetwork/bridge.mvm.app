import { derived } from '@square/svelte-store';
import { ETH_ASSET_ID, XIN_ASSET_ID } from '../../constants/common';
import { searchParamStore } from '../../helpers/app-store';
import { assets } from '../../stores/model';

export const INPUT_KEY = 'input';
export const OUTPUT_KEY = 'output';
export const SLIPPAGE_KEY = 'slippage';

export const DEFAULT_INPUT_KEY = ETH_ASSET_ID;
export const DEFAULT_OUTPUT_KEY = XIN_ASSET_ID;
export const DEFAULT_SLIPPAGE = 0.99;

export const inputAssetId = searchParamStore(INPUT_KEY);
export const outputAssetId = searchParamStore(OUTPUT_KEY);
export const inputAsset = derived([inputAssetId, assets], ([$assetId, $assets]) =>
	$assets.find((a) => a.asset_id === ($assetId || DEFAULT_INPUT_KEY))
);
export const outputAsset = derived([outputAssetId, assets], ([$assetId, $assets]) =>
	$assets.find((a) => a.asset_id === ($assetId || DEFAULT_OUTPUT_KEY))
);
export const slippage = derived(searchParamStore(SLIPPAGE_KEY), ($value) => {
	const nubmer = Number($value);
	return nubmer && !isNaN(nubmer) ? nubmer : DEFAULT_SLIPPAGE;
});
