<script context="module" lang="ts">
	import clsx from 'clsx';
	import Brand from '$lib/components/brand.svelte';
	import Header from '$lib/components/header.svelte';
	import Helper from '$lib/assets/helper.svg?component';
	import UserInfo from '$lib/components/user-info.svelte';
	import Balance from '$lib/components/balance.svelte';
	import Send from '$lib/assets/send.svg?component';
	import Receive from '$lib/assets/receive.svg?component';
	import { assets } from '$lib/stores/model';
	import type { Load } from '@sveltejs/kit';
	import type { Asset } from '$lib/types/asset';
	import AssetItem from '$lib/components/asset-item.svelte';
	import { browser } from '$app/env';
	import { fetchAssets } from '$lib/helpers/api';
	import { derived, get } from '@square/svelte-store';
	import { page } from '$app/stores';
	import DepositModal from './index-modal/_deposit-modal.svelte';
	import { goto } from '$app/navigation';
	import { ETH_ASSET_ID } from '../lib/constants/common';
	import Modal from '$lib/components/common/modal/modal.svelte';
	import WithdrawModal from './index-modal/_withdraw-modal.svelte';

	export type Mode = 'deposit' | 'withdraw';
	export const MODE_KEY = 'mode';
	export const DEPOSIT_MODE_KEY = 'deposit-mode';
	export type DepositMode = 'qrcode' | 'metamask';
	export const ASSET_KEY = 'asset';

	export const selectedAsset = derived([page, assets], ([$page, $assets]) => {
		const assetId = $page.url.searchParams.get(ASSET_KEY);
		const asset = $assets.find((a) => a.asset_id === assetId);
		return asset;
	});

	export const mode = derived(page, ($page) => {
		const mode = $page.url.searchParams.get(MODE_KEY);
		return (mode === 'withdraw' ? 'withdraw' : 'deposit') as Mode;
	});

	export const defaultDepositMode = derived([mode, selectedAsset], ([$mode, $selectedAsset]) => {
		if ($mode === 'withdraw') return;
		if (!$selectedAsset) return;
		return $selectedAsset.chain_id === ETH_ASSET_ID ? 'metamask' : 'qrcode';
	});

	export const load: Load = async ({ fetch }) => {
		if (browser && get(assets)?.length) {
			fetchAssets(fetch).then((a) => assets.set(a));
			return;
		}

		const a = await fetchAssets(fetch);

		return { props: { a } };
	};
</script>

<script lang="ts">
	export let a: Asset[] | undefined = undefined;

	$: a && assets.set(a);

	$: if (browser) {
		if ($selectedAsset) {
			$page.url.searchParams.set(ASSET_KEY, $selectedAsset.asset_id);
		} else {
			$page.url.searchParams.delete(ASSET_KEY);
		}
		goto($page.url.href, { keepfocus: true, replaceState: true, noscroll: true });
	}

	const closeModal = () => {
		$page.url.searchParams.delete(ASSET_KEY);
		$page.url.searchParams.delete(MODE_KEY);
		$page.url.searchParams.delete(DEPOSIT_MODE_KEY);

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
				'[&>*:nth-child(n+2)]:before:opacity-20',
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
