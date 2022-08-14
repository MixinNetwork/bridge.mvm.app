<script lang="ts">
	export let assetIconUrl: string;
	export let assetName: string;
	export let chainIconUrl: string | undefined = undefined;
	export let chainName: string | undefined = undefined;
</script>

<div class=" relative h-10 w-10">
	<img src={assetIconUrl} class="h-full w-full" alt={assetName} />
	{#if chainIconUrl}
		<img src={chainIconUrl} class="absolute bottom-0 left-0 h-[14px] w-[14px]" alt={chainName} />
	{/if}
</div>
