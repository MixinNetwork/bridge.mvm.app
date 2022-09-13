<script lang="ts">
	import clsx from 'clsx';
	import Brand from '$lib/components/base/brand.svelte';
	import Header from '$lib/components/base/header.svelte';
	import Helper from '$lib/assets/helper.svg?component';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import Balance from '$lib/components/home/balance.svelte';
	import Send from '$lib/assets/send.svg?component';
	import Receive from '$lib/assets/receive.svg?component';
	import { assets } from '$lib/stores/model';
	import type { Asset } from '$lib/types/asset';
	import AssetItem from '$lib/components/home/asset-item.svelte';
	import { page } from '$app/stores';
	import DepositModal from '$lib/components/home/deposit-modal.svelte';
	import { goto } from '$app/navigation';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import Modal from '$lib/components/common/modal/modal.svelte';
	import WithdrawModal from '$lib/components/home/withdraw-modal.svelte';
	import { setSearchParam } from '$lib/helpers/app-store';
	import {
		ASSET_KEY,
		DEPOSIT_MODE_KEY,
		mode,
		MODE_KEY,
		selectedAsset
	} from '$lib/components/home/export';
	import { browser } from '$app/environment';

	let a: Asset[] | undefined = $page.data.assets;

	$: a && !$assets.length && assets.set(a);

	$: if (browser && $page.url.pathname === '/') {
		setSearchParam($page, ASSET_KEY, $selectedAsset?.asset_id);
		goto($page.url.href, { keepfocus: true, replaceState: true, noscroll: true });
	}

	const closeModal = () => {
		setSearchParam($page, ASSET_KEY, undefined);
		setSearchParam($page, MODE_KEY, undefined);
		setSearchParam($page, DEPOSIT_MODE_KEY, undefined);

		goto($page.url.href, { keepfocus: true, replaceState: true, noscroll: true });
	};
</script>

<Header>
	<Brand class="space-x-2 md:hidden" logoClass="w-6" MVMClass="text-lg" bridgeClass="hidden" />
	<a href="/" class="md:hidden">
		<Helper />
	</a>
	<UserInfo class="hidden md:flex" />
</Header>

<div
	class="flex flex-col items-center justify-center pt-4 md:items-start md:px-5 md:pt-10 lg:mt-10 lg:h-auto lg:flex-row lg:items-center lg:justify-between xl:px-16"
>
	<Balance />
	<div class="mt-6 w-full px-11 md:w-80 md:p-0">
		<div
			class={clsx(
				'grid h-12 w-full grid-cols-2 shadow-sm font-semibold child:space-x-2',
				'[&>svg]:child:inline-block',
				'child:bg-white first:child:rounded-l-xl last:child:rounded-r-xl child:flex child:items-center child:justify-center',
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
			<a href={`/?${ASSET_KEY}=${ETH_ASSET_ID}&${MODE_KEY}=deposit&${DEPOSIT_MODE_KEY}=metamask`}>
				<svelte:component this={Send} />
				<span>Deposit</span>
			</a>
			<a href={`/?${ASSET_KEY}=${ETH_ASSET_ID}&${MODE_KEY}=withdraw`}>
				<svelte:component this={Receive} />
				<span>Withdraw</span>
			</a>
		</div>
	</div>
</div>

<div class="my-8 rounded-2xl bg-white last:child:rounded-b-2xl md:mx-5 xl:mx-16">
	<div class="px-5 py-4 text-lg font-semibold">Assets</div>

	{#each $assets ?? [] as asset (asset.asset_id)}
		<AssetItem {asset} />
	{/each}
</div>

<Modal
	isOpen={!!$selectedAsset && $mode === 'deposit'}
	content={DepositModal}
	on:close={closeModal}
/>

<Modal
	isOpen={!!$selectedAsset && $mode === 'withdraw'}
	content={WithdrawModal}
	on:close={closeModal}
/>