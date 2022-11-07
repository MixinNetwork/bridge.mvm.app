<script lang="ts">
	import clsx from 'clsx';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Switch from '$lib/assets/switch.svg?component';
	import type { Order, SwapParams } from '$lib/types/swap';
	import { setSearchParam } from '$lib/helpers/app-store';
	import { assets, pairs, updateAssets } from '$lib/stores/model';
	import { getAsset } from '$lib/helpers/utils';
	import type { Asset } from '$lib/types/asset';
	import Header from '$lib/components/base/header.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import { bigLte, bigGte, format, toPercent } from '$lib/helpers/big';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import { slide } from 'svelte/transition';
	import { DEFAULT_SLIPPAGE, INPUT_KEY, OUTPUT_KEY, formatFiat } from '$lib/components/swap/export';
	import Faq from '$lib/components/swap/faq.svelte';
	import { registerAndSave, user } from '$lib/stores/user';
	import { library } from '$lib/stores/ether';
	import { ETH_ASSET_ID, XIN_ASSET_ID } from '$lib/constants/common';
	import Spinner from '$lib/components/common/spinner.svelte';
	import { showToast } from '$lib/components/common/toast/toast-container.svelte';
	import { focus } from 'focus-svelte';
	import LL from '$i18n/i18n-svelte';
	import Apps from '$lib/components/base/apps.svelte';
	import { swapOrder } from '$lib/stores/swap';
	import { tick } from 'svelte';
	import DepositPending from '$lib/components/base/deposit-pending.svelte';

	let a: Asset[] | undefined = $page.data.assets;

	let inputAsset: Asset | undefined = undefined;
	let outputAsset: Asset | undefined = undefined;
	let slippage = DEFAULT_SLIPPAGE;

	$: a && !$assets.length && assets.set(a);

	$: !inputAsset &&
		(inputAsset =
			getAsset($page.url.searchParams.get(INPUT_KEY) || ETH_ASSET_ID, $assets) ||
			getAsset(ETH_ASSET_ID, $assets));
	$: !outputAsset &&
		(outputAsset =
			getAsset($page.url.searchParams.get(OUTPUT_KEY) || XIN_ASSET_ID, $assets) ||
			getAsset(XIN_ASSET_ID, $assets));

	let lastEdited: 'input' | 'output' | undefined = undefined;
	let inputAmount: number | string | undefined = undefined;
	let outputAmount: number | string | undefined = undefined;

	const handleSwitch = async () => {
		swapOrder.reset();
		if (lastEdited === 'input' && inputAmount) {
			outputAmount = format({ n: inputAmount });
			inputAmount = undefined;
			lastEdited = 'output';
		} else if (lastEdited === 'output' && outputAmount) {
			inputAmount = format({ n: outputAmount });
			outputAmount = undefined;
			lastEdited = 'input';
		}

		const temp = inputAsset;
		inputAsset = outputAsset;
		outputAsset = temp;

		setSearchParam($page, INPUT_KEY, inputAsset?.asset_id);
		setSearchParam($page, OUTPUT_KEY, outputAsset?.asset_id);

		goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
	};

	const handleChangeInputAsset = (asset: Asset) => {
		if (outputAsset?.asset_id === asset.asset_id) return;
		swapOrder.reset();
		inputAsset = asset;
		setSearchParam($page, INPUT_KEY, asset.asset_id);
		goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
	};

	const handleChangeOutputAsset = (asset: Asset) => {
		if (inputAsset?.asset_id === asset.asset_id) return;
		swapOrder.reset();
		outputAsset = asset;
		setSearchParam($page, OUTPUT_KEY, asset.asset_id);
		goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
	};

	const handleChangeAmount = (source: 'input' | 'output') => {
		lastEdited = source;
		if (source === 'input' && !inputAmount) outputAmount = '';
		if (source === 'output' && !outputAmount) inputAmount = '';
	};

	const updateOrder = async (
		lastEdited: 'input' | 'output',
		requestParams: SwapParams,
		slippage: number
	) => {
		try {
			const { source } = $swapOrder;
			await tick();
			await swapOrder.fetchOrderInfo($pairs, source, lastEdited, requestParams, slippage);
		} catch (e) {
			if (lastEdited === 'input') outputAmount = undefined;
			if (lastEdited === 'output') inputAmount = undefined;
		}
	};

	$: if (inputAsset && outputAsset && lastEdited && (inputAmount || outputAmount) && $pairs) {
		const requestParams = {
			inputAsset: inputAsset.asset_id,
			outputAsset: outputAsset.asset_id,
			inputAmount: lastEdited === 'input' ? String(inputAmount) : undefined,
			outputAmount: lastEdited === 'output' ? String(outputAmount) : undefined
		};
		updateOrder(lastEdited, requestParams, slippage);
	}

	// info
	let order: Order | undefined;
	let fee: string | undefined;
	let price: string | undefined;
	let minReceived: string | undefined;

	$: if (
		$swapOrder?.order &&
		$swapOrder?.order.pay_asset_id === inputAsset?.asset_id &&
		$swapOrder?.order.fill_asset_id === outputAsset?.asset_id &&
		((lastEdited === 'input' && inputAmount) || (lastEdited === 'output' && outputAmount))
	) {
		order = $swapOrder.order;
		fee = $swapOrder.fee;
		price = $swapOrder.price;
		minReceived = $swapOrder.minReceived;

		if (lastEdited === 'input') {
			outputAmount = (order.amount && format({ n: order.amount, fixed: true, dp: 8 })) || undefined;
		} else if (lastEdited === 'output') {
			inputAmount = (order.funds && format({ n: order.funds, fixed: true, dp: 8 })) || undefined;
		}
	}

	$: if (!$swapOrder?.order) {
		order = undefined;
		fee = undefined;
		price = undefined;
		minReceived = undefined;
	}

	$: inputAmountFiat = formatFiat(inputAsset?.price_usd, (inputAmount && +inputAmount) || 0);
	$: outputAmountFiat = formatFiat(outputAsset?.price_usd, (outputAmount && +outputAmount) || 0);

	let loading = false;
	const swap = async () => {
		if (
			!$library ||
			!$user ||
			!order ||
			!inputAsset ||
			!outputAsset ||
			!minReceived ||
			$swapOrder.source === 'NoPair'
		)
			return;

		loading = true;

		const { swapAsset } = await import('$lib/helpers/web3/common');

		try {
			if (!$user.contract) await registerAndSave($user.address);
			const res = await swapAsset(
				$library,
				$user,
				$swapOrder.source,
				order,
				inputAsset,
				minReceived
			);

			await updateAssets();
			inputAsset = getAsset(inputAsset.asset_id, $assets);
			outputAsset = getAsset(outputAsset.asset_id, $assets);

			if (res) showToast('success', $LL.swapPage.tips.success());

			swapOrder.reset();
		} finally {
			loading = false;
		}
	};

	$: isInputAssetBalanceLegal = bigLte(inputAsset?.balance ?? 0, 0);
	$: isOutputAssetBalanceLegal = bigLte(outputAsset?.balance ?? 0, 0);
