import { page } from '$app/stores';
import { derived, get } from '@square/svelte-store';
import { register } from '../helpers/api';
import { jsonPersistentEncoder, persistentWritable } from '../helpers/store/persistent';
import type { User } from '../types/user';
import { account } from './ether';
import { clearLastProvider, providerKey } from './provider';
import { LANG, USER_KEY } from '$lib/constants/common';
import { dedupe } from '../helpers/store/dedupe';
import { invalidateAll } from '$app/navigation';
import type { Locales } from '$i18n/i18n-types';
import { locale, setLocale } from '$i18n/i18n-svelte';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { browser } from '$app/environment';

const persistentUser = persistentWritable<User | undefined>(
	USER_KEY,
	undefined,
	jsonPersistentEncoder
);

const persistentLang = persistentWritable<Locales | undefined>(LANG, undefined);

export const switchLang = async (lang: Locales) => {
	if (!browser) return;
	if (get(locale) === lang) return;

	await loadLocaleAsync(lang);

	persistentLang.set(lang);
	setLocale(lang);

	document.querySelector('html')?.setAttribute('lang', lang);
};

export const lang = derived(persistentLang, (lang) => lang);

export const user = dedupe<User | undefined>(
	derived([persistentUser, page], ([$user, $page]) => $user || $page.data?.user || undefined)
);

export const registerAndSave = async (address: string) => {
	const u = await register(address);
	return persistentUser.set({
		...u,
		address
	});
};

export const logout = async () => {
	await invalidateAll();
	persistentUser.set(undefined);
	clearLastProvider();
	location.reload();
};

export const isLogged = derived(
	[user, providerKey],
	([$user, $providerKey]) => !!$user && !!$providerKey
);

export const legalUser = derived(
	[persistentUser, account, isLogged],
	([$user, $account, $isLogged]) => ($isLogged ? $user && $user.address === $account : undefined)
);

export const address = derived(user, ($user) => $user?.address);

export const shortAddress = derived(address, ($address) => {
	if (!$address) return;
	return $address.slice(0, 6) + '...' + $address.slice(-4);
});
