import { fetchTransactions } from '$lib/helpers/mvm/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { user } = await parent();

	const transactions = await fetchTransactions(user);
	return { transactions };
};
