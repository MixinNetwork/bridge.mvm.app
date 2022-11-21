<script lang="ts">
	import Bridge from './bridge.svelte';
	import FullLayoutModal from '$lib/components/base/modal/full-layout-modal.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { Asset } from '../../types/asset';

	export let close = () => {
		//
	};

	export let asset: Asset;
</script>

<FullLayoutModal on:click={close}>
	<div slot="title">{$LL.depositModal.title(asset.name)}</div>

	<div class="flex grow flex-col items-stretch overflow-y-auto">
		<Bridge {asset} depositMode={true} />
	</div>
</FullLayoutModal>
