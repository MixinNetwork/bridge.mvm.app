<script context="module" lang="ts">
	const inputClasses =
		'font-semibold text-black text-opacity-80 placeholder-black placeholder-opacity-20';
</script>

<script lang="ts">
	import clsx from 'clsx';
	import type { Asset } from '$lib/types/asset';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import {
		AssetWithdrawalFee,
		updateAssets,
		buildBalanceStore,
		assets,
		userDestinations
	} from '$lib/stores/model';
	import { registerAndSave, user } from '$lib/stores/user';
	import { EOS_ASSET_ID, ETH_ASSET_ID, TRANSACTION_GAS } from '$lib/constants/common';
	import { bigGte, bigMul, format } from '$lib/helpers/big';
	import LogoCircle from '$lib/assets/logo/logo-circle.svg?component';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { library } from '$lib/stores/ether';
	import Paste from '$lib/assets/paste.svg?component';
	import { providerLogo, providerName } from '$lib/stores/provider';
	import { showToast } from '../common/toast/toast-container.svelte';
	import { tick } from 'svelte';
	import LL from '$i18n/i18n-svelte';
	import { getAsset } from '../../helpers/utils';
	import Info from '$lib/assets/info.svg?component';
	import Modal from '../common/modal/modal.svelte';
	import TipModal from '../base/tip-modal.svelte';
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';

	export let asset: Asset;
	export let depositMode: boolean;

	$: ethAsset = getAsset(ETH_ASSET_ID, $assets);

	$: assetId = asset.asset_id;

	let isEthChain = asset.chain_id === ETH_ASSET_ID;
	$: isEthChain = asset.chain_id === ETH_ASSET_ID;
	$: isEosChain = asset.chain_id === EOS_ASSET_ID;

	$: mainnetBalance = buildBalanceStore({ assetId, network: 'mainnet' });
	$: mvmBalance = buildBalanceStore({ assetId, network: 'mvm' });
	$: roundedMvmBalance = $mvmBalance
		? format({ n: $mvmBalance || 0 })
		: format({ n: asset.balance });

	$: fromBalance = depositMode ? $mainnetBalance : roundedMvmBalance;

	let amount: number | undefined | string;

	$: if (fromBalance && amount && bigGte(amount, fromBalance)) amount = fromBalance;

	let address = '';

	depositMode && (address = $user?.address || '');

	let memo = '';

	$: assetWithdrawalFee = AssetWithdrawalFee({
		asset_id: asset.asset_id,
		chain_id: asset.chain_id,
		destination: address || (isEthChain && $user?.address) || undefined,
		tag: memo
	});

	let loading = false;
	const transfer = async () => {
		if (!amount || !$library || !$user || !$assetWithdrawalFee || !$user) return;

		loading = true;

		if (!$user.contract) await registerAndSave($user.address);
		if (!$user.contract) return;

		const { deposit, withdraw } = await import('$lib/helpers/web3/common');

		try {
			const value = amount.toString();
			if (depositMode) {
				const destination = await userDestinations.fetchDestination(asset.asset_id);
				await deposit($library, asset, destination[0].destination, value);
				await updateAssets();
			} else {
				await withdraw(
					$library,
					asset,
					$user.contract,
					value,
					address || $user.address,
					memo,
					$assetWithdrawalFee
				);
				await updateAssets();
				await mvmBalance.reload?.();
				await tick();

				showToast('success', 'Successful');

				amount = '';
				address = '';
				memo = '';
			}
		} finally {
			loading = false;
		}
	};

	let l1GasModalOpened = false;
	let l2GasModalOpened = false;

	$: destination = $userDestinations.find(({ asset_id }) => asset_id === asset.chain_id)
		?.deposit_entries?.[0].destination;

	$: !destination && browser && userDestinations.fetchDestination(asset.chain_id);
</script>

