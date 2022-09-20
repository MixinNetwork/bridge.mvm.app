<script context="module" lang="ts">
	const inputClasses =
		'font-semibold text-black text-opacity-80 placeholder-black placeholder-opacity-20';
</script>

<script lang="ts">
	import clsx from 'clsx';
	import type { Asset } from '$lib/types/asset';
	import Eth from '$lib/assets/logo/eth.svg?component';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import { asyncDerived } from '@square/svelte-store';
	import { assets, AssetWithdrawalFee } from '$lib/stores/model';
	import { user } from '$lib/stores/user';
	import { EOS_ASSET_ID, ETH_ASSET_ID, TRANSACTION_GAS } from '$lib/constants/common';
	import { getBalance, getERC20Balance } from '$lib/helpers/web3/common';
	import type { Network } from '$lib/types/network';
	import { bigGte, format } from '$lib/helpers/big';
	import LogoCircle from '$lib/assets/logo/logo-circle.svg?component';
	import Modal from '$lib/components/common/modal/modal.svelte';
	import SpinnerModal from '$lib/components/common/spinner-modal.svelte';
	import { library } from '$lib/stores/ether';
	import Paste from '$lib/assets/paste.svg?component';
	import { providerLogo, providerName } from '$lib/stores/provider';
	import { selectAsset } from './export';
	import { showToast } from "../common/toast/toast-container.svelte";

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

			const balance = await getERC20Balance({
				account: $user.address,
				contractAddress: contract,
				network
			});

			return format({ n: balance, dp: 8, fixed: true });
		});
	};

	export let asset: Asset;
	export let depositMode: boolean;

	$: assetId = asset.asset_id;

	let isEthChain = asset.chain_id === ETH_ASSET_ID;
	$: isEthChain = asset.chain_id === ETH_ASSET_ID;
	$: isEosChain = asset.chain_id === EOS_ASSET_ID;

	$: mainnetBalance = buildBalanceStore({ assetId, network: 'mainnet' });
	$: mvmBalance = buildBalanceStore({ assetId, network: 'mvm' });
	$: roundedMvmBalance = $mvmBalance
		? format({ n: $mvmBalance || 0, dp: 8, fixed: true })
		: undefined;

	$: cacheMvmBalance = roundedMvmBalance || format({ n: asset.balance, dp: 8, fixed: true });

	$: fromBalance = depositMode ? $mainnetBalance : cacheMvmBalance;

	let amount: number | undefined | string;

	$: if (fromBalance && amount && bigGte(amount, fromBalance))
		amount = Number.parseFloat(fromBalance);

	let address = '';

	depositMode && (address = $user?.address || '');

	let memo = '';

	$: assetWithdrawalFee = AssetWithdrawalFee({
		asset_id: asset.asset_id,
		chain_id: asset.chain_id,
		destination: address || (isEthChain && $user.address) || undefined
	});

	$: isGteFee =
		!depositMode && amount && $assetWithdrawalFee && bigGte(amount, $assetWithdrawalFee);

	let loading = false;
	const transfer = async () => {
		if (!amount || !$library || !$user || !$assetWithdrawalFee) return;
		if (!depositMode && !isGteFee) return;

		loading = true;

		const { deposit, withdraw } = await import('$lib/helpers/web3/common');

		try {
			const value = amount.toString();
			if (depositMode) {
				await deposit($library, asset, value);
			} else {
				await withdraw($library, asset, $user.contract, value, address, memo, $assetWithdrawalFee);
				showToast('success', 'Successful');
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="mx-5 rounded-lg bg-white">
	<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
		<div>From</div>
		<div class="flex items-center space-x-1">
			{#if depositMode}
				<Eth height={16} width={16} />
			{:else}
				<LogoCircle height={16} width={16} />
			{/if}

			<div>{depositMode ? 'Etheruem' : 'MVM'}</div>
		</div>
	</div>
	<div class=" divide-y-2 divide-brand-background child:w-full">
		<SelectedAssetButton {asset} onSelect={selectAsset}
			>Balance: {fromBalance ? format({ n: fromBalance }) : '...'}</SelectedAssetButton
		>
		<input
			class={clsx('rounded-b-lg  px-4 py-6', inputClasses)}
			placeholder="Amount"
			type="number"
			bind:value={amount}
			max={fromBalance}
		/>
	</div>
</div>

<div class=" mx-5 mt-3 rounded-lg bg-white">
	<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
		<div>To</div>
		<div class="flex items-center space-x-1">
			{#if depositMode}
				<LogoCircle height={16} width={16} />
				<div>MVM</div>
			{:else}
				<img
					src={asset.chain_icon_url || asset.icon_url}
					width={16}
					height={16}
					alt={asset.chain_name || asset.name}
				/>
				<div>{asset.chain_name || asset.name}</div>
			{/if}
		</div>
	</div>
	{#if depositMode}
		<div class={clsx('break-all px-4 py-3 font-semibold', inputClasses)}>
			{asset.destination}
		</div>
	{:else}
		<div class="flex border-b-2 border-brand-background">
			<textarea
				class={clsx('grow resize-none break-all rounded-lg py-3 pl-4 font-semibold', inputClasses)}
				placeholder={isEthChain ? $user.address || '' : 'Address'}
				bind:value={address}
			/>
			{#if isEthChain}
				<button
					class="p-3"
					on:click={() => {
						address = $user?.address || '';
					}}
				>
					<img src={$providerLogo} width={18} height={18} alt={$providerName} />
				</button>
			{/if}
			<button
				class="p-3"
				on:click={async () => {
					address = await navigator.clipboard.readText();
				}}
			>
				<Paste />
			</button>
		</div>
		{#if isEosChain}
			<div class="flex">
				<textarea
					class={clsx(
						'grow resize-none break-all rounded-lg py-3 pl-4 font-semibold ',
						inputClasses
					)}
					placeholder="Memo/Tag (Optional)"
					bind:value={memo}
				/>
				<button
					class="p-3"
					on:click={async () => {
						memo = await navigator.clipboard.readText();
					}}
				>
					<Paste />
				</button>
			</div>
		{/if}
	{/if}
</div>

{#if !depositMode}
	<div
		class="mx-5 mt-3 space-y-2 rounded-lg bg-black bg-opacity-5 p-4 text-xs font-semibold text-black text-opacity-50"
	>
		<div>
			Withdrawal fee: {$assetWithdrawalFee || '...'}
			{asset.symbol}
		</div>
		<div>
			Gas fee: {TRANSACTION_GAS} ETH
		</div>
	</div>
{/if}

<button
	class="mt-10 self-center rounded-full bg-brand-primary px-6 py-4 text-white"
	on:click={transfer}
	disabled={(!isEthChain && !address) ||
		!fromBalance ||
		!amount ||
		amount < 0.0001 ||
		(!depositMode && !isGteFee)}>{depositMode ? 'Deposit' : 'Withdraw'}</button
>

<Modal
	modal-opened={loading}
	this={SpinnerModal}
	modal-mask-closeable={false}
	modal-keyboard-closeable={false}
/>
