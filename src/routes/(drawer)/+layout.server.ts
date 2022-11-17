import { PROVIDER_KEY, USER_KEY } from '$lib/constants/common';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const { user, provider } = locals;
	if (user && provider) return;
	cookies.delete(USER_KEY);
	cookies.delete(PROVIDER_KEY);
};
