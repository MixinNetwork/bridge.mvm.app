import { get, writable } from '@square/svelte-store';
import type { PairRoutes } from '$lib/helpers/4swap/route';
import type { SwapSource, SwapParams, PreOrderInfo } from '$lib/types/swap';
import type { Asset } from '$lib/types/asset';
import { get4SwapSwapInfo } from '$lib/helpers/4swap/utils';
import { fetchMixPayPreOrder, type MixPayAsset } from '$lib/helpers/mixpay/api';
import { pairs } from './model';
import { WHITELIST_ASSET_4SWAP } from '$lib/constants/common';
import { isEqual } from 'lodash-es';

const emptyOrder: PreOrderInfo = {
	order: undefined,
	fee: '',
	price: '',
	minReceived: ''
}

const createSwapOrder = () => {
	let mixpayOrderInfoUpdateTimer: ReturnType<typeof setInterval>;
	let lastParams: {
		lastEdited: 'input' | 'output';
		inputAsset: string;
		outputAsset: string | undefined;
		amount: string | undefined;
	};

	const { subscribe, update, set } = writable<PreOrderInfo & { loading: boolean }>({
		...emptyOrder,
		loading: false
	}, () => {
		if (mixpayOrderInfoUpdateTimer) clearInterval(mixpayOrderInfoUpdateTimer);
	});

	const updateSwapInfo = async (
		source: SwapSource,
		lastEdited: 'input' | 'output',
		requestParams: SwapParams,
		pairRoutes: PairRoutes,
		slippage: number
	) => {
		const current = {
			lastEdited,
			inputAsset: requestParams.inputAsset,
			outputAsset: requestParams.outputAsset,
			amount: lastEdited === 'input' ? requestParams.inputAmount : requestParams.outputAmount
		};
		if (isEqual(current, lastParams)) return;
		lastParams = current;

		if (mixpayOrderInfoUpdateTimer) clearInterval(mixpayOrderInfoUpdateTimer);

		if (source === 'NoPair') {
			update(info => ({
				...emptyOrder,
				loading: info.loading
			}))
			return;
		}

		if (source === '4Swap') {
			const res = get4SwapSwapInfo(pairRoutes, slippage, requestParams);
			update(info => ({
				...res,
				loading: info.loading
			}))
			return;
		}

		const res = await fetchMixPayPreOrder(requestParams);
		update(info => ({
			...res,
			loading: info.loading
		}))

		if (res.errorMessage) throw new Error(res.errorMessage);

		if (res.order) {
			mixpayOrderInfoUpdateTimer = setInterval(async () => {
				update(info => ({
					...info,
					loading: true
				}))
				const res = await fetchMixPayPreOrder(requestParams);
				set({
					...res,
					loading: false
				})
			}, 1000 * 15);
		}
	};

	return {
		subscribe,
		fetchOrderInfo: async (
			source: SwapSource,
			lastEdited: 'input' | 'output',
			requestParams: SwapParams,
			pairRoutes: PairRoutes,
			slippage: number
		) => {
			update(info => ({
				...info,
				loading: true
			}));
			await updateSwapInfo(source, lastEdited, requestParams, pairRoutes, slippage);
			update(info => ({
				...info,
				loading: false
			}));
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
			($pairs.data.some(
				(pair) =>
					pair.base_asset_id === outputAsset.asset_id && pair.quote_asset_id === inputAsset.asset_id ||
					pair.base_asset_id === inputAsset.asset_id && pair.quote_asset_id === outputAsset.asset_id
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
			$pairs.data.some(
				(pair) =>
					pair.base_asset_id === outputAsset.asset_id && pair.quote_asset_id === inputAsset.asset_id || 
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
