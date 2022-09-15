<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Helper from '$lib/assets/helper.svg?component';
	import Switch from '$lib/assets/switch.svg?component';
	import { PairRoutes, type Order } from '$lib/helpers/4swap/route';
	import { setSearchParam } from '$lib/helpers/app-store';
	import { assets, getAsset, pairs, updateAssets } from '$lib/stores/model';
	import type { Asset } from '$lib/types/asset';
	import Header from '$lib/components/base/header.svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import { bigMul, format, toPercent } from '$lib/helpers/big';
	import SelectedAssetButton from '$lib/components/base/selected-asset-button.svelte';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import {
		inputAsset,
		INPUT_KEY,
		outputAsset,
		OUTPUT_KEY,
		slippage
	} from '$lib/components/swap/export';
	import Faq from '$lib/components/swap/faq.svelte';
	import { user } from '$lib/stores/user';
	import { library } from '$lib/stores/ether';
	import { ETH_ASSET_ID, XIN_ASSET_ID } from '$lib/constants/common';
	import type { Pair } from '$lib/helpers/4swap/api';
	import Spinner from '$lib/components/common/spinner.svelte';
	import Toast from '$lib/components/common/toast/toast.svelte';
	import Success from '$lib/components/common/toast/success.svelte';

	const formatFiat = (priceUsd: string | undefined, inputAmount: number | undefined) => {
		if (!priceUsd || !inputAmount) return '0.00';
		return format({ n: bigMul(priceUsd, inputAmount), dp: 2 });
	};

	let a: Asset[] | undefined = $page.data.assets;
	let p: Pair[] | undefined = $page.data.pairs;

	$: a && !$assets.length && assets.set(a);
	$: p && !$pairs.length && pairs.set(p);

	$: !$inputAsset &&
		inputAsset.set(
			getAsset($page.url.searchParams.get(INPUT_KEY) || ETH_ASSET_ID) || getAsset(ETH_ASSET_ID)
		);
	$: !$outputAsset &&
		outputAsset.set(
			getAsset($page.url.searchParams.get(OUTPUT_KEY) || XIN_ASSET_ID) || getAsset(XIN_ASSET_ID)
		);

	let lastEdited: 'input' | 'output' | undefined = undefined;
	let inputAmount: number | undefined = undefined;
	let outputAmount: number | undefined = undefined;

	const handleSwitch = () => {
		if (lastEdited === 'input') {
			lastEdited = 'output';
			outputAmount = inputAmount;
		} else if (lastEdited === 'output') {
			lastEdited = 'input';
			inputAmount = outputAmount;
		}

		const temp = $inputAsset;
		inputAsset.set($outputAsset);
		outputAsset.set(temp);

		setSearchParam($page, INPUT_KEY, $outputAsset?.asset_id);
		setSearchParam($page, OUTPUT_KEY, $inputAsset?.asset_id);

		goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
	};

	const handleChangeInputAsset = (event: CustomEvent<Asset>) => {
		inputAsset.set(event.detail);
		setSearchParam($page, INPUT_KEY, event.detail.asset_id);
		goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
	};

	const handleChangeOutputAsset = (event: CustomEvent<Asset>) => {
		outputAsset.set(event.detail);
		setSearchParam($page, OUTPUT_KEY, event.detail.asset_id);
		goto($page.url, { keepfocus: true, replaceState: true, noscroll: true });
	};

	$: pairRoutes = new PairRoutes($pairs);
	let order: Order | undefined;

	// info
	let fee: string | undefined;
	let price: string | undefined;
	let minReceived: string | undefined;

	$: if ($inputAsset && $outputAsset && lastEdited && (inputAmount || outputAmount)) {
		try {
			order = pairRoutes.getPreOrder({
				inputAsset: $inputAsset?.asset_id,
				outputAsset: $outputAsset?.asset_id,
				inputAmount: lastEdited === 'input' ? `${inputAmount}` : undefined,
				outputAmount: lastEdited === 'output' ? `${outputAmount}` : undefined
			});

			fee = format({ n: pairRoutes.getFee(order), dp: 8 });
			price = format({ n: +order.amount / +order.funds, dp: 8 });
			minReceived = format({ n: +order.amount * +$slippage });
		} catch (e) {
			order = undefined;
		}

		if (lastEdited === 'input') {
			outputAmount = Number(order?.amount) || undefined;
		} else if (lastEdited === 'output') {
			inputAmount = Number(order?.funds) || undefined;
		}
	} else order = undefined;

	$: inputAmountFiat = formatFiat($inputAsset?.price_usd, inputAmount);
	$: outputAmountFiat = formatFiat($outputAsset?.price_usd, outputAmount);

	let loading = false;
	let success = false;
	const swap = async () => {
		if (!$library || !$user || !order || !$inputAsset || !minReceived) return;

		loading = true;

		const { swapAsset } = await import('$lib/helpers/web3/common');

		try {
			const res = await swapAsset($library, $user, order, $inputAsset, minReceived);
			if (!res.error) success = true;

			await updateAssets();
		} finally {
			loading = false;
		}
	};

	let inputElement: HTMLInputElement | undefined;
	onMount(() => {
		inputElement?.focus();
	});
