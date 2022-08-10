<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { setProvider } from '$lib/stores/ether';
	import { browser } from '$app/env';
	import { legalUser, logout } from '$lib/stores/user';
	import { lastUrl } from '$lib/stores/last-url';
	import { createWeb3Client } from '$lib/web3';
	import { clearCachedProvider } from '$lib/stores/cached-provider';

	let listening = false;

	const init = async () => {
		if (!browser) return;
		if ($legalUser) return;

		let p;
		const web3Client = await createWeb3Client();
		try {
			p = await web3Client.cacheConnect();
			await (p && setProvider(p));
		} catch (_) {
			logout();
			clearCachedProvider();
		}

		listening = true;
	};

	$: isConnect = $page.url.pathname === '/connect';

	$: if (!isConnect) {
		const url = $page.url.href.replace($page.url.origin, '');
		lastUrl.set(url);
	}

	if (browser) {
		init();
	}

	$: if (listening && !$legalUser) {
		logout();
		clearCachedProvider();
	}

	$: if (!isConnect && listening && !$legalUser) {
		goto('/connect');
	}
</script>

<slot />
