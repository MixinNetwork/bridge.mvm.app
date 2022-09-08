<script lang="ts">
	import '../css/app.css';
	import ModalContainer from '$lib/components/common/modal/modal-container.svelte';
	import Meta from '$lib/components/common/meta.svelte';
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

<ModalContainer />
