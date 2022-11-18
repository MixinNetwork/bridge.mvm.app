import { PROVIDER_KEY, USER_KEY } from '$lib/constants/common';
import { fetchAssets } from '$lib/helpers/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const { user, provider } = locals;
	if (!user || !provider) {
		cookies.delete(USER_KEY);
		cookies.delete(PROVIDER_KEY);
	}

	return { assets: await fetchAssets(user) };
};
