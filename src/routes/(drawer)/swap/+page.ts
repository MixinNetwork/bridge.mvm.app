import { get } from '@square/svelte-store';
import { fetchAssets } from '$lib/helpers/api';
import { assets } from '$lib/stores/model';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	const cacheAssets = get(assets);
	const a = (cacheAssets.length && cacheAssets) || (await fetchAssets(user));

	return { assets: a };
};
