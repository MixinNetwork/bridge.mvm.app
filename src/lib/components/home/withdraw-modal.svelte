<script lang="ts">
	import FullLayoutModal from '$lib/components/base/modal/full-layout-modal.svelte';
	import Bridge from './bridge.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { Asset } from '../../types/asset';

	export let close = () => {
		//
	};

	export let asset: Asset;
</script>

<FullLayoutModal on:click={close}>
	<div slot="title">{$LL.withdraw()}</div>
	<div class="flex grow flex-col items-stretch overflow-y-auto">
		<Bridge {asset} depositMode={false} />
	</div>
</FullLayoutModal>
