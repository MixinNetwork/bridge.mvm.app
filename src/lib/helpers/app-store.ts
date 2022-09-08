import { browser } from '$app/env';
import { page } from '$app/stores';
import { derived, get } from '@square/svelte-store';
import { mapTemplate } from './store/map-template';

export const searchParamStore = mapTemplate((key: string) =>
	derived(page, ($page) => $page.url.searchParams.get(key))
);

export const setSearchParam = (key: string, value?: unknown) => {
	if (!browser) return;
	const $page = get(page);
	if (value) $page.url.searchParams.set(key, value.toString());
	else $page.url.searchParams.delete(key);
};
