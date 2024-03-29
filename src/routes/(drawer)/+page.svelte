<script lang="ts">
	import clsx from 'clsx';
	import Brand from '$lib/components/base/brand.svelte';
	import Header from '$lib/components/base/header.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import Balance from '$lib/components/home/balance.svelte';
	import Send from '$lib/assets/send.svg?component';
	import Receive from '$lib/assets/receive.svg?component';
	import { assets } from '$lib/stores/model';
	import type { Asset } from '$lib/types/asset';
	import AssetItem from '$lib/components/home/asset-item.svelte';
	import DepositModal from '$lib/components/home/deposit-modal.svelte';
	import Modal from '$lib/components/common/modal/modal.svelte';
	import WithdrawModal from '$lib/components/home/withdraw-modal.svelte';
	import SearchBar from '$lib/components/base/search-bar.svelte';
	import { searchAssets } from '$lib/helpers/utils';
	import AssetList from '$lib/components/base/asset-list.svelte';
	import Search from '$lib/assets/search.svg?component';
	import AssetItemModal from '$lib/components/home/asset-item-modal.svelte';
	import { fade } from 'svelte/transition';
	import Empty from '$lib/components/base/empty.svelte';
	import LL from '$i18n/i18n-svelte';
	import Apps from '$lib/components/base/apps.svelte';
	import DepositPending from '$lib/components/base/deposit-pending.svelte';
	import { needConnectWallet } from '$lib/stores/ether';
	import DepositQrcodeModal from '$lib/components/home/deposit-qrcode-modal.svelte';

	let searchMode = false;
	const toggleSearchMode = () => (searchMode = !searchMode);
	let assetForModal: Asset | undefined = undefined;

	let depositSearchMode = false;
	const toggleDepositSearchMode = () => (depositSearchMode = !depositSearchMode);

	let withdrawSearchMode = false;
	const toggleWithdrawSearchMode = () => (withdrawSearchMode = !withdrawSearchMode);

	let depositQrcodeAsset: Asset | undefined = undefined;
	let depositAsset: Asset | undefined = undefined;
	let withdrawAsset: Asset | undefined = undefined;

	let keyword = '';
	$: filterAssets = searchAssets(keyword, $assets);

	let innerWidth = 0;

	$: isMd = innerWidth >= 720;
</script>

<svelte:window bind:innerWidth />

<Header>
	<Brand class="space-x-2 md:hidden" logoClass="w-6" MVMClass="text-lg" bridgeClass="hidden" />
	<UserInfo class="hidden md:flex" />

	<Apps />
	<DepositPending />
</Header>

<div
	class="flex flex-col items-center justify-center pt-4 md:items-start md:px-5 md:pt-10 lg:h-auto lg:flex-row lg:items-center lg:justify-between xl:px-16"
>
	<Balance />
	<div class="mt-6 w-full px-11 md:w-80 md:p-0">
		<div
			class={clsx(
				'grid h-12 w-full grid-cols-2 font-semibold shadow-sm child:space-x-2',
				'[&>svg]:child:inline-block',
				'child:flex child:items-center child:justify-center child:bg-white first:child:rounded-l-xl last:child:rounded-r-xl',
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
			<button on:click={needConnectWallet(toggleDepositSearchMode)}>
				<Send />
				<span>{$LL.deposit()}</span>
			</button>
			<button on:click={needConnectWallet(toggleWithdrawSearchMode)}>
				<Receive />
				<span>{$LL.withdraw()}</span>
			</button>
		</div>
	</div>
</div>

<div class="my-8 flex grow flex-col rounded-2xl bg-white last:child:rounded-b-2xl md:mx-5 xl:mx-16">
	<div class="flex h-14 items-center justify-between px-5 text-lg font-semibold">
		<div>{$LL.assets()}</div>
		<div class="relative grow child:absolute child:top-0 child:bottom-0 child:right-0">
			{#if searchMode}
				<SearchBar
					bind:keyword
					cancelable={true}
					on:click={() => {
						toggleSearchMode();
						keyword = '';
					}}
					class="hidden !p-0 md:flex"
				/>
			{/if}
			{#if !searchMode || !isMd}
				<button
					class="flex items-center bg-transparent"
					on:click={toggleSearchMode}
					transition:fade|local
					><div class="pr-3 font-semibold text-black opacity-20">{$LL.searchBar.title()}</div>
					<Search />
				</button>
			{/if}
		</div>
	</div>

	{#each filterAssets ?? [] as asset (asset.asset_id)}
		<AssetItem
			{asset}
			onClick={(asset) => (assetForModal = asset)}
			onDeposit={(asset) => (depositQrcodeAsset = asset)}
			onWithdraw={(asset) => (withdrawAsset = asset)}
		/>
	{/each}

	{#if !filterAssets.length}
		<Empty />
	{/if}
</div>

{#if depositAsset}
	<Modal
		modal-opened={!!depositAsset}
		this={DepositModal}
		asset={depositAsset}
		modal-on-close={() => (depositAsset = undefined)}
	/>
{/if}

{#if withdrawAsset}
	<Modal
		modal-opened={!!withdrawAsset}
		this={WithdrawModal}
		asset={withdrawAsset}
		modal-on-close={() => (withdrawAsset = undefined)}
	/>
{/if}

<Modal
	modal-opened={searchMode && !isMd}
	this={AssetList}
	modal-on-close={toggleSearchMode}
	onSelect={(asset) => (assetForModal = asset)}
/>

<Modal
	modal-opened={depositSearchMode}
	this={AssetList}
	modal-on-close={toggleDepositSearchMode}
	onSelect={(asset) => (depositQrcodeAsset = asset)}
/>

<Modal
	modal-opened={withdrawSearchMode}
	this={AssetList}
	modal-on-close={toggleWithdrawSearchMode}
	onSelect={(asset) => (withdrawAsset = asset)}
/>

{#if depositQrcodeAsset}
	<Modal
		modal-opened={!!depositQrcodeAsset}
		asset={depositQrcodeAsset}
		this={DepositQrcodeModal}
		modal-on-close={() => (depositQrcodeAsset = undefined)}
		onDeposit={() => (depositAsset = depositQrcodeAsset)}
	/>
{/if}

{#if assetForModal}
	<Modal
		modal-opened={!!assetForModal}
		this={AssetItemModal}
		modal-on-close={() => (assetForModal = undefined)}
		asset={assetForModal}
		onDeposit={() => {
			depositQrcodeAsset = assetForModal;
			assetForModal = undefined;
		}}
		onWithdraw={() => {
			withdrawAsset = assetForModal;
			assetForModal = undefined;
		}}
	/>
{/if}
