import { fetchTransactions } from '$lib/helpers/mvm/api';
import { get } from '@square/svelte-store';
import { assets } from '$lib/stores/model';
import type { PageLoad } from './$types';
import { fetchAssets } from '$lib/helpers/api';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	const cacheAssets = get(assets);

	const [a, t] = await Promise.all([
		(cacheAssets.length && cacheAssets) || fetchAssets(user),
		fetchTransactions({ address: user.address })
	]);

	return { assets: a, transactions: t };
};
