import { fetchTransactions } from '$lib/helpers/mvm/api';
import { get } from '@square/svelte-store';
import { assets } from '$lib/stores/model';
import type { PageLoad } from './$types';
import { fetchAssets } from '$lib/helpers/api';
import { user as userStore } from '../../../lib/stores/user';
import { browser } from '$app/environment';

export const load: PageLoad = async (foo) => {
	const { user } = await foo.parent();

	const $user = user || (browser && get(userStore)) || undefined;

	const cacheAssets = get(assets);

	const [a, t] = await Promise.all([
		(cacheAssets.length && cacheAssets) || fetchAssets($user),
		$user?.address ? fetchTransactions({ address: $user?.address }) : []
	]);

	return { assets: a, transactions: t };
};
