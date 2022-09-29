import { get } from '@square/svelte-store';
import { fetchPairs } from '$lib/helpers/4swap/api';
import { fetchAssets } from '$lib/helpers/api';
import { assets, pairs } from '$lib/stores/model';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	const cacheAssets = get(assets);
	const cachePairs = get(pairs);
	const [a, p] = await Promise.all([
		(cacheAssets.length && cacheAssets) || fetchAssets(user),
		(cachePairs.length && cachePairs) || fetchPairs()
	]);

	return { assets: a, pairs: p };
};
