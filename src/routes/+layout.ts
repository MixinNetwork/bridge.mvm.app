import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { get } from '@square/svelte-store';
import { locale } from '../i18n/i18n-svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	await loadLocaleAsync(get(locale) || data.lang);

	return data;
};
