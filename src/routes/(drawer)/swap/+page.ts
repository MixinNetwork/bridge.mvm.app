import { get } from '@square/svelte-store';
import { fetchPairs } from '$lib/helpers/4swap/api';
import { fetchAssets } from '$lib/helpers/api';
import { fetchMixPayPaymentAssets, fetchMixPaySettlementAssets } from '$lib/helpers/mixpay/api';
import { assets, pairs } from '$lib/stores/model';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	const cacheAssets = get(assets);
	const cachePairs = get(pairs);
	const [a, p, paymentAssets, settlementAssets] = await Promise.all([
		(cacheAssets.length && cacheAssets) || fetchAssets(user),
		(cachePairs.data.length && cachePairs) || fetchPairs(),
		fetchMixPayPaymentAssets(),
		fetchMixPaySettlementAssets()
	]);

	return { assets: a, pairs: p, paymentAssets, settlementAssets };
};
