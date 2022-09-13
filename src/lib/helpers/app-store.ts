import { browser } from '$app/environment';
import { page } from '$app/stores';
import { derived } from '@square/svelte-store';
import type { Page } from '@sveltejs/kit';
import { mapTemplate } from './store/map-template';

export const searchParamStore = mapTemplate((key: string) =>
	derived(page, ($page) => $page.url.searchParams.get(key))
);

export const setSearchParam = (
	$page: Page<Record<string, string>>,
	key: string,
	value?: unknown
) => {
	if (!browser) return;
	if (value) $page.url.searchParams.set(key, value.toString());
	else $page.url.searchParams.delete(key);
};
