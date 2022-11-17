<script lang="ts">
	import { browser } from '$app/environment';
	import { isLogged, legalUser, logout } from '$lib/stores/user';
	import { cacheConnectWallet } from '../../../helpers/web3client';
	import { provider, setProvider } from '../../../stores/ether';

	let listening = false;

	const init = async () => {
		if (!browser) return;
		if (!$isLogged) return;
		if ($provider) return;

		try {
			const p = await cacheConnectWallet();
			await (p && setProvider(p));
		} catch (e) {
			console.log('guard error', e);

			logout();
		}

		listening = true;
	};

	if (browser) init();
	$: if (listening && !$legalUser) logout();
</script>

<slot />
