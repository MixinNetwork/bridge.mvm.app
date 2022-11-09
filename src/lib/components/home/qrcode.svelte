<script lang="ts">
	import type { Asset } from '$lib/types/asset';
	import QrCode from '$lib/components/common/qr-code.svelte';
	import Copy from '$lib/assets/copy.svg?component';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import { showToast } from '$lib/components/common/toast/toast-container.svelte';
	import { selectAsset } from './export';
	import LL from '$i18n/i18n-svelte';
	import { userDestinations } from '../../stores/model';
	import { browser } from '$app/environment';
	import Spinner from '../common/spinner.svelte';
	import { slide } from 'svelte/transition';

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

<div class="mx-5 rounded-lg bg-white">
	<SelectedAssetButton {asset} onSelect={selectAsset} />
	{#if depositEntry}
		{#each qrcodes as { key, value } (key)}
			<div in:slide|local class="mx-4 flex flex-col items-center break-all pb-6">
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
		<div class="flex h-[278px] items-center justify-center">
			<Spinner size={24} class="stroke-brand-primary" />
		</div>
	{/if}

	<ul class="mx-6 list-outside list-disc pb-6 text-xs font-semibold opacity-50">
		<li>{$LL.depositModal.tips1(asset.confirmations)}</li>
		<li>{$LL.depositModal.tips2(asset.symbol)}</li>
	</ul>
</div>
