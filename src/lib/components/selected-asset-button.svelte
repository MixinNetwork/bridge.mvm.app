<script lang="ts">
	import clsx from 'clsx';
	import type { Asset } from '../types/asset';
	import AssetIcon from './asset-icon.svelte';
	import ChainLabel from './chain-label.svelte';
	import Arrow from '$lib/assets/arrow.svg?component';
	import Modal from './common/modal/modal.svelte';
	import AssetList from './asset-list.svelte';

	let clazz: string | undefined = undefined;
	let asset: Asset;
	export { clazz as class, asset };

	let openedSelectModal = false;
	const toggle = () => (openedSelectModal = !openedSelectModal);
</script>

<button
	class={clsx('flex w-full items-center justify-between px-4 py-3 space-x-4', clazz)}
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
			<div class="font-bold">
				{asset.symbol}
				<ChainLabel assetId={asset.asset_id} chainId={asset.chain_id} />
			</div>

			<div class="text-sm font-semibold opacity-30">
				<slot />
			</div>
		</div>
	</div>
	<Arrow class="rotate-90" />
</button>

<Modal
	isOpen={openedSelectModal}
	class="!items-end md:!items-center"
	content={AssetList}
	on:close={toggle}
	on:callback
/>
