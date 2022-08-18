<script context="module" lang="ts">
	import { ethers } from 'ethers';
	import type { Load } from '@sveltejs/kit';
	import { assets } from '$lib/stores/model';
	import { user } from '$lib/stores/user';
	import type { Asset } from '$lib/types/asset';
	import Header from '$lib/components/header.svelte';
	import Helper from '$lib/assets/helper.svg?component';
	import UserInfo from '$lib/components/user-info.svelte';
	import { page } from '$app/stores';
	import Arrow from '$lib/assets/arrow.svg?component';
	import LogoCircle from '$lib/assets/logo/logo-circle.svg?component';
	import Eth from '$lib/assets/logo/eth.svg?component';
	import AssetIcon from '$lib/components/asset-icon.svelte';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import { asyncDerived, get } from '@square/svelte-store';
	import { getBalance, getERC20Balance, deposit } from '$lib/helpers/web3/common';
	import type { Network } from '$lib/types/network';
	import { bigGte } from '$lib/helpers/big';
	import AssetList from './_asset-list.svelte';
	import Erc20Label from '$lib/components/erc20-label.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import Faq from './_faq.svelte';
	import { registryContract, switchMainnet, switchMVM } from '$lib/stores/services/ether';
	import Modal from '$lib/components/common/modal/modal.svelte';
	import SpinnerModal from '$lib/components/common/spinner-modal.svelte';
	import { account, provider, library } from '$lib/stores/ether';
	import { fetchAssets } from '$lib/helpers/api';

	export type Mode = 'deposit' | 'withdraw';
	export const MODE_KEY = 'mode';
	export const ASSET_KEY = 'asset';

	export const load: Load = async ({ fetch }) => {
		if (browser && get(assets)?.length) return;

		const a = await fetchAssets(fetch);

		return { props: { a } };
	};

	const buildBalanceStore = ({ assetId, network }: { assetId: string; network: Network }) => {
		return asyncDerived([assets, user], async ([$assets, $user]) => {
			if (!$user) return undefined;

			if (assetId === ETH_ASSET_ID)
				return getBalance({
					account: $user.address,
					network
				});

			const asset = $assets.find((a) => a.asset_id === assetId);
			const contract = network === 'mvm' ? asset?.contract : asset?.asset_key;
			if (!contract) return undefined;

			return getERC20Balance({
				account: $user.address,
				contractAddress: contract,
				network
			});
		});
	};
</script>

<script lang="ts">
	export let a: Asset[] | undefined = undefined;

	let assetId = $page.url.searchParams.get(ASSET_KEY);
	let mode = $page.url.searchParams.get(MODE_KEY) || 'deposit';
	$: depositMode = mode !== 'withdraw';

	let openedSelectModal = false;
	const toggle = () => (openedSelectModal = !openedSelectModal);

	$: a && assets.set(a);

	let asset: Asset;
	$: if ((asset || mode) && browser) {
		asset && $page.url.searchParams.set(ASSET_KEY, asset.asset_id);
		mode && $page.url.searchParams.set(MODE_KEY, mode);

		goto($page.url.href, { keepfocus: true, replaceState: true, noscroll: true });
	}

	const updateAsset = (event: CustomEvent<Asset>) => {
		asset = event.detail;
	};

	$: if (!asset) asset = $assets.find(({ asset_id }) => asset_id === assetId) || $assets[0];

	$: mainnetBalance = buildBalanceStore({ assetId: asset.asset_id, network: 'mainnet' });
	$: mvmBalance = buildBalanceStore({ assetId: asset.asset_id, network: 'mvm' });

	$: cacheMvmBalance = $mainnetBalance || asset.balance;

	$: fromBalance = depositMode ? $mainnetBalance : cacheMvmBalance;
	$: toBalance = depositMode ? cacheMvmBalance : $mainnetBalance;

	let amount: number | undefined | string;

	$: if (fromBalance && amount && bigGte(amount, fromBalance)) amount = fromBalance;

	let loading = false;
	const transfer = async () => {
		if (!amount) return;

		loading = true;

		try {
			// contract
			$registryContract;
			// current provider
			$provider;
			// current wallet address
			$account;

			const transferAmount = typeof amount === 'string'
				? ethers.utils.parseEther(amount)
				: ethers.utils.parseEther(amount.toString());

			if (depositMode) {
				await switchMainnet();
				await deposit($library, asset.destination, transferAmount);
			} else {
				await switchMVM();
				// todo withdraw
			}
		} finally {
			loading = false;
		}
	};
