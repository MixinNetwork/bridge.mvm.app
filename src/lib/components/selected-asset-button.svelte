<script lang="ts">
	import { ETH_ASSET_ID } from '../constants/common';

	import type { Asset } from '../types/asset';
	import AssetIcon from './asset-icon.svelte';
	import Erc20Label from './erc20-label.svelte';
	import Arrow from '$lib/assets/arrow.svg?component';

	export let asset: Asset;
</script>

<button class=" flex w-full items-center justify-between px-4 py-3" on:click>
	<div class="flex space-x-3">
		<AssetIcon
			assetIconUrl={asset.icon_url}
			assetName={asset.name}
			chainIconUrl={asset.chain_icon_url}
			chainName={asset.chain_name}
		/>
		<div class=" text-start">
			<div class="font-bold">
				{asset.symbol}
				{#if asset.chain_id === ETH_ASSET_ID}
					<Erc20Label />
				{/if}
			</div>

			<div class="text-sm font-semibold opacity-30">
				<slot>
					{asset.name}
				</slot>
			</div>
		</div>
	</div>
	<Arrow class="rotate-90" />
</button>
