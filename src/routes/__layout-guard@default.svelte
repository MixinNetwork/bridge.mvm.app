<script context="module" lang="ts">
	export const LAST_URL = 'last-url';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { setProvider } from '$lib/stores/ether';
	import { browser } from '$app/env';
	import { legalUser, logout } from '$lib/stores/user';
	import { createWeb3Client } from '$lib/helpers/web3client';
	import type { Load } from '@sveltejs/kit';
	import { get } from '@square/svelte-store';

	export const load: Load = ({ session: { user, provider }, url }) => {
		if (url.pathname === '/connect/') return;
		if (user && provider) return;
		if (browser && get(legalUser)) return;

		return {
			status: 302,
			redirect: `/connect?${LAST_URL}=${url.href.replace(url.origin, '')}`
		};
	};
</script>

<script lang="ts">
	let listening = false;

	const init = async () => {
		if (!browser) return;

		let p;
		const web3Client = await createWeb3Client();
		try {
			p = await web3Client.cacheConnect();
			await (p && setProvider(p));
		} catch (e) {
			console.log('guard error', e);

			logout();
		}

		listening = true;
	};

	$: isConnect = $page.url.pathname === '/connect/';

	if (browser) init();

	$: if (listening && !$legalUser) logout();

	$: if (!isConnect && listening && !$legalUser) {
		const url = $page.url.href.replace($page.url.origin, '');
		goto(`/connect/?${LAST_URL}=${url}`);
	}
</script>

<slot />
