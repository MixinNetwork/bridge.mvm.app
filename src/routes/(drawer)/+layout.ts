import { get } from '@square/svelte-store';
import { providerKey } from '$lib/stores/provider';
import { lang, user } from '$lib/stores/user';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ parent, data }) => {
	const parentData = await parent();

	return {
		user: parentData.user || (browser && get(user)) || undefined,
		provider: parentData.provider || (browser && get(providerKey)) || undefined,
		lang: parentData.lang || (browser && get(lang)) || undefined,
		assets: data.assets
	};
};