</script>

<Header class="bg-transparent">
	<div class="md:hidden">Swap</div>
	<a href="/" class="md:hidden">
		<Helper />
	</a>
	<UserInfo class="hidden md:flex" />
</Header>

<div
	class="mx-5 flex flex-col md:mx-auto md:w-96 lg:w-full lg:flex-row lg:items-start lg:justify-center lg:space-x-5"
>
	<div class="mt-4 flex flex-col items-stretch justify-center md:w-96">
		<div class="rounded-lg bg-white">
			<label for="input" class="opacity-100">
				<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
					<div>From</div>
					<div class=" text-xs text-black text-opacity-50">
						Balance: {format({ n: $inputAsset?.balance ?? '0' })}
						{$inputAsset?.symbol}
					</div>
				</div>
				<div class="flex items-center">
					{#if $inputAsset}
						<SelectedAssetButton
							class=" w-fit"
							asset={$inputAsset}
							on:callback={handleChangeInputAsset}
						/>
					{/if}
					<div class="flex grow flex-col items-end pr-4">
						<input
							id="input"
							type="number"
							class="w-full text-right font-bold text-black"
							bind:value={inputAmount}
							bind:this={inputElement}
							on:input={() => (lastEdited = 'input')}
							placeholder="0.0"
						/>
						<div class="text-sm font-semibold text-black text-opacity-30">~ ${inputAmountFiat}</div>
					</div>
				</div>
			</label>

			<div class="relative h-[2px] bg-brand-background">
				<button
					class="absolute left-1/2  -translate-y-1/2 -translate-x-1/2"
					on:click={handleSwitch}
				>
					<Switch />
				</button>
			</div>
			<label for="output" class="opacity-100">
				<div class="flex items-center justify-between py-5 px-4 pb-3 text-sm font-semibold">
					<div>To</div>
					<div class=" text-xs text-black text-opacity-50">
						Balance: {format({ n: $outputAsset?.balance ?? '0' })}
						{$outputAsset?.symbol}
					</div>
				</div>
				<div class="flex items-center">
					{#if $outputAsset}
						<SelectedAssetButton
							class=" w-fit"
							asset={$outputAsset}
							on:callback={handleChangeOutputAsset}
						/>
					{/if}
					<div class="flex grow flex-col items-end pr-4">
						<input
							id="output"
							type="number"
							class="w-full text-right font-bold text-black"
							bind:value={outputAmount}
							on:input={() => (lastEdited = 'output')}
							placeholder="0.0"
						/>
						<div class="text-sm font-semibold text-black text-opacity-30">
							~ ${outputAmountFiat}
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
						<div>Price:</div>
						<div>1 {$inputAsset?.symbol} ≈ {price} {$outputAsset?.symbol}</div>
					</div>
					<div>
						<div>Min Recevied</div>
						<div>{minReceived} {$outputAsset?.symbol}</div>
					</div>
					<div>
						<div>Fee:</div>
						<div>{fee} {$inputAsset?.symbol}</div>
					</div>
					<div>
						<div>Price Impact</div>
						<div>{toPercent({ n: order?.priceImpact })}</div>
					</div>
				</div>
			</div>
		{/if}

		<button
			class="mt-10 mb-6 flex w-28 justify-center self-center rounded-full bg-brand-primary px-6 py-3 text-white"
			on:click={swap}
			disabled={!(order && +order.amount)}
		>
			{#if loading}
				<Spinner class="stroke-white stroke-2 text-center" />
			{:else}
				Swap
			{/if}
		</button>
	</div>
	<Faq />
</div>

<Toast isOpen={success} content={Success} />
