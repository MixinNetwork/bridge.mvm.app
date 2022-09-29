<script lang="ts">
	import type { Asset } from '../../types/asset';
	import Close from '$lib/assets/close.svg?component';
	import AssetIcon from '../base/asset-icon.svelte';
	import LayoutBottomSheet from '../base/modal/layout-bottom-sheet.svelte';
	import { switchDepositMode, switchWithdrawMode } from './export';
	import LL from '$i18n/i18n-svelte';

	export let close = () => {
		//
	};
	export let asset: Asset;
</script>

<LayoutBottomSheet class="!h-auto p-5">
	<div class="flex items-center space-x-2">
		<AssetIcon
			class="h-8 w-8 "
			chainClass=" h-3 w-3"
			assetIconUrl={asset.icon_url}
			assetName={asset.name}
			chainIconUrl={asset.chain_icon_url}
			chainName={asset.chain_name}
		/>
		<div class="flex items-center font-bold">
			{asset.symbol}
		</div>

		<div class="flex grow justify-end ">
			<button on:click={close}>
				<Close />
			</button>
		</div>
	</div>

	<div
		class=" mt-5 flex flex-col items-center space-y-2 child:mx-8 child:w-full child:rounded-xl child:bg-brand-background child:py-4 child:text-center"
	>
		<button
			on:click={() => {
				switchDepositMode(asset, undefined);
				close();
			}}>{$LL.deposit()}</button
		>
		<button
			on:click={() => {
				switchWithdrawMode(asset);
				close();
			}}>{$LL.withdraw()}</button
		>
	</div>
</LayoutBottomSheet>
