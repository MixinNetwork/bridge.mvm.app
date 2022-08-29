<script lang="ts">
	import { page } from '$app/stores';
	import {
		defaultDepositMode,
		DEPOSIT_MODE_KEY,
		selectedAsset,
		type DepositMode
	} from '../index@drawer.svelte';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import Qrcode from './_qrcode.svelte';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import Bridge from './_bridge.svelte';
	import LayoutModal from '../../lib/components/modal/layout-modal.svelte';

	export let onClose = () => {
		//
	};

	let asset = $selectedAsset;

	let depositMode =
		($page.url.searchParams.get(DEPOSIT_MODE_KEY) || $defaultDepositMode) === 'metamask'
			? 'metamask'
			: ('qrcode' as DepositMode);

	$: if ($selectedAsset && depositMode && browser) {
		$page.url.searchParams.set(DEPOSIT_MODE_KEY, depositMode);
		goto($page.url.href, { keepfocus: true, replaceState: true, noscroll: true });
	}

	$: if ($selectedAsset) {
		asset = $selectedAsset;
	}
</script>

<LayoutModal on:click={onClose}>
	<div slot="title">Deposit to MVM</div>

	<div
		class="mx-5 mb-3 grid grid-cols-2 rounded-md bg-black bg-opacity-5 p-1 text-center text-sm font-bold leading-7 child:z-0 child:!opacity-100 descendant:transition-all"
	>
		<label class="relative">
			<input type="radio" class="peer hidden" value="qrcode" bind:group={depositMode} />

			<div
				class="h-full text-black opacity-50 peer-checked:text-brand-primary peer-checked:opacity-100"
			>
				QR Code
			</div>

			<div
				class="absolute inset-0 -z-10 h-full w-full translate-x-full rounded-md bg-white peer-checked:translate-x-0"
			/>
		</label>

		<label>
			<input type="radio" class="peer hidden" value="metamask" bind:group={depositMode} />
			<div class="text-black opacity-50 peer-checked:text-brand-primary peer-checked:opacity-100">
				MetaMask
			</div>
		</label>
	</div>

	{#if depositMode === 'qrcode' && asset}
		<Qrcode {asset} />
	{:else if depositMode === 'metamask' && asset?.chain_id === ETH_ASSET_ID}
		<Bridge {asset} depositMode={true} />
	{:else}
		<div class="flex grow items-center self-center font-semibold opacity-30">Not yet available</div>
	{/if}
</LayoutModal>
