import { fetchTransactions } from '$lib/helpers/mvm/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	return {
		transactions: await (user?.address ? fetchTransactions({ address: user?.address }) : [])
	};
};
