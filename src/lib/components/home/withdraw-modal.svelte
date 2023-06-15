<script lang="ts">
	import FullLayoutModal from '$lib/components/base/modal/full-layout-modal.svelte';
	import clsx from 'clsx';
	import type { Asset } from '$lib/types/asset';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import { updateAssets, assets, userDestinations, buildBalanceStore } from '$lib/stores/model';
	import { registerAndSave, user } from '$lib/stores/user';
	import { EOS_ASSET_ID, ETH_ASSET_ID, TRANSACTION_GAS } from '$lib/constants/common';
	import { bigAdd, bigGt, bigMul, format } from '$lib/helpers/big';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { library } from '$lib/stores/ether';
	import Paste from '$lib/assets/paste.svg?component';
	import { providerLogo } from '$lib/stores/provider';
	import { showToast } from '$lib/components/common/toast/toast-container.svelte';
	import { tick } from 'svelte';
	import LL from '$i18n/i18n-svelte';
	import {
		getAsset,
		getDepositEntry,
		filterNumericInputEvent,
		getChainLabel
	} from '$lib/helpers/utils';
	import Info from '$lib/assets/info.svg?component';
	import Warning from '$lib/assets/warning.svg?component';
	import Modal from '$lib/components/common/modal/modal.svelte';
	import TipModal from '$lib/components/base/tip-modal.svelte';
	import { browser } from '$app/environment';
	import { asyncReadable, type Loadable } from '@square/svelte-store';
	import type { fetchAssetWithdrawalFee } from '$lib/helpers/web3/common';
	import autosize from '$lib/helpers/actions/autosize';
	import { debounce } from 'lodash-es';
	import { InvalidFormatError } from '$lib/helpers/errors';
	import { AxiosError } from 'axios';

	export let asset: Asset;
	export let close = () => {
		//
	};

	$: ethAsset = getAsset(ETH_ASSET_ID, $assets);

	$: assetId = asset.asset_id;
	$: chainLabel = getChainLabel(assetId, asset.chain_id);

	let isEthChain = asset.chain_id === ETH_ASSET_ID;
	$: isEthChain = asset.chain_id === ETH_ASSET_ID;
	$: isEosChain = asset.chain_id === EOS_ASSET_ID;

	$: mvmBalance = buildBalanceStore({ assetId, network: 'mvm' });
	$: roundedMvmBalance = $mvmBalance
		? format({ n: $mvmBalance, dp: 8, format: { groupSeparator: '' } })
		: format({ n: asset.balance, dp: 8, format: { groupSeparator: '' } });

	$: fromBalance = roundedMvmBalance;

	let amount = '';

	$: if (fromBalance && amount && bigGt(amount, fromBalance)) amount = fromBalance;

	let address = '';

	let assetWithdrawalFeeLoadable:
		| Loadable<{ data: string | undefined; error: undefined } | { data: undefined; error: any }>
		| undefined;
	$: assetWithdrawalFeeState = assetWithdrawalFeeLoadable?.state;

	$: isLoadingAssetWithdrawalFee =
		$assetWithdrawalFeeState?.isLoading ||
		$assetWithdrawalFeeState?.isPending ||
		$assetWithdrawalFeeState?.isReloading;

	$: assetWithdrawalFee = $assetWithdrawalFeeLoadable?.data;
	$: assetWithdrawalFeeError = !isLoadingAssetWithdrawalFee && $assetWithdrawalFeeLoadable?.error;

	$: isInvalidAddressFormatError =
		assetWithdrawalFeeError && assetWithdrawalFeeError instanceof InvalidFormatError;
	$: isFetchFeeError = assetWithdrawalFeeError && assetWithdrawalFeeError instanceof AxiosError;

	const debounceAssetWithdrawalFee = debounce<
		(key: Parameters<typeof fetchAssetWithdrawalFee>[0] | undefined) => void
	>((value) => {
		if (value)
			assetWithdrawalFeeLoadable = asyncReadable(
				{ data: undefined },
				async () => {
					try {
						const { fetchAssetWithdrawalFee } = await import('$lib/helpers/web3/common');
						const data = await fetchAssetWithdrawalFee(value);
						return { data };
					} catch (error) {
						if (error instanceof InvalidFormatError) return { error };
						return { error };
					}
				},
				{
					reloadable: true,
					trackState: true
				}
			);
		else assetWithdrawalFeeLoadable = undefined;
	}, 250);

	let memo = '';

	$: debounceAssetWithdrawalFee({
		asset_id: asset.asset_id,
		chain_id: asset.chain_id,
		destination: address || undefined,
		tag: memo
	});

	$: destination = getDepositEntry(
		asset.chain_id,
		$userDestinations.find(({ asset_id }) => asset_id === asset.chain_id)?.deposit_entries
	)?.destination;

	$: !destination && browser && userDestinations.fetchDestination(asset.chain_id);

	$: submitDisabled =
		!destination ||
		!address ||
		!fromBalance ||
		!amount ||
		!assetWithdrawalFee ||
		bigGt(bigAdd(amount, assetWithdrawalFee), fromBalance);

	let loading = false;
	const transfer = async () => {
		if (loading) return;
		try {
			if (!amount || !$library || !$user) throw new Error('No amount or library or user');

			loading = true;

			if (!$user.contract) await registerAndSave($user.address);
			if (!$user.contract) throw new Error('No contract');

			const { withdraw } = await import('$lib/helpers/web3/common');

			const value = amount.toString();

			if (!assetWithdrawalFee) throw new Error('No withdrawal fee');

			await withdraw(
				$library,
				asset,
				$user.contract,
				value,
				address || $user.address,
				memo,
				assetWithdrawalFee
			);
			await updateAssets();
			await mvmBalance.reload?.();
			await tick();

			amount = '';
			address = '';
			memo = '';

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

	let l1GasModalOpened = false;
	let l2GasModalOpened = false;

	let addressTextArea: Element | undefined;
	let memoTextarea: Element | undefined;

	const inputClasses =
		'font-semibold text-black text-opacity-80 placeholder-black placeholder-opacity-20';
</script>

<FullLayoutModal on:click={close}>
	<div slot="title">{$LL.withdraw()}</div>
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
			<div class="flex border-b-2 border-brand-background pb-6">
				<textarea
					class={clsx(
						'h-12 grow resize-none break-all rounded-lg py-3 pl-4 font-semibold',
						inputClasses
					)}
					placeholder={$LL.address()}
					bind:value={address}
					use:autosize
					bind:this={addressTextArea}
				/>
				{#if isEthChain}
					<button
						class="p-3"
						on:click={async () => {
							address = $user?.address || '';
							await tick();
							addressTextArea && autosize.update(addressTextArea);
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
						bind:this={memoTextarea}
						use:autosize
					/>
					<button
						class="p-3"
						on:click={async () => {
							memo = await navigator.clipboard.readText();
							await tick();
							memoTextarea && autosize.update(memoTextarea);
						}}
					>
						<Paste />
					</button>
				</div>
			{/if}
		</div>

		{#if assetWithdrawalFeeError}
			<div class="mx-5 mt-3 rounded-lg bg-red-500 bg-opacity-10 p-3 text-sm font-normal">
				<div class=" grid grid-cols-[auto,1fr] gap-x-2 gap-y-4">
					<Warning />
					<div class="text-red-500">
						{#if isFetchFeeError}
							{$LL.withdrawModal.fetchFeeError()}
						{:else if isInvalidAddressFormatError}
							{$LL.invalidAddressFormatError()}
						{:else}
							{$LL.withdrawModal.otherError(
								`${asset.symbol}${chainLabel ? `(${chainLabel})` : ''}`
							)}
						{/if}
					</div>

					<div class="col-start-2 text-start text-primary">
						{#if isFetchFeeError || isInvalidAddressFormatError}
							<button
								on:click={() => {
									assetWithdrawalFeeLoadable?.reload?.();
								}}
							>
								{$LL.retry()}
							</button>
						{:else}
							<a href="https://mixin.one/messenger" target="_blank" rel="noreferrer">
								{$LL.downloadMixinMessenger()}
							</a>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<div
				class="mx-5 mt-3 rounded-lg bg-black bg-opacity-5 p-4 text-xs font-semibold text-black text-opacity-50"
			>
				<div
					class="space-y-2 child:flex child:child:flex child:child:items-center child:justify-between child:child:space-x-1"
				>
					<div>
						<div>
							<div>
								{$LL.withdrawModal.l1Gas()}
							</div>
							<button
								class="tooltip hover:tooltip-open md:active:pointer-events-none"
								data-tip={$LL.withdrawModal.l1GasTip()}
								on:click={() => (l1GasModalOpened = true)}
							>
								<Info />
							</button>
						</div>

						<div>
							{#if assetWithdrawalFee}
								{assetWithdrawalFee}
								{asset.symbol}
								(${format({ n: bigMul(assetWithdrawalFee, asset.price_usd), dp: 3 })})
							{:else if isLoadingAssetWithdrawalFee}
								<Spinner size={16} class="stroke-brand-primary" />
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
								class="tooltip hover:tooltip-open md:active:pointer-events-none"
								data-tip={$LL.withdrawModal.l2GasTip()}
								on:click={() => (l2GasModalOpened = true)}
							>
								<Info />
							</button>
						</div>

						<div>
							{#if ethAsset}
								{TRANSACTION_GAS} ETH (${format({
									n: bigMul(TRANSACTION_GAS, ethAsset?.price_usd),
									dp: 3
								})})
							{:else}
								...
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<button
			class="mt-16 mb-6 flex min-w-[120px] justify-center self-center rounded-full bg-brand-primary px-6 py-4 text-white"
			on:click={transfer}
			disabled={submitDisabled}
		>
			{#if loading}
				<Spinner class="stroke-white stroke-2 text-center" />
			{:else}
				{$LL.withdraw()}
			{/if}
		</button>
	</div>
</FullLayoutModal>

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
