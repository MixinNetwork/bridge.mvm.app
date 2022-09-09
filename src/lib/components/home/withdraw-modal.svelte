<script>
	import LayoutModal from '$lib/components/base/modal/layout-modal.svelte';
	import { selectedAsset } from './export';
	import Bridge from './bridge.svelte';

	export let onClose = () => {
		//
	};

	let asset = $selectedAsset;
	$: if ($selectedAsset) {
		asset = $selectedAsset;
	}
</script>

<LayoutModal on:click={onClose}>
	<div slot="title">Withdraw</div>
	<div class="flex grow flex-col items-stretch overflow-y-auto">
		{#if asset}
			<Bridge {asset} depositMode={false} />
		{/if}
	</div>
</LayoutModal>
