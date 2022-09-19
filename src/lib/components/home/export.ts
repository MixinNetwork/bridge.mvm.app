import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from '@square/svelte-store';
import { ETH_ASSET_ID } from '../../constants/common';
import { setSearchParam } from '../../helpers/app-store';
import { deepWritable } from '../../helpers/store/deep';
import { getAsset } from '../../stores/model';
import type { Asset } from '../../types/asset';

const MODE_KEY = 'mode';
const DEPOSIT_MODE_KEY = 'deposit-mode';
const ASSET_KEY = 'asset';

export type Mode = 'deposit' | 'withdraw';
export type DepositMode = 'qrcode' | 'metamask';

export const selectedAsset = deepWritable<Asset | undefined>(undefined);
export const mode = deepWritable<Mode | undefined>(undefined);
export const depositMode = deepWritable<DepositMode | undefined>(undefined);

export const initStore = () => {
	const $page = get(page);

	selectedAsset.set(getAsset($page.url.searchParams.get(ASSET_KEY)));

	const modeString = $page.url.searchParams.get(MODE_KEY);
	mode.set(
		(modeString === 'deposit' && 'deposit') ||
			(modeString === 'withdraw' && 'withdraw') ||
			undefined
	);

	const $selectedAsset = get(selectedAsset);
	const $mode = get(mode);

	if ($mode !== 'deposit') return;

	const depositModeString = $page.url.searchParams.get(DEPOSIT_MODE_KEY);

	const tempDepositMode =
		(depositModeString === 'qrcode' && 'qrcode') ||
		(depositModeString === 'metamask' && 'metamask') ||
		undefined;

	if (tempDepositMode) {
		depositMode.set(tempDepositMode);
		return;
	}

	if ($selectedAsset?.chain_id === ETH_ASSET_ID || $selectedAsset?.asset_id === ETH_ASSET_ID) {
		depositMode.set('metamask');
	} else {
		depositMode.set('qrcode');
	}
};

export const switchDepositMode = (asset: Asset, _depositMode: DepositMode | undefined) => {
	mode.set('deposit');
	selectedAsset.set(asset);
	const isEth = asset?.chain_id === ETH_ASSET_ID || asset?.asset_id === ETH_ASSET_ID;
	if (_depositMode && isEth) depositMode.set(_depositMode);
	else if (isEth) depositMode.set('metamask');
	else depositMode.set('qrcode');

	const $page = get(page);
	setSearchParam($page, ASSET_KEY, asset.asset_id);
	setSearchParam($page, MODE_KEY, 'deposit');
	setSearchParam($page, DEPOSIT_MODE_KEY, get(depositMode));

	goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
};

export const switchWithdrawMode = (asset: Asset) => {
	mode.set('withdraw');
	selectedAsset.set(asset);
	depositMode.set(undefined);

	const $page = get(page);
	setSearchParam($page, ASSET_KEY, asset.asset_id);
	setSearchParam($page, MODE_KEY, 'withdraw');
	setSearchParam($page, DEPOSIT_MODE_KEY, undefined);

	goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
};

export const resetStore = () => {
	mode.set(undefined);
	selectedAsset.set(undefined);
	depositMode.set(undefined);

	const $page = get(page);
	setSearchParam($page, ASSET_KEY, undefined);
	setSearchParam($page, MODE_KEY, undefined);
	setSearchParam($page, DEPOSIT_MODE_KEY, undefined);

	goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
};

export const selectAsset = (asset: Asset) => {
	selectedAsset.set(asset);
	const $page = get(page);
	setSearchParam($page, ASSET_KEY, asset.asset_id);
	goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
};
