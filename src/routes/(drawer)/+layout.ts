import { get } from '@square/svelte-store';
import { providerKey } from '$lib/stores/provider';
import { lang, user } from '$lib/stores/user';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const data = await parent();

	return {
		user: data.user || get(user),
		provider: data.provider || get(providerKey),
		lang: data.lang || get(lang)
	};
};
