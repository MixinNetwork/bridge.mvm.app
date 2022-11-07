import { get, writable } from '@square/svelte-store';
import type { SwapSource, SwapParams, PreOrderInfo } from '$lib/types/swap';
import { fetchPairs, type Pair } from '../helpers/4swap/api';
import { get4SwapSwapInfo } from '$lib/helpers/4swap/utils';
import {
	fetchMixPayPaymentAssets,
	fetchMixPayPreOrder,
	fetchMixPaySettlementAssets,
	type MixPayAsset
} from '$lib/helpers/mixpay/api';
import { debounce, isEqual } from 'lodash-es';
import { pairs } from './model';
import { bigGt, bigLt } from '$lib/helpers/big';

const emptyOrder: PreOrderInfo = {
	order: undefined,
	fee: '',
	price: '',
	minReceived: ''
};

const createSwapOrder = () => {
	let updateTimer: ReturnType<typeof setInterval>;
	let lastParams: {
		lastEdited: 'input' | 'output';
		inputAsset: string;
		outputAsset: string | undefined;
		amount: string | undefined;
	};
	let mixPayPaymentAssets: MixPayAsset[] = [];
	let mixPaySettlementAssets: MixPayAsset[] = [];

	const { subscribe, update, set } = writable<
		PreOrderInfo & {
			loading: boolean;
			source: SwapSource;
		}
	>(
		{
			...emptyOrder,
			loading: false,
			source: 'NoPair'
		},
		() => () => updateTimer && clearInterval(updateTimer)
	);

	const modifyLoadingStatus = (loading: boolean) => {
		update((info) => ({
			...info,
			loading
		}));
	};

	const init = async () => {
		const [p, payment, settment] = await Promise.allSettled([
			fetchPairs(),
			fetchMixPayPaymentAssets(),
			fetchMixPaySettlementAssets()
		]);
		if (p.status === "fulfilled") pairs.set(p.value);
		if (payment.status === "fulfilled") mixPayPaymentAssets = payment.value;
		if (settment.status === "fulfilled") mixPaySettlementAssets = settment.value;
	};

	const debouncedUpdate = debounce(
		async (
			$pairs: Pair[],
			lastEdited: 'input' | 'output',
			requestParams: SwapParams,
			slippage: number
		) => {
			if (
				(lastEdited === 'input' && Number.isNaN(Number(requestParams.inputAmount))) ||
				(lastEdited === 'output' && Number.isNaN(Number(requestParams.outputAmount)))
			) {
				set({
					...emptyOrder,
					loading: false,
					source: 'NoPair'
				});
				return;
			}

			if (!$pairs.length) $pairs = get(pairs);
			const order4Swap = get4SwapSwapInfo($pairs, slippage, requestParams);

			const orderMixPay =
				mixPayPaymentAssets.some((asset) => asset.assetId === requestParams.inputAsset) &&
				mixPaySettlementAssets.some((asset) => asset.assetId === requestParams.outputAsset)
					? await fetchMixPayPreOrder(requestParams)
					: { ...emptyOrder };

			if (!order4Swap.order && !orderMixPay.order) {
				set({
					...emptyOrder,
					loading: false,
					source: 'NoPair'
				});
				throw new Error('No Swap Pair');
			}

			let source: SwapSource = '4Swap';

			if (
				(!!order4Swap.order || !!orderMixPay.order) &&
				!!order4Swap.order !== !!orderMixPay.order
			) {
				source = order4Swap.order ? '4Swap' : 'MixPay';
			}

			if (!!order4Swap.order && !!orderMixPay.order) {
				if (lastEdited === 'input') {
					source = order4Swap.order.amount > orderMixPay.order.amount ? '4Swap' : 'MixPay';
				} else {
					source = order4Swap.order.funds < orderMixPay.order.funds ? '4Swap' : 'MixPay';
				}
			}

			const order = source === '4Swap' ? order4Swap : orderMixPay;
			set({
				...order,
				loading: false,
				source
			});

			if (source === 'MixPay')
				updateTimer = setInterval(async () => {
					modifyLoadingStatus(true);
					const res = await fetchMixPayPreOrder(requestParams);
					set({
						...res,
						loading: false,
						source: 'MixPay'
					});
				}, 1000 * 15);
		},
		300
	);

	const updateSwapInfo = async (
		$pairs: Pair[],
		lastSource: SwapSource,
		lastEdited: 'input' | 'output',
		requestParams: SwapParams,
		slippage: number
	) => {
		// Avoid keep sending requests due to update the other amount the last time
		const current = {
			lastEdited,
			inputAsset: requestParams.inputAsset,
			outputAsset: requestParams.outputAsset,
			amount: lastEdited === 'input' ? requestParams.inputAmount : requestParams.outputAmount
		};
		if (lastSource === 'MixPay') {
			if (isEqual(current, lastParams)) return;
		}
		lastParams = current;

		if (updateTimer) clearInterval(updateTimer);

		// directly use 4Swap
		if (
			!!$pairs.length &&
			!!mixPayPaymentAssets.length &&
			!!mixPaySettlementAssets.length &&
			(mixPayPaymentAssets.every((asset) => asset.assetId !== requestParams.inputAsset) ||
				mixPaySettlementAssets.every((asset) => asset.assetId !== requestParams.outputAsset) ||
				mixPayPaymentAssets.some(
					(asset) =>
						asset.assetId === requestParams.inputAsset &&
						lastEdited === 'input' &&
						requestParams.inputAmount &&
						asset.minPaymentAmount &&
						asset.maxPaymentAmount &&
						(bigLt(requestParams.inputAmount, asset.minPaymentAmount) ||
							bigGt(requestParams.inputAmount, asset.maxPaymentAmount))
				) ||
				mixPayPaymentAssets.some(
					(asset) =>
						asset.assetId === requestParams.outputAsset &&
						lastEdited === 'output' &&
						requestParams.outputAmount &&
						asset.minPaymentAmount &&
						asset.maxPaymentAmount &&
						(bigLt(requestParams.outputAmount, asset.minPaymentAmount) ||
							bigGt(requestParams.outputAmount, asset.maxPaymentAmount))
				))
		) {
			const order4Swap = get4SwapSwapInfo($pairs, slippage, requestParams);
			set({
				...order4Swap,
				loading: false,
				source: '4Swap'
			});
			return;
		}

		modifyLoadingStatus(true);
		if (!$pairs.length || !mixPayPaymentAssets.length || !mixPaySettlementAssets.length)
			await init();

		debouncedUpdate($pairs, lastEdited, requestParams, slippage);
	};

	return {
		subscribe,
		fetchOrderInfo: updateSwapInfo,
		reset: () => {
			set({
				...emptyOrder,
				loading: false,
				source: 'NoPair'
			});
			updateTimer && clearInterval(updateTimer);
		}
	};
};

export const swapOrder = createSwapOrder();
