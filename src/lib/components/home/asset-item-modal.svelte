<script lang="ts">
	import clsx from 'clsx';
	import type { Asset } from '../../types/asset';
	import AssetIcon from '../base/asset-icon.svelte';
	import LayoutBottomSheet from '../base/modal/layout-bottom-sheet.svelte';
	import { toSwapUrl } from './export';
	import LL from '$i18n/i18n-svelte';
	import Copy from '$lib/assets/copy.svg?component';
	import { showToast } from '../common/toast/toast-container.svelte';
	import { library } from '../../stores/ether';
	import { watchAsset } from '../../helpers/web3/registry';
	import { ETH_ASSET_ID } from '../../constants/common';
	import Close from '$lib/assets/close.svg?component';
	import { switchNetwork } from '../../helpers/web3/common';
	import { userDestinations } from '../../stores/model';
	import Spinner from '../common/spinner.svelte';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';

	export let close = () => {
		//
	};
	export let asset: Asset;
	export let onDeposit: () => void;
	export let onWithdraw: () => void;

	$: destination = $userDestinations.find(({ asset_id }) => asset_id === asset.chain_id)
		?.deposit_entries?.[0].destination;

	$: !destination && browser && userDestinations.fetchDestination(asset.chain_id);
</script>

<LayoutBottomSheet class="!h-auto items-center p-5">
	<div
		class="flex w-full items-center space-x-2 font-bold text-black text-opacity-80 md:relative md:space-x-0"
	>
		<AssetIcon
			class="h-8 w-8 md:hidden"
			chainClass=" h-3 w-3"
			assetIconUrl={asset.icon_url}
			assetName={asset.name}
			chainIconUrl={asset.chain_icon_url}
			chainName={asset.chain_name}
		/>
		<div class="md:absolute-center flex items-center font-bold">
			{asset.symbol}
		</div>
		<div class="flex grow justify-end ">
			<button on:click={close}>
				<Close />
			</button>
		</div>
	</div>

	<AssetIcon
		class="my-9 hidden h-[70px] w-[70px] md:block"
		chainClass="!h-6 !w-6"
		assetIconUrl={asset.icon_url}
		assetName={asset.name}
		chainIconUrl={asset.chain_icon_url}
		chainName={asset.chain_name}
	/>

	<div
		class={clsx(
			'mt-8 mb-12 flex w-full flex-col space-y-5 font-semibold',
			'child:flex child:flex-row child:justify-between child:space-x-2',
			'first:child:child:opacity-40'
		)}
	>
		<div>
			<div>{$LL.tokenName()}</div>
			<div>{asset.name}</div>
		</div>
		<div>
			<div>{$LL.tokenSymbol()}</div>
			<div>{asset.symbol}</div>
		</div>
		<div>
			<div>{$LL.address()}</div>
			{#if destination}
				<button
					transition:fade|local
					class="flex flex-row items-center space-x-1 text-brand-primary"
					on:click={async () => {
						destination && (await navigator.clipboard.writeText(destination));
						showToast('success', $LL.copied());
					}}
				>
					<div>
						{destination?.slice(0, 6) + '...' + destination?.slice(-4)}
					</div>
					<Copy class="fill-brand-primary" />
				</button>
			{:else}
				<Spinner size={24} class="stroke-brand-primary" />
			{/if}
		</div>
		<div>
			<div>{$LL.depositConfirmations()}</div>
			<div>{asset.confirmations}</div>
		</div>
	</div>

	<div
		class={clsx(
			'mb-8 flex w-full flex-row font-semibold',
			'child:flex child:h-12 child:w-full child:flex-1 child:items-center child:justify-center child:bg-brand-background child:text-center first:child:rounded-l-xl last:child:rounded-r-xl',
			'[&>*:nth-child(n+2)]:relative',
			'[&>*:nth-child(n+2)]:before:absolute',
			'[&>*:nth-child(n+2)]:before:left-0',
			'[&>*:nth-child(n+2)]:before:h-6',
			'[&>*:nth-child(n+2)]:before:w-[2px]',
			'[&>*:nth-child(n+2)]:before:-translate-x-[1px]',
			'[&>*:nth-child(n+2)]:before:rounded-full',
			'[&>*:nth-child(n+2)]:before:bg-black',
			'[&>*:nth-child(n+2)]:before:bg-opacity-5',
			' [&>*:nth-child(n+2)]:before:content-[""]'
		)}
	>
		<button on:click={onDeposit}>{$LL.deposit()}</button>
		<button on:click={onWithdraw}>{$LL.withdraw()}</button>
		<a href={toSwapUrl(asset.asset_id)}>{$LL.swap()}</a>
	</div>
	{#if asset.asset_id !== ETH_ASSET_ID}
		<button
			class="font-semibold text-brand-primary"
			on:click={async () => {
				$library && (await switchNetwork($library, 'mvm'));
				$library && watchAsset($library, asset);
			}}>{$LL.addToMetaMask()}</button
		>
	{/if}
</LayoutBottomSheet>
