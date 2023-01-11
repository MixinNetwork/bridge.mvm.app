<script lang="ts" context="module">
	import type { Asset } from '../../types/asset';
	import FullLayoutModal from '$lib/components/base/modal/full-layout-modal.svelte';
	import LL from '$i18n/i18n-svelte';
	import { providerName } from '../../stores/provider';
	import { ETH_ASSET_ID, TRX_ASSET_ID } from '../../constants/common';
	import { userDestinations } from '../../stores/model';
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';
	import { showToast } from '../common/toast/toast-container.svelte';
	import QrCode from '$lib/components/common/qr-code.svelte';
	import Copy from '$lib/assets/copy.svg?component';
	import Spinner from '../common/spinner.svelte';

	const depositNetworkName = ({
		chain_id,
		chain_name,
		name
	}: Pick<Asset, 'chain_id' | 'chain_name' | 'name'>) => {
		if (chain_id === ETH_ASSET_ID) return 'Ethereum';
		if (chain_id === 'cbc77539-0a20-4666-8c8a-4ded62b36f0a') return 'Avalanche X-Chain';
		if (chain_id === '17f78d7c-ed96-40ff-980c-5dc62fecbc85') return 'BNB Beacon Chain';
		if (chain_id === TRX_ASSET_ID) return 'Tron';
		if (chain_id === '05891083-63d2-4f3d-bfbe-d14d7fb9b25a') return 'BitShares';
		return chain_name || name;
	};
</script>

<script lang="ts">
	export let close = () => {
		//
	};

	export let onDeposit: () => void;

	export let asset: Asset;

	$: depositEntry = $userDestinations.find(({ asset_id }) => asset_id === asset.chain_id)
		?.deposit_entries?.[0];

	$: !depositEntry && browser && userDestinations.fetchDestination(asset.chain_id);

	$: address = depositEntry?.destination;
	$: memo = depositEntry?.tag;
	$: qrcodes = [
		...(memo
			? [
					{
						key: $LL.memo(),
						value: memo
					}
			  ]
			: []),
		{
			key: $LL.address(),
			value: address
		}
	];
</script>

<FullLayoutModal class="!bg-white" on:click={close}>
	<div slot="title">{$LL.depositModal.title(asset.symbol)}</div>

	<div class="flex grow flex-col items-stretch overflow-y-auto px-5">
		<div class="space-y-2 rounded-xl bg-black bg-opacity-5 px-3 pt-2 pb-3">
			<div class=" text-sm font-semibold text-black text-opacity-50">{$LL.depositNetwork()}</div>
			<div class=" font-semibold text-black text-opacity-80">
				{depositNetworkName(asset)}
			</div>
		</div>

		{#if depositEntry}
			{#each qrcodes as { key, value } (key)}
				<div in:slide|local class="flex flex-col items-center break-all">
					<QrCode
						{value}
						size={130}
						class=" mt-6 mb-4 h-[130px] w-[130px] rounded-xl bg-white p-3 shadow"
					/>
					<div class="w-full rounded-xl bg-black bg-opacity-[3%] py-2 px-3">
						<div class=" text-sm font-semibold opacity-30">{key}</div>
						<div class="flex items-center font-semibold">
							<div class="grow">
								{value}
							</div>
							<button
								class="px-3 py-2"
								on:click={async () => {
									value && (await navigator.clipboard.writeText(value));
									showToast('success', $LL.copied());
								}}
							>
								<Copy class="fill-gray-400" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div class="flex h-[238px] items-center justify-center">
				<Spinner size={24} class="stroke-brand-primary" />
			</div>
		{/if}
		<ul class="mt-3 list-inside list-disc pb-6 text-xs font-semibold opacity-50">
			<li>{$LL.depositModal.tips1(asset.confirmations)}</li>
			<li>{$LL.depositModal.tips2(asset.symbol)}</li>
		</ul>

		{#if asset.chain_id === ETH_ASSET_ID}
			<div class="flex grow flex-col items-center justify-end pb-20 md:pb-8">
				<button class="font-semibold text-brand-primary" on:click={onDeposit}>
					{($providerName && $LL.depositFrom($providerName)) || ''}
				</button>
			</div>
		{/if}
	</div>
</FullLayoutModal>
