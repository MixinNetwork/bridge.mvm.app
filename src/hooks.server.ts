import type { Handle, RequestEvent } from '@sveltejs/kit';
import * as cookie from 'cookie';
import type { User } from '$lib/types/user';
import { LANG, PROVIDER_KEY, PROVIDER_LOGO, USER_KEY } from '$lib/constants/common';
import type { ProviderKey } from '$lib/helpers/web3client/type';
import { detectLocale, initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import { baseLocale, isLocale, locales } from '$i18n/i18n-util';
import type { Locales } from '$i18n/i18n-types';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	let lang = baseLocale;

	try {
		const userRaw = cookies[USER_KEY];
		const provider = cookies[PROVIDER_KEY] as ProviderKey | undefined;
		const providerLogo = cookies[PROVIDER_LOGO] as string | undefined;
		if (userRaw && provider) {
			const user: User = JSON.parse(userRaw);

			event.locals.user = user;
			event.locals.provider = provider;
			event.locals.providerLogo = providerLogo;
		}

		const tempLang = (isLocale(cookies[LANG]) && (cookies[LANG] as Locales)) || undefined;

		lang = tempLang || getPreferredLocale(event);
		event.locals.lang = lang;

		if (!tempLang) event.cookies.set(LANG, lang);
	} catch (e) {
		console.log('hook error', e);
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};

const getPreferredLocale = (event: RequestEvent) => {
	// detect the preferred language the user has configured in his browser
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
	const headers = transformHeaders(event);
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector({
		headers: {
			get: (key: string) => headers[key]
		}
	});

	return detectLocale(baseLocale, locales, acceptLanguageDetector);
};

const transformHeaders = ({ request }: RequestEvent) => {
	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => (headers[key] = value));

	return headers;
};
