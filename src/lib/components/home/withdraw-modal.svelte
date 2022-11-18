<script lang="ts">
	import FullLayoutModal from '$lib/components/base/modal/full-layout-modal.svelte';
	import Bridge from './bridge.svelte';
	import LL from '$i18n/i18n-svelte';
	import { withdrawAsset } from './export';

	export let close = () => {
		//
	};
</script>

<FullLayoutModal on:click={close}>
	<div slot="title">{$LL.withdraw()}</div>
	<div class="flex grow flex-col items-stretch overflow-visible">
		{#if $withdrawAsset}
			<Bridge
				asset={$withdrawAsset}
				onChangeAsset={(asset) => withdrawAsset.set(asset)}
				depositMode={false}
			/>
		{/if}
	</div>
</FullLayoutModal>
