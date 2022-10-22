<script lang="ts">
	import { switchDepositMode, switchWithdrawMode } from './export';

	import { bigEq, bigGt, bigLt, bigMul, format, toPercent } from '../../helpers/big';

	import type { Asset } from '../../types/asset';
	import AssetIcon from '../base/asset-icon.svelte';
	import AssetItemModal from './asset-item-modal.svelte';
	import Modal from '../common/modal/modal.svelte';
	import LL from '$i18n/i18n-svelte';
	import ChainLabel from '../base/chain-label.svelte';
	import clsx from 'clsx';

	export let asset: Asset;

	let isOpen = false;
	const close = () => (isOpen = false);

	let innerWidth = 0;

	$: isLg = innerWidth >= 1024;
	$: if (isLg) isOpen = false;
</script>

<svelte:window bind:innerWidth />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:click={() => {
		if (isLg) return switchDepositMode(asset, undefined);
		isOpen = true;
	}}
	class="flex w-full cursor-pointer items-center bg-brand-primary bg-opacity-0 p-5 opacity-100 hover:bg-opacity-5"
>
	<div class="flex flex-1 items-center justify-between space-x-3">
		<AssetIcon
			assetIconUrl={asset.icon_url}
			assetName={asset.name}
			chainIconUrl={asset.chain_icon_url}
			chainName={asset.chain_name}
		/>
		<div>
			<span class="space-x-1">
				<span class="font-bold">{format({ n: asset.balance, dp: 8 })}</span>
				<ChainLabel chainId={asset.chain_id} assetId={asset.asset_id} />
			</span>
			<div class="text-sm font-semibold opacity-20">
				${format({ n: bigMul(asset.balance, asset.price_usd), dp: 2, fixed: true })}
			</div>
		</div>
		<div class="flex grow flex-col items-end text-sm font-semibold text-black text-opacity-30">
			{#if bigGt(asset.price_usd, 0)}
				<div
					class={clsx({
						'text-green-500': bigGt(asset.change_usd, 0),
						'text-red-500': bigLt(asset.change_usd, 0),
						'text-opacity-100': !bigEq(asset.change_usd, 0)
					})}
				>
					{toPercent({ n: asset.change_usd })}
				</div>
				<div>
					${format({ n: asset.price_usd, dp: 2, fixed: true })}
				</div>
			{:else}
				<div>{$LL.tokenNA()}</div>
			{/if}
		</div>
	</div>

	<div
		class="hidden flex-1 justify-end space-x-4 font-semibold child:flex child:h-10 child:w-[102px] child:items-center child:justify-center child:rounded-full child:bg-white lg:flex"
	>
		<button on:click|stopPropagation={() => switchDepositMode(asset, undefined)}
			>{$LL.deposit()}</button
		>
		<button on:click|stopPropagation={() => switchWithdrawMode(asset)}>{$LL.withdraw()}</button>
		<!-- <button>Swap</button> -->
	</div>
</div>

<Modal modal-opened={isOpen} this={AssetItemModal} modal-on-close={close} {asset} />
