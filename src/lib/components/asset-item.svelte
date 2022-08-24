<script lang="ts">
	import { goto } from '$app/navigation';

	import { ASSET_KEY, MODE_KEY } from '../../routes/index@drawer.svelte';

	import { bigMul, formatCurrency, toRounding } from '../helpers/big';

	import type { Asset } from '../types/asset';
	import AssetIcon from './asset-icon.svelte';

	export let asset: Asset;
</script>

<div
	on:click={() => {
		goto(`/?${ASSET_KEY}=${asset.asset_id}`);
	}}
	class="flex w-full cursor-pointer items-center space-x-3 bg-brand-primary bg-opacity-0 p-5 hover:bg-opacity-5"
>
	<AssetIcon
		assetIconUrl={asset.icon_url}
		assetName={asset.name}
		chainIconUrl={asset.chain_icon_url}
		chainName={asset.chain_name}
	/>
	<div>
		<div class=" font-bold">{asset.name}</div>
		<div class=" text-sm font-semibold opacity-30">{asset.symbol}</div>
	</div>
	<div class="flex grow flex-col items-end">
		<div class="font-bold">{toRounding(asset.balance, 8)}</div>
		<div class=" text-sm font-semibold opacity-30">
			${formatCurrency(bigMul(asset.balance, asset.price_usd))}
		</div>
	</div>

	<div
		class=" hidden space-x-4 font-semibold child:flex child:h-10 child:w-[102px] child:items-center child:justify-center child:rounded-full child:bg-white lg:flex lg:pl-10 xl:pl-32"
	>
		<a href={`/?${ASSET_KEY}=${asset.asset_id}&${MODE_KEY}=deposit`}>Deposit</a>
		<a href={`/?${ASSET_KEY}=${asset.asset_id}&${MODE_KEY}=withdraw`}>Withdraw</a>
		<!-- <button>Swap</button> -->
	</div>
</div>
