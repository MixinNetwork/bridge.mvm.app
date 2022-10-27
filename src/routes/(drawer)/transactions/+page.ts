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
		fetchTransactions({ address: '0x1AE60D36412a6745fce4d4935FF5Bf2b8139a371' })
	]);

	return { assets: a, transactions: t };
};
