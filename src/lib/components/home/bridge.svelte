<script context="module" lang="ts">
	const inputClasses =
		'font-semibold text-black text-opacity-80 placeholder-black placeholder-opacity-20';
</script>

<script lang="ts">
	import clsx from 'clsx';
	import type { Asset } from '$lib/types/asset';
	import Eth from '$lib/assets/logo/eth.svg?component';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import { AssetWithdrawalFee, updateAssets, buildBalanceStore } from '$lib/stores/model';
	import { user } from '$lib/stores/user';
	import { EOS_ASSET_ID, ETH_ASSET_ID, TRANSACTION_GAS } from '$lib/constants/common';
	import { bigGte, format } from '$lib/helpers/big';
	import LogoCircle from '$lib/assets/logo/logo-circle.svg?component';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { library } from '$lib/stores/ether';
	import Paste from '$lib/assets/paste.svg?component';
	import { providerLogo, providerName } from '$lib/stores/provider';
	import { selectAsset } from './export';
	import { showToast } from '../common/toast/toast-container.svelte';
	import { tick } from 'svelte';
	import LL from '$i18n/i18n-svelte';

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
		: format({ n: asset.balance, dp: 8, fixed: true });

	$: fromBalance = depositMode ? $mainnetBalance : roundedMvmBalance;

	let amount: number | undefined | string;

	$: if (fromBalance && amount && bigGte(amount, fromBalance))
		amount = Number.parseFloat(fromBalance);

	let address = '';

	depositMode && (address = $user?.address || '');

	let memo = '';

	$: assetWithdrawalFee = AssetWithdrawalFee({
		asset_id: asset.asset_id,
		chain_id: asset.chain_id,
		destination: address || (isEthChain && $user.address) || undefined,
		tag: memo
	});

	let loading = false;
	const transfer = async () => {
		if (!amount || !$library || !$user || !$assetWithdrawalFee) return;

		loading = true;

		const { deposit, withdraw } = await import('$lib/helpers/web3/common');

		try {
			const value = amount.toString();
			if (depositMode) {
				await deposit($library, asset, value);
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
</script>

<div class="mx-5 rounded-lg bg-white">
	<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
		<div>{$LL.from()}</div>
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
		<SelectedAssetButton {asset} onSelect={selectAsset}>
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
			{$LL.withdrawModal.tips1($assetWithdrawalFee || '...', asset.symbol)}
		</div>
		<div>
			{$LL.withdrawModal.tips2(TRANSACTION_GAS)}
		</div>
	</div>
{/if}

<button
	class="mt-10 flex w-28 justify-center self-center rounded-full bg-brand-primary px-6 py-4 text-white"
	on:click={transfer}
	disabled={(!isEthChain && !address) || !fromBalance || !amount || amount < 0.0001}
>
	{#if loading && !depositMode}
		<Spinner class="stroke-white stroke-2 text-center" />
	{:else}
		{depositMode ? $LL.deposit() : $LL.withdraw()}
	{/if}
</button>
