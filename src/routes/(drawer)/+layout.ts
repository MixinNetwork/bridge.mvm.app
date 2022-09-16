import { browser } from '$app/environment';
import { get } from '@square/svelte-store';
import { providerKey } from '$lib/stores/provider';
import { user } from '$lib/stores/user';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const data = await parent();
	if (!Object.keys(data).length && browser) {
		return {
			user: get(user),
			provider: get(providerKey)
		};
	}
	return data;
};
