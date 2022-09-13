<script lang="ts">
	import { assets } from '$lib/stores/model';
	import AssetIcon from '$lib/components/base/asset-icon.svelte';
	import ChainLabel from '$lib/components/base/chain-label.svelte';
	import type { Asset } from '$lib/types/asset';
	import ModalHeader from '$lib/components/base/modal/modal-header.svelte';
	import LayoutBottomSheet from '$lib/components/base/modal/layout-bottom-sheet.svelte';

	export let onClose = () => {
		//
	};
	export let callback: ((data: Asset) => void) | undefined = undefined;

	const click = (asset: Asset) => {
		callback?.(asset);
		onClose();
	};
</script>

<LayoutBottomSheet>
	<ModalHeader class="hidden md:flex" on:click={onClose}>Assets</ModalHeader>
	<div class="grow overflow-y-auto">
		{#each $assets || [] as asset (asset.asset_id)}
			<button class="flex w-full space-x-3 px-5 py-4 text-start" on:click={() => click(asset)}>
				<AssetIcon
					assetIconUrl={asset.icon_url}
					assetName={asset.name}
					chainIconUrl={asset.chain_icon_url}
					chainName={asset.chain_name}
				/>

				<div>
					<div class="font-bold">
						<span class="font-bold">
							{asset.symbol}
						</span>
						<ChainLabel assetId={asset.asset_id} chainId={asset.chain_id} />
					</div>

					<div class="text-sm font-semibold opacity-20">
						{asset.name}
					</div>
				</div>
			</button>
		{/each}
	</div>
</LayoutBottomSheet>
