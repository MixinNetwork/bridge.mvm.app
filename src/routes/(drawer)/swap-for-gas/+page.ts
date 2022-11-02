import { get } from '@square/svelte-store';
import { assets } from '$lib/stores/model';
import type { PageLoad } from './$types';
import { NetworkClient } from '@mixin.dev/mixin-node-sdk';
import { ETH_ASSET_ID } from '$lib/constants/common';

export const load: PageLoad = async () => {
	const cacheAssets = get(assets);

	const networkClient = NetworkClient();

	const eth =
		cacheAssets.find((asset) => asset.symbol === 'ETH') ||
		(await networkClient.fetchAsset(ETH_ASSET_ID));

	return { price: eth.price_usd, iconUrl: eth.icon_url };
};
