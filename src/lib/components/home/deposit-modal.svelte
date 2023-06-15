<script lang="ts">
	import clsx from 'clsx';
	import type { Asset } from '$lib/types/asset';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import { updateAssets, userDestinations, buildBalanceStore } from '$lib/stores/model';
	import { registerAndSave, user } from '$lib/stores/user';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import { bigGt, bigLte, format } from '$lib/helpers/big';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { library } from '$lib/stores/ether';
	import { providerName } from '$lib/stores/provider';
	import { showToast } from '$lib/components/common/toast/toast-container.svelte';
	import LL from '$i18n/i18n-svelte';
	import { getDepositEntry, filterNumericInputEvent } from '$lib/helpers/utils';
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';
	import FullLayoutModal from '../base/modal/full-layout-modal.svelte';

	export let asset: Asset;
	export let close = () => {
		//
	};

	$: assetId = asset.asset_id;

	let isEthChain = asset.chain_id === ETH_ASSET_ID;
	$: isEthChain = asset.chain_id === ETH_ASSET_ID;

	$: mainnetBalance = buildBalanceStore({ assetId, network: 'mainnet' });
	$: roundedMainnetBalance = $mainnetBalance
		? format({
				n: $mainnetBalance,
				dp: 8,
				format: { groupSeparator: '' }
		  })
		: '0';

	$: fromBalance = roundedMainnetBalance;

	let amount = '';

	$: if (fromBalance && amount && bigGt(amount, fromBalance)) amount = fromBalance;

	$: address = $user?.address || '';

	$: destination = getDepositEntry(
		asset.chain_id,
		$userDestinations.find(({ asset_id }) => asset_id === asset.chain_id)?.deposit_entries
	)?.destination;

	$: !destination && browser && userDestinations.fetchDestination(asset.chain_id);

	$: submitDisabled =
		!destination || (!isEthChain && !address) || !fromBalance || !amount || bigLte(amount, 0);

	let loading = false;
	const transfer = async () => {
		if (loading) return;
		try {
			if (!amount || !$library || !$user) throw new Error('No amount or library or user');

			loading = true;

			if (!$user.contract) await registerAndSave($user.address);
			if (!$user.contract) throw new Error('No contract');

			const { deposit } = await import('$lib/helpers/web3/common');

			const value = amount.toString();
			const destination = await userDestinations.fetchDestination(asset.asset_id);
			await deposit($library, asset, destination[0].destination, value);
			await updateAssets();
			showToast('success', $LL.successful());
			close();
		} catch (e) {
			console.error('transfer error', JSON.stringify(e, null, 2));

			if (e && typeof e === 'object') {
				if ('code' in e && e.code === 'ACTION_REJECTED') return;
				if ('reason' in e && e.reason) {
					showToast('common', `${e.reason}`);
					return;
				} else if ('message' in e && e.message) {
					showToast('common', `${e.message}`);
					return;
				}
			}

			showToast('common', $LL.error.tips());
		} finally {
			loading = false;
		}
	};

	const inputClasses =
		'font-semibold text-black text-opacity-80 placeholder-black placeholder-opacity-20';
</script>

<FullLayoutModal on:click={close}>
	<div slot="title">{$LL.depositModal.title(asset.symbol)}</div>

	<div class="flex grow flex-col items-stretch overflow-y-auto">
		<div class="mx-5 rounded-lg bg-white">
			<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
				<div>{$LL.from()}</div>
			</div>
			<div class=" divide-y-2 divide-brand-background child:w-full">
				<SelectedAssetButton {asset} disabled={true}>
					{$LL.balanceOf(
						fromBalance ? format({ n: fromBalance, dp: 8, mode: 1 }) : '...',
						''
					)}</SelectedAssetButton
				>
				<div class="flex flex-row items-center">
					<input
						class={clsx('grow rounded-b-lg px-4 py-6', inputClasses)}
						placeholder="Amount"
						type="number"
						spellcheck="false"
						on:input={(e) => filterNumericInputEvent(e, amount)}
						bind:value={amount}
						max={fromBalance}
					/>
					<button
						class="p-4 text-sm font-semibold text-brand-primary"
						on:click={() => {
							amount = format({ n: fromBalance, dp: 8, mode: 1 });
						}}>{$LL.max()}</button
					>
				</div>
			</div>
		</div>

		<div class=" mx-5 mt-3 rounded-lg bg-white">
			<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
				<div>{$LL.to()}</div>
			</div>
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
		</div>

		<button
			class="mt-16 mb-6 flex min-w-[120px] justify-center self-center rounded-full bg-brand-primary px-6 py-4 text-white"
			on:click={transfer}
			disabled={submitDisabled}
		>
			{#if loading}
				<Spinner class="stroke-white stroke-2 text-center" />
			{:else}
				{($providerName && $LL.depositFrom($providerName)) || ''}
			{/if}
		</button>
	</div>
</FullLayoutModal>
