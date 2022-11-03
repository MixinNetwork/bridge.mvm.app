import type { PairRoutes } from './route';
import type { PreOrderInfo, SwapParams } from '$lib/types/swap';
import { format } from '../big';

export const get4SwapSwapInfo = (
	pairRoutes: PairRoutes,
	slippage: number,
	{ inputAsset, outputAsset, inputAmount, outputAmount }: SwapParams
): PreOrderInfo => {
	try {
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
