import type { PairRoutes, SwapParams } from './route';
import { format } from '../big';

export const get4SwapSwapInfo = (
	pairRoutes: PairRoutes,
	slippage: number,
	{ inputAsset, outputAsset, inputAmount, outputAmount }: SwapParams
) => {
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
		return undefined;
	}
};