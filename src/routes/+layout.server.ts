import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { LayoutServerLoad } from './$types';

export const trailingSlash = 'always';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, provider, providerLogo, lang } = locals;
	await loadLocaleAsync(lang);
	if (user && provider) return { user, provider, providerLogo, lang };
	return { lang };
};
