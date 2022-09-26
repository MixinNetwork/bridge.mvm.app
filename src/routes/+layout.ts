import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { lang } from '$lib/stores/user';
import { get } from '@square/svelte-store';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	await loadLocaleAsync(get(lang) || data.lang);

	return data;
};
