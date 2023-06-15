<script lang="ts">
	import { getChainLabel } from '$lib/helpers/utils';

	export let assetId: string;
	export let chainId: string;

	$: label = getChainLabel(assetId, chainId);
</script>

{#if !!label}
	<span
		class="rounded bg-black bg-opacity-5 px-1 py-[1px] text-xs font-normal text-black text-opacity-30"
		>{label}</span
	>
{/if}