</script>

<Header class="bg-transparent">
	<div class="md:hidden">{$LL.swap()}</div>
	<UserInfo class="hidden md:flex" />
	<Apps />
	<DepositPending />
</Header>

<div
	class="mx-5 flex flex-col md:mx-auto md:w-96 lg:w-full lg:flex-row lg:items-start lg:justify-center lg:space-x-5"
>
	<div class="mt-4 flex flex-col items-stretch justify-center md:w-96">
		<div class="rounded-lg bg-white">
			<label for="input" class="opacity-100">
				<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
					<div>{$LL.from()}</div>
					<button
						class="expand-4 space-x-1 text-xs text-black text-opacity-50 !opacity-100"
						disabled={isInputAssetBalanceLegal}
						on:click={() => {
							lastEdited = 'input';
							inputAmount = format({ n: inputAsset?.balance ?? 0, max_dp: 8, mode: 1 });
						}}
					>
						{#if !isInputAssetBalanceLegal}
							<span class="text-brand-primary">{$LL.max()}</span>
						{/if}
						<span>
							{$LL.balanceOf(format({ n: inputAsset?.balance ?? 0 }), inputAsset?.symbol || '')}
						</span>
					</button>
				</div>
				<div class="flex items-center">
					{#if inputAsset}
						<SelectedAssetButton
							class=" w-fit"
							asset={inputAsset}
							onSelect={handleChangeInputAsset}
						/>
					{/if}
					<div class="flex grow flex-col items-end pr-4">
						<input
							id="input"
							type="number"
							class="w-full text-right font-bold text-black"
							autocomplete="off"
							use:focus={{ enabled: true, focusable: true, focusDelay: 100 }}
							bind:value={inputAmount}
							on:input={() => handleChangeAmount('input')}
							placeholder="0.0"
						/>
						<div class="text-sm font-semibold text-black text-opacity-30">≈ ${inputAmountFiat}</div>
					</div>
				</div>
			</label>

			<div class="relative h-[2px] bg-brand-background">
				<button
					class="absolute left-1/2 z-10 -translate-y-1/2 -translate-x-1/2"
					on:click={handleSwitch}
				>
					<Switch />
				</button>
			</div>
			<label for="output" class="opacity-100">
				<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
					<div>{$LL.to()}</div>
					<button
						class="expand-4 space-x-1 text-xs text-black text-opacity-50 !opacity-100"
						disabled={isOutputAssetBalanceLegal}
						on:click={() => {
							lastEdited = 'output';
							outputAmount = format({ n: outputAsset?.balance ?? 0, max_dp: 8, mode: 1 });
						}}
					>
						{#if !isOutputAssetBalanceLegal}
							<span class="text-brand-primary">{$LL.max()}</span>
						{/if}
						<span>
							{$LL.balanceOf(format({ n: outputAsset?.balance ?? 0 }), outputAsset?.symbol || '')}
						</span>
					</button>
				</div>
				<div class="flex items-center">
					{#if outputAsset}
						<SelectedAssetButton
							class=" w-fit"
							asset={outputAsset}
							onSelect={handleChangeOutputAsset}
						/>
					{/if}
					<div class="flex grow flex-col items-end pr-4">
						<input
							id="output"
							type="number"
							class="w-full text-right font-bold text-black"
							autocomplete="off"
							bind:value={outputAmount}
							on:input={() => handleChangeAmount('output')}
							placeholder="0.0"
						/>
						<div class="text-sm font-semibold text-black text-opacity-30">
							≈ ${outputAmountFiat}
						</div>
					</div>
				</div>
			</label>
		</div>

		{#if order && +order.amount}
			<div transition:slide|local>
				<div
					class="mt-3 space-y-2 rounded-lg bg-black bg-opacity-5 p-4 text-xs font-semibold text-black text-opacity-50 child:flex child:items-center child:justify-between"
				>
					<div>
						<div>{$LL.swapPage.tips.price()}</div>
						<div>1 {inputAsset?.symbol} ≈ {price} {outputAsset?.symbol}</div>
					</div>
					<div>
						<div>{$LL.swapPage.tips.minReceived()}</div>
						<div>{minReceived} {outputAsset?.symbol}</div>
					</div>
					<div>
						<div>{$LL.swapPage.tips.fee()}</div>
						<div>{fee} {inputAsset?.symbol}</div>
					</div>
					<div>
						<div>{$LL.swapPage.tips.priceImpact()}</div>
						<div
							transition:fade
							class={clsx({
								'text-brand-forbiddenPrice': order?.priceImpact >= 0.1,
								'text-brand-warningPrice': order?.priceImpact >= 0.01 && order?.priceImpact < 0.1,
								'text-black text-opacity-50': order?.priceImpact < 0.01
							})}
						>
							{toPercent({ n: order?.priceImpact })}
						</div>
					</div>
				</div>
			</div>
			{#if order?.priceImpact > 0.15}
				<div transition:slide|local class="mt-3 self-center text-xs font-semibold opacity-50">
					{$LL.swapPage.tips.warning()}
				</div>
			{/if}
		{/if}

		<button
			class="mt-10 mb-6 flex w-28 justify-center self-center rounded-full bg-brand-primary px-6 py-3 text-white"
			on:click={swap}
			disabled={!(order && +order.amount) ||
				order?.priceImpact > 0.15 ||
				$swapOrder.loading ||
				!!(inputAmount && inputAsset?.balance && bigGte(inputAmount, inputAsset?.balance))}
		>
			{#if loading || $swapOrder.loading}
				<Spinner class="stroke-white stroke-2 text-center" />
			{:else}
				{$LL.swap()}
			{/if}
		</button>
	</div>
	<Faq />
</div>
