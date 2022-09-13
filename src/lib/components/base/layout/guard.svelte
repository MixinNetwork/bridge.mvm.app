<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createWeb3Client } from '$lib/helpers/web3client';
	import { setProvider } from '$lib/stores/ether';
	import { legalUser, logout } from '$lib/stores/user';
	import { LAST_URL } from '../../../constants/common';

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

	if (browser) init();
	$: if (listening && !$legalUser) logout();

	$: if (listening && !$legalUser) {
		const url = $page.url.href.replace($page.url.origin, '');
		goto(`/connect/?${LAST_URL}=${url}`);
	}
</script>

<slot />
