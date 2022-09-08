import { derived } from '@square/svelte-store';
import { ETH_ASSET_ID } from '../../constants/common';
import { searchParamStore } from '../../helpers/app-store';
import { assets } from '../../stores/model';

export type Mode = 'deposit' | 'withdraw';
export const MODE_KEY = 'mode';
export const DEPOSIT_MODE_KEY = 'deposit-mode';
export type DepositMode = 'qrcode' | 'metamask';
export const ASSET_KEY = 'asset';

const selectedAssetId = searchParamStore(ASSET_KEY);

export const selectedAsset = derived([selectedAssetId, assets], ([$selectedAssetId, $assets]) =>
	$assets.find((a) => a.asset_id === $selectedAssetId)
);

export const mode = derived(searchParamStore(MODE_KEY), ($mode) => {
	return ($mode === 'withdraw' ? 'withdraw' : 'deposit') as Mode;
});

export const defaultDepositMode = derived([mode, selectedAsset], ([$mode, $selectedAsset]) => {
	if ($mode === 'withdraw') return;
	if (!$selectedAsset) return;
	return $selectedAsset.chain_id === ETH_ASSET_ID ? 'metamask' : 'qrcode';
});
