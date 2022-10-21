<script lang="ts">
	import { selectedAsset, switchDepositMode, depositMode } from './export';
	import Qrcode from './qrcode.svelte';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import Bridge from './bridge.svelte';
	import FullLayoutModal from '$lib/components/base/modal/full-layout-modal.svelte';
	import { providerName } from '$lib/stores/provider';
	import LL from '$i18n/i18n-svelte';

	export let close = () => {
		//
	};

	let asset = $selectedAsset;
	$: if ($selectedAsset) asset = $selectedAsset;

	let mode = $depositMode;
	$: if ($depositMode) mode = $depositMode;

	$: if (asset && mode === 'qrcode') switchDepositMode(asset, 'qrcode');
	$: if (asset && mode === 'metamask') switchDepositMode(asset, 'metamask');
</script>

<FullLayoutModal on:click={close}>
	<div slot="title">{$LL.depositModal.title()}</div>

	<div
		class="mx-5 mb-3 grid grid-cols-2 rounded-md bg-black bg-opacity-5 p-1 text-center text-sm font-bold leading-7 child:z-0 child:!opacity-100 descendant:transition-all"
	>
		<label class="relative">
			<input type="radio" class="peer hidden" value="qrcode" bind:group={mode} />

			<div
				class="h-full text-black opacity-50 peer-checked:text-brand-primary peer-checked:opacity-100"
			>
				{$LL.depositModal.qrCode()}
			</div>

			<div
				class="absolute inset-0 -z-10 h-full w-full translate-x-full rounded-md bg-white peer-checked:translate-x-0"
			/>
		</label>

		<label>
			<input type="radio" class="peer hidden" value="metamask" bind:group={mode} />
			<div class="text-black opacity-50 peer-checked:text-brand-primary peer-checked:opacity-100">
				{$providerName}
			</div>
		</label>
	</div>

	<div class="flex grow flex-col items-stretch overflow-y-auto">
		{#if mode === 'qrcode' && asset}
			<Qrcode {asset} />
		{:else if mode === 'metamask' && asset?.chain_id === ETH_ASSET_ID}
			<Bridge {asset} depositMode={true} />
		{:else}
			<div class="flex grow items-center self-center font-semibold opacity-30">
				Not yet available
			</div>
		{/if}
	</div>
</FullLayoutModal>
