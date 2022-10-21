<script>
	import FullLayoutModal from '$lib/components/base/modal/full-layout-modal.svelte';
	import { selectedAsset } from './export';
	import Bridge from './bridge.svelte';
	import LL from '$i18n/i18n-svelte';

	export let close = () => {
		//
	};

	let asset = $selectedAsset;
	$: if ($selectedAsset) {
		asset = $selectedAsset;
	}
</script>

<FullLayoutModal on:click={close}>
	<div slot="title">{$LL.withdraw()}</div>
	<div class="flex grow flex-col items-stretch overflow-y-auto">
		{#if asset}
			<Bridge {asset} depositMode={false} />
		{/if}
	</div>
</FullLayoutModal>
