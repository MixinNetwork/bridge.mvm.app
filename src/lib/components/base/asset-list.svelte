<script lang="ts">
	import { assets } from '$lib/stores/model';
	import AssetIcon from '$lib/components/base/asset-icon.svelte';
	import ChainLabel from '$lib/components/base/chain-label.svelte';
	import type { Asset } from '$lib/types/asset';
	import FullModalHeader from '$lib/components/base/modal/full-modal-header.svelte';
	import LayoutBottomSheet from '$lib/components/base/modal/layout-bottom-sheet.svelte';
	import { searchAssets } from '../../helpers/utils';
	import SearchBar from './search-bar.svelte';
	import Empty from './empty.svelte';
	import LL from '$i18n/i18n-svelte';

	export let close = () => {
		//
	};
	export let onSelect: ((data: Asset) => void) | undefined = undefined;
	export let selectAndClose = true;

	let keyword = '';

	$: filtedAssets = searchAssets(keyword, $assets);

	const click = (asset: Asset) => {
		onSelect?.(asset);
		selectAndClose && close();
	};
</script>

<LayoutBottomSheet class="h-4/5">
	<FullModalHeader class="mb-0 hidden md:flex" on:click={close}>{$LL.searchAsset()}</FullModalHeader
	>
	<SearchBar bind:keyword class="md:pt-0" />
	<div class="grow overflow-y-auto">
		{#each filtedAssets || [] as asset (asset.asset_id)}
			<button class="flex w-full space-x-3 px-5 py-4 text-start" on:click={() => click(asset)}>
				<AssetIcon
					assetIconUrl={asset.icon_url}
					assetName={asset.name}
					chainIconUrl={asset.chain_icon_url}
					chainName={asset.chain_name}
				/>

				<div>
					<div class="flex items-center space-x-1 font-bold">
						<span>
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

		{#if !filtedAssets.length}
			<Empty class="h-full w-full items-center justify-center" />
		{/if}
	</div>
</LayoutBottomSheet>
