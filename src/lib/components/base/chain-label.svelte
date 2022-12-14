<script lang="ts">
	import { EOS_ASSET_ID, ETH_ASSET_ID, TRX_ASSET_ID, MOB_ASSET_ID } from '../../constants/common';

	export let assetId: string;
	export let chainId: string;

	$: label =
		assetId !== ETH_ASSET_ID && chainId === ETH_ASSET_ID
			? 'ERC20'
			: assetId !== TRX_ASSET_ID && chainId === TRX_ASSET_ID
			? Number.isFinite(Number.parseInt(assetId))
				? 'TRC10'
				: 'TRC20'
			: assetId !== EOS_ASSET_ID && chainId === EOS_ASSET_ID
			? 'EOS'
			: assetId !== MOB_ASSET_ID && chainId === MOB_ASSET_ID
			? 'MOB'
			: undefined;
</script>

{#if !!label}
	<span
		class="rounded bg-black bg-opacity-5 px-1 py-[1px] text-xs font-normal text-black text-opacity-30"
		>{label}</span
	>
{/if}
