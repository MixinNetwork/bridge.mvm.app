<script lang="ts">
	import '../css/app.css';
	import Meta from '$lib/components/common/meta.svelte';
	import { PortalContainer } from '@yeungkc/svelte-portal';
	import ToastContainer from '$lib/components/common/toast/toast-container.svelte';
	import { setLocale } from '$i18n/i18n-svelte';
	import { page } from '$app/stores';
	import LL from '$i18n/i18n-svelte';

	setLocale($page.data.lang);
</script>

<Meta
	title={$LL.meta.title()}
	description={$LL.meta.description()}
	keywords={[
		$LL.meta.title(),
		$LL.meta.keywords.crossChainBridge(),
		$LL.meta.keywords.bitcoin(),
		$LL.meta.keywords.bridge(),
		$LL.meta.keywords.ethereumBridge(),
		$LL.meta.keywords.mobileCoinMetaMask()
	]}
/>

<slot />
<PortalContainer />
<ToastContainer />
