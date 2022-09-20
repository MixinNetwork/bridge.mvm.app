<script lang="ts">
	import '../css/app.css';
	import Meta from '$lib/components/common/meta.svelte';
	import { PortalContainer } from '@yeungkc/svelte-portal';
	import ToastContainer from '$lib/components/common/toast/toast-container.svelte';
</script>

<Meta
	title="MVM Bridge"
	description="The best cross-chain bridge."
	keywords={[
		'MVM Bridge',
		'Cross-Chain Bridge',
		'Bitcoin',
		'Bridge',
		'Ethereum Bridge',
		'MobileCoin MetaMask'
	]}
/>

<slot />
<PortalContainer />
<ToastContainer />
