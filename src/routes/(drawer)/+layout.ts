import { get } from '@square/svelte-store';
import { providerKey } from '$lib/stores/provider';
import { lang, user } from '$lib/stores/user';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ parent }) => {
	const data = await parent();

	const rsp = {
		user: data.user || (browser && get(user)) || undefined,
		provider: data.provider || (browser && get(providerKey)) || undefined,
		lang: data.lang || (browser && get(lang)) || undefined
	};

	return rsp;
};
