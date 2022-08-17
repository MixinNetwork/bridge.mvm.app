<script lang="ts">
	import { assets } from '$lib/stores/model';
	import AssetIcon from '$lib/components/asset-icon.svelte';
	import Erc20Label from '$lib/components/erc20-label.svelte';
	import type { Asset } from '$lib/types/asset';

	export let onClose = () => {
		//
	};
	export let callback: ((data: Asset) => void) | undefined = undefined;

	const click = (asset: Asset) => {
		callback?.(asset);
		onClose();
	};
</script>

<div class="w-full rounded-t-xl bg-white md:w-96 md:rounded-xl">
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
					<Erc20Label />
				</div>

				<div class="text-sm font-semibold opacity-20">
					{asset.name}
				</div>
			</div>
		</button>
	{/each}
</div>
