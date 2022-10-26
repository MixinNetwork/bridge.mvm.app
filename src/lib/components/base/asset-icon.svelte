<script lang="ts">
	import clsx from 'clsx';
	let assetIconUrl: string;
	let assetName: string;
	let chainIconUrl: string | undefined = undefined;
	let chainName: string | undefined = undefined;

	let clazz: string | undefined = undefined;
	let chainClass: string | undefined = undefined;

	export { clazz as class, chainClass, assetIconUrl, assetName, chainIconUrl, chainName };
</script>

<div class={clsx('relative h-10 w-10', clazz)}>
	<img loading="lazy" src={assetIconUrl} class="h-full w-full" alt={assetName} />
	{#if chainIconUrl}
		<img
			loading="lazy"
			src={chainIconUrl}
			class={clsx('absolute bottom-0 left-0 h-[14px] w-[14px]', chainClass)}
			alt={chainName}
		/>
	{/if}
</div>
