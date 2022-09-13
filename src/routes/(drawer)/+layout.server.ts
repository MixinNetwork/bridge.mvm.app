import { redirect } from '@sveltejs/kit';
import { LAST_URL, PROVIDER_KEY, USER_KEY } from '$lib/constants/common';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
	const { user, provider } = locals;
	if (user && provider) return;
	cookies.delete(USER_KEY);
	cookies.delete(PROVIDER_KEY);
	return redirect(302, `/connect?${LAST_URL}=${url.href.replace(url.origin, '')}`);
};
