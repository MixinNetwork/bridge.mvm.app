<script lang="ts">
	import clsx from 'clsx';
	import type { Asset } from '../../types/asset';
	import AssetIcon from './asset-icon.svelte';
	import ChainLabel from './chain-label.svelte';
	import Arrow from '$lib/assets/arrow.svg?component';
	import Modal from '../common/modal/modal.svelte';
	import AssetList from './asset-list.svelte';

	let clazz: string | undefined = undefined;
	let asset: Asset;
	let onSelect: ((data: Asset) => void) | undefined = undefined;
	let disabled = false;
	export { clazz as class, asset, onSelect, disabled };

	let openedSelectModal = false;
	const toggle = () => (openedSelectModal = !openedSelectModal);
</script>

<button
	class={clsx(
		'flex w-full shrink-0 items-center justify-between space-x-4 px-4 py-3',
		disabled && 'default cursor-default',
		clazz
	)}
	on:click={toggle}
>
	<div class="flex items-center space-x-3">
		<AssetIcon
			assetIconUrl={asset.icon_url}
			assetName={asset.name}
			chainIconUrl={asset.chain_icon_url}
			chainName={asset.chain_name}
		/>
		<div class="text-start">
			<div class="flex items-center space-x-1 font-bold">
				<span>
					{asset.symbol}
				</span>
				<ChainLabel assetId={asset.asset_id} chainId={asset.chain_id} />
			</div>

			<div class="text-sm font-semibold opacity-30">
				<slot />
			</div>
		</div>
	</div>
	{#if !disabled}
		<Arrow class="rotate-90" />
	{/if}
</button>

<Modal
	modal-opened={openedSelectModal && !disabled}
	this={AssetList}
	modal-on-close={toggle}
	{onSelect}
/>