</script>

<Header>
	<div class="md:hidden">Bridge</div>
	<a href="/" class="md:hidden">
		<Helper />
	</a>
	<UserInfo class="hidden md:flex" />
</Header>

<div
	class="mx-5 mt-2 flex flex-col items-center space-y-14 md:mt-9 lg:flex-row lg:items-start lg:justify-center lg:space-y-0 lg:space-x-5"
>
	<div class="flex flex-col items-stretch justify-center space-y-3 md:w-[335px]">
		<div
			class="mb-4 grid grid-cols-2 rounded-lg bg-black bg-opacity-5 p-1 text-center text-sm font-bold leading-7 child:!opacity-100 descendant:transition-all"
		>
			<label class="relative">
				<input type="radio" class="peer hidden" value="deposit" bind:group={mode} />
				<div
					class=" absolute inset-0 -z-10 h-full w-full translate-x-full rounded-lg bg-white peer-checked:translate-x-0"
				/>

				<div
					class="h-full text-black opacity-50 peer-checked:text-brand-primary peer-checked:opacity-100"
				>
					Deposit
				</div>
			</label>

			<label>
				<input type="radio" class="peer hidden" value="withdraw" bind:group={mode} />
				<div class="text-black opacity-50 peer-checked:text-brand-primary peer-checked:opacity-100">
					Withdraw
				</div>
			</label>
		</div>
		<!-- from -->
		<div class=" rounded-xl bg-white">
			<div class="flex items-center justify-between space-x-2 p-4 font-semibold">
				<div class="text-sm">From</div>
				<div class=" text-xs opacity-50">Balance: {fromBalance ?? '...'} {asset.symbol}</div>
			</div>
			<div class="flex shrink flex-row">
				<button
					class=" flex shrink-0 items-center space-x-3 px-4 py-3 text-start"
					on:click={toggle}
				>
					<AssetIcon
						assetIconUrl={asset.icon_url}
						assetName={asset.name}
						chainIconUrl={asset.chain_icon_url}
						chainName={asset.chain_name}
					/>
					<div>
						<div class="font-bold">
							{asset.symbol}
							{#if asset.chain_id === ETH_ASSET_ID}
								<Erc20Label />
							{/if}
						</div>
						<div class="text-sm font-semibold opacity-30">{asset.name}</div>
					</div>
					<Arrow class="rotate-90" />
				</button>
				<input
					type="number"
					placeholder="0.00"
					class="w-full grow rounded-br-xl p-2 text-end font-bold"
					bind:value={amount}
					max={fromBalance}
				/>
			</div>
		</div>
		<!-- to -->
		<div class=" rounded-xl bg-white p-4">
			<div class="flex items-center justify-between space-x-2 font-semibold">
				<div class="text-sm">To</div>
				<div class=" text-xs opacity-50 ">Balance: {toBalance ?? '...'} {asset.symbol}</div>
			</div>
			<div class="my-6 flex w-fit items-center space-x-3 font-bold">
				{#if depositMode}
					<LogoCircle width="40" height="40" />
				{:else}
					<Eth width="40" height="40" />
				{/if}

				<div>{depositMode ? 'MVM' : 'Ethereum Chain'}</div>
			</div>
			<div class=" text-sm font-semibold opacity-50">Receive: {amount ?? 0} {asset.symbol}</div>
		</div>

		<button
			class="!mt-12 self-center rounded-full bg-brand-primary py-4 px-6 font-semibold text-white"
			disabled={!amount && !!mvmBalance}
			on:click={transfer}>Transfer</button
		>
	</div>

	<Faq />
</div>

<Modal
	isOpen={openedSelectModal}
	class="!items-end md:!items-center"
	content={AssetList}
	on:close={toggle}
	on:callback={updateAsset}
/>

<Modal isOpen={loading} content={SpinnerModal} maskClosable={false} keyboardClosable={false} />
