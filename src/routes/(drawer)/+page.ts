import { get } from '@square/svelte-store';
import { dependAssets } from '$lib/helpers/api';
import { assets } from '$lib/stores/model';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const cache = get(assets);
	const a = (cache.length && cache) || (await dependAssets(fetch));
	return { assets: a };
};
