import { get, writable } from '@square/svelte-store';
import type { PairRoutes } from '$lib/helpers/4swap/route';
import type { SwapSource, SwapParams, PreOrderInfo } from '$lib/types/swap';
import type { Asset } from '$lib/types/asset';
import { get4SwapSwapInfo } from '$lib/helpers/4swap/utils';
import { fetchMixPayPreOrder, type MixPayAsset } from '$lib/helpers/mixpay/api';
import { pairs } from './model';
import { WHITELIST_ASSET_4SWAP } from '$lib/constants/common';

const createSwapOrder = () => {
	const { subscribe, set } = writable<PreOrderInfo | undefined>(undefined);

	let mixpayOrderInfoUpdateTimer: ReturnType<typeof setInterval>;

	const updateSwapInfo = async (
		showToast: (type: 'common' | 'success', msg: string, duration?: number) => void,
		source: Omit<SwapSource, 'NoPair'>,
		requestParams: SwapParams,
		pairRoutes: PairRoutes,
		slippage: number
	) => {
		if (mixpayOrderInfoUpdateTimer) clearInterval(mixpayOrderInfoUpdateTimer);

		if (source === '4Swap') {
			const info = get4SwapSwapInfo(pairRoutes, slippage, requestParams);
			set(info);
		}

		const info = await fetchMixPayPreOrder(requestParams);
		if (info.errorMessage) {
			showToast('common', info.errorMessage);
			return;
		}

		if (info.order) {
			set(info);
			mixpayOrderInfoUpdateTimer = setInterval(async () => {
				const info = await fetchMixPayPreOrder(requestParams);
				set(info);
			}, 1000 * 15);
		}
	};

	return {
		subscribe,
		set,
		fetchOrderInfo: async (
			showToast: (type: 'common' | 'success', msg: string, duration?: number) => void,
			source: Omit<SwapSource, 'NoPair'>,
			requestParams: SwapParams,
			pairRoutes: PairRoutes,
			slippage: number
		) => {
			await updateSwapInfo(showToast, source, requestParams, pairRoutes, slippage);
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
