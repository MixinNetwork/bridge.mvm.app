<script lang="ts">
	import { assets } from '$lib/stores/model';
	import AssetIcon from '$lib/components/base/asset-icon.svelte';
	import ChainLabel from '$lib/components/base/chain-label.svelte';
	import type { Asset } from '$lib/types/asset';
	import ModalHeader from '$lib/components/base/modal/modal-header.svelte';
	import LayoutBottomSheet from '$lib/components/base/modal/layout-bottom-sheet.svelte';
	import Search from '$lib/assets/search.svg?component';
	import { searchAssets } from '../../helpers/utils';

	export let close = () => {
		//
	};
	export let onSelect: ((data: Asset) => void) | undefined = undefined;

	let keyword = '';

	$: filtedSearch = searchAssets(keyword, $assets);

	const click = (asset: Asset) => {
		onSelect?.(asset);
		close();
	};
</script>

<LayoutBottomSheet>
	<ModalHeader class="hidden md:flex" on:click={close}>Assets</ModalHeader>
	<div class="flex items-center justify-center space-x-4 px-5 pt-4 pb-2 font-semibold md:pt-0">
		<label
			for="search"
			class="flex grow items-center justify-center space-x-3 rounded-xl bg-black bg-opacity-5 p-3"
		>
			<Search />
			<input
				id="search"
				type="text"
				class="w-full bg-transparent placeholder-black placeholder-opacity-20"
				placeholder="Search"
				bind:value={keyword}
			/>
		</label>

		<button on:click={() => (keyword = '')}>Cancel</button>
	</div>
	<div class="grow overflow-y-auto">
		{#each filtedSearch || [] as asset (asset.asset_id)}
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
	</div>
</LayoutBottomSheet>