<div class="mx-5 rounded-lg bg-white">
	<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
		<div>{$LL.from()}</div>
		<div class="flex items-center space-x-1">
			{#if depositMode}
				<div class=" h-4 w-4">
					{@html $providerLogo}
				</div>
			{:else}
				<LogoCircle height={16} width={16} />
			{/if}

			<div>{depositMode ? $providerName : 'MVM'}</div>
		</div>
	</div>
	<div class=" divide-y-2 divide-brand-background child:w-full">
		<SelectedAssetButton {asset} disabled={true}>
			{$LL.balanceOf(fromBalance ? format({ n: fromBalance }) : '...', '')}</SelectedAssetButton
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
		<div>{$LL.to()}</div>
		<div class="flex items-center space-x-1">
			{#if depositMode}
				<LogoCircle height={16} width={16} />
				<div>MVM</div>
			{:else}
				<img
					loading="lazy"
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
		<div
			class={clsx('break-all px-4 py-3 font-semibold', inputClasses, {
				'flex items-center justify-center': !destination
			})}
		>
			{#if destination}
				<div in:slide|local>{destination}</div>
			{:else}
				<Spinner size={24} class="stroke-brand-primary" />
			{/if}
		</div>
	{:else}
		<div class="flex border-b-2 border-brand-background">
			<textarea
				class={clsx('grow resize-none break-all rounded-lg py-3 pl-4 font-semibold', inputClasses)}
				placeholder={isEthChain ? $user?.address || '' : 'Address'}
				bind:value={address}
			/>
			{#if isEthChain}
				<button
					class="p-3"
					on:click={() => {
						address = $user?.address || '';
					}}
				>
					<div class="flex h-5 w-5 items-center justify-center">
						{@html $providerLogo}
					</div>
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
		class={clsx(
			'mx-5 mt-3 space-y-2 rounded-lg bg-black bg-opacity-5 p-4 text-xs font-semibold text-black text-opacity-50',
			'child:flex child:justify-between',
			'child:child:flex child:child:items-center child:child:space-x-1'
		)}
	>
		<div>
			<div>
				<div>
					{$LL.withdrawModal.l1Gas()}
				</div>
				<button
					class="tooltip hover:tooltip-open"
					data-tip={$LL.withdrawModal.l1GasTip()}
					on:click={() => {
						if (window.innerWidth > 720) return;
						l1GasModalOpened = true;
					}}
				>
					<Info />
				</button>
			</div>

			<div>
				{#if $assetWithdrawalFee}
					{$assetWithdrawalFee}
					{asset.symbol}
					(${format({ n: bigMul($assetWithdrawalFee, asset.price_usd), max_dp: 3 })})
				{:else}
					...
				{/if}
			</div>
		</div>
		<div>
			<div>
				<div>
					{$LL.withdrawModal.l2Gas()}
				</div>
				<button
					class="tooltip hover:tooltip-open"
					data-tip={$LL.withdrawModal.l2GasTip()}
					on:click={() => {
						if (window.innerWidth > 720) return;
						l2GasModalOpened = true;
					}}
				>
					<Info />
				</button>
			</div>

			<div>
				{#if ethAsset}
					{TRANSACTION_GAS} ETH (${format({
						n: bigMul(TRANSACTION_GAS, ethAsset?.price_usd),
						max_dp: 3
					})})
				{:else}
					...
				{/if}
			</div>
		</div>
	</div>
{/if}

<button
	class="mt-16 mb-6 flex min-w-[120px] justify-center self-center rounded-full bg-brand-primary px-6 py-4 text-white"
	on:click={transfer}
	disabled={!destination || (!isEthChain && !address) || !fromBalance || !amount || amount < 0.0001}
>
	{#if loading && !depositMode}
		<Spinner class="stroke-white stroke-2 text-center" />
	{:else}
		{depositMode ? ($providerName && $LL.depositFrom($providerName)) || '' : $LL.withdraw()}
	{/if}
</button>

<Modal
	this={TipModal}
	title={$LL.withdrawModal.l1Gas()}
	description={$LL.withdrawModal.l1GasTip()}
	modal-opened={l1GasModalOpened}
	modal-on-close={() => (l1GasModalOpened = false)}
/>
<Modal
	this={TipModal}
	title={$LL.withdrawModal.l2Gas()}
	description={$LL.withdrawModal.l2GasTip()}
	modal-opened={l2GasModalOpened}
	modal-on-close={() => (l2GasModalOpened = false)}
/>
