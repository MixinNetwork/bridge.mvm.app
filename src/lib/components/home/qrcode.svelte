<script lang="ts">
	import type { Asset } from '$lib/types/asset';
	import QrCode from '$lib/components/common/qr-code.svelte';
	import Copy from '$lib/assets/copy.svg?component';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import { selectAsset } from './export';

	export let asset: Asset;

	$: address = asset?.deposit_entries[0].destination;
	$: memo = asset?.deposit_entries[0].tag;
	$: qrcodes = [
		...(memo
			? [
					{
						key: 'Memo',
						value: memo
					}
			  ]
			: []),
		{
			key: 'Address',
			value: address
		}
	];
</script>

<div class="mx-5 rounded-lg bg-white">
	<SelectedAssetButton {asset} onSelect={selectAsset} />
	{#each qrcodes as { key, value } (key)}
		<div class="mx-4 flex flex-col items-center break-all  pb-6">
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
						on:click={() => {
							value && navigator.clipboard.writeText(value);
						}}
					>
						<Copy />
					</button>
				</div>
			</div>
		</div>
	{/each}

	<ul class="mx-6 list-outside list-disc pb-6 text-xs font-semibold opacity-50">
		<li>Deposit expected to take {asset.confirmations} comfirmations.</li>
		<li>Min deposit: 0.00000001 {asset.symbol}</li>
	</ul>
</div>
