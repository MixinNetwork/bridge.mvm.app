<script lang="ts">
	import dayjs from 'dayjs';
	import { entries, groupBy } from 'lodash-es';
	import LL from '../../../i18n/i18n-svelte';
	import AssetIcon from './asset-icon.svelte';
	import ChainLabel from './chain-label.svelte';
	import type { ExternalTransactionResponseWithAsset } from './deposit-pending.svelte';
	import LayoutBottomSheet from './modal/layout-bottom-sheet.svelte';
	import ModalHeader from './modal/modal-header.svelte';

	export let close = () => {
		//
	};

	export let data: ExternalTransactionResponseWithAsset[];
	$: group = entries(groupBy(data, (d) => dayjs(d.created_at).format('DD/MM/YYYY')));
	$: !data.length && close();
</script>

<LayoutBottomSheet class="md:w-[480px]">
	<ModalHeader {close} class="mb-5 px-5 pt-5">{$LL.pending(data.length)}</ModalHeader>
	<div class="overflow-y-auto px-5">
		{#each group as [date, data] (date)}
			<div class=" text-sm font-semibold opacity-20">{date}</div>
			{#each data as { asset, amount, asset_id, chain_id, destination, confirmations, transaction_hash } (transaction_hash)}
				<div class="flex flex-row space-x-3 py-4">
					<AssetIcon
						assetIconUrl={asset.icon_url}
						assetName={asset.name}
						chainIconUrl={asset.chain_icon_url}
						chainName={asset.chain_name}
						class="shrink-0"
					/>
					<div class="flex grow flex-col ">
						<span>
							<span class="font-bold opacity-80"> {amount} {asset.symbol}</span>
							<ChainLabel assetId={asset_id} chainId={chain_id} />
						</span>
						<span class="flex items-center text-sm font-semibold opacity-20">
							<span>
								{destination.slice(0, 6)}...{destination.slice(-4)}
							</span>
						</span>
					</div>
					<div class="flex shrink-0 flex-col items-end justify-center space-y-2">
						<div class=" text-sm font-semibold opacity-20">
							{$LL.confirmations(+confirmations, asset.confirmations)}
						</div>
						<div class="flex h-[6px] w-32 justify-end rounded-full bg-brand-primary bg-opacity-20 ">
							<div
								class="h-full rounded-full bg-brand-primary"
								style={`width: ${(+confirmations / asset.confirmations) * 100}%`}
							/>
						</div>
					</div>
				</div>
			{/each}
		{/each}
	</div>
</LayoutBottomSheet>
