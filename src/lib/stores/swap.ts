import { get, writable } from 'svelte/store';
import type { PairRoutes } from '$lib/helpers/4swap/route';
import type { SwapSource, SwapParams, PreOrderInfo } from '$lib/types/swap';
import type { Asset } from '$lib/types/asset';
import { get4SwapSwapInfo } from '$lib/helpers/4swap/utils';
import { fetchMixPayPreOrder, type MixPayAsset } from '$lib/helpers/mixpay/api';
import { pairs } from './model';
import { WHITELIST_ASSET_4SWAP } from '$lib/constants/common';

const createSwapOrder = () => {
	const { subscribe, update, set } = writable<PreOrderInfo | undefined>(undefined);

	let mixpayOrderInfoUpdateTimer: ReturnType<typeof setInterval>;
	let mixpayLastRequestParams: string;

	const updateSwapInfo = async (
		source: Omit<SwapSource, 'NoPair'>,
		lastEdited: 'input' | 'output',
		requestParams: SwapParams,
		pairRoutes?: PairRoutes,
		slippage?: number
	) => {
		if (source === '4Swap') {
			if (mixpayOrderInfoUpdateTimer) clearInterval(mixpayOrderInfoUpdateTimer);
			const info = get4SwapSwapInfo(pairRoutes!, slippage!, requestParams);
			return info;
		}

		const info = await fetchMixPayPreOrder(requestParams);
		if (mixpayOrderInfoUpdateTimer) clearInterval(mixpayOrderInfoUpdateTimer);
		if (info)
			mixpayOrderInfoUpdateTimer = setInterval(async () => {
				const info = await fetchMixPayPreOrder(requestParams);
				set(info);
			}, 1000 * 15);
		return info;
	};

	return {
		subscribe,
		set,
		fetchOrderInfo: async (
			source: Omit<SwapSource, 'NoPair'>,
			lastEdited: 'input' | 'output',
			requestParams: SwapParams,
			pairRoutes?: PairRoutes,
			slippage?: number
		) => {
			const info = await updateSwapInfo(source, lastEdited, requestParams, pairRoutes, slippage);
			set(info);
		}
	};
};

export const swapOrder = createSwapOrder();

const createSource = () => {
	const { subscribe, set } = writable<SwapSource>('NoPair');

	const chooseSwapSource = (
		inputAsset: Asset,
		outputAsset: Asset,
		MixPayPaymentAssets: MixPayAsset[] | undefined,
		MixPaySettlementAssets: MixPayAsset[] | undefined
	): SwapSource => {
		const $pairs = get(pairs);

		if (
			(WHITELIST_ASSET_4SWAP.includes(inputAsset.asset_id) ||
				WHITELIST_ASSET_4SWAP.includes(outputAsset.asset_id)) &&
			($pairs.some(
				(pair) =>
					pair.base_asset_id === outputAsset.asset_id && pair.quote_asset_id === inputAsset.asset_id
			) ||
				$pairs.some(
					(pair) =>
						pair.base_asset_id === inputAsset.asset_id &&
						pair.quote_asset_id === outputAsset.asset_id
				))
		)
			return '4Swap';

		if (
			MixPayPaymentAssets &&
			MixPaySettlementAssets &&
			MixPayPaymentAssets.some((asset) => asset.assetId === inputAsset.asset_id) &&
			MixPaySettlementAssets.some((asset) => asset.assetId === outputAsset.asset_id)
		)
			return 'MixPay';

		if (
			$pairs.some(
				(pair) =>
					pair.base_asset_id === outputAsset.asset_id && pair.quote_asset_id === inputAsset.asset_id
			) ||
			$pairs.some(
				(pair) =>
					pair.base_asset_id === inputAsset.asset_id && pair.quote_asset_id === outputAsset.asset_id
			)
		)
			return '4Swap';

		return 'NoPair';
	};

	return {
		subscribe,
		updateSource: (
			inputAsset: Asset,
			outputAsset: Asset,
			MixPayPaymentAssets: MixPayAsset[] | undefined,
			MixPaySettlementAssets: MixPayAsset[] | undefined
		) => {
			const source = chooseSwapSource(
				inputAsset,
				outputAsset,
				MixPayPaymentAssets,
				MixPaySettlementAssets
			);
			set(source);
		}
	};
};

export const swapSource = createSource();
