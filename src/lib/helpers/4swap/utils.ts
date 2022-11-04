import type { Pair } from './api';
import type { PreOrderInfo, SwapParams } from '$lib/types/swap';
import { format } from '../big';
import { PairRoutes } from './route';

export const get4SwapSwapInfo = (
	pairs: Pair[],
	slippage: number,
	{ inputAsset, outputAsset, inputAmount, outputAmount }: SwapParams
): PreOrderInfo => {
	try {
		const pairRoutes = new PairRoutes(pairs);
		const order = pairRoutes.getPreOrder({
			inputAsset,
			outputAsset,
			inputAmount,
			outputAmount
		});

		return {
			order,
			fee: format({ n: pairRoutes.getFee(order), dp: 8 }),
			price: format({ n: +order.amount / +order.funds, dp: 8 }),
			minReceived: format({ n: +order.amount * +slippage })
		};
	} catch (e) {
		return {
			order: undefined,
			fee: '',
			price: '',
			minReceived: ''
		};
	}
};
