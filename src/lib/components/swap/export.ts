import { ETH_ASSET_ID, XIN_ASSET_ID } from '../../constants/common';
import { bigMul, format } from '../../helpers/big';

export const INPUT_KEY = 'input';
export const OUTPUT_KEY = 'output';
export const SLIPPAGE_KEY = 'slippage';

export const DEFAULT_INPUT_KEY = ETH_ASSET_ID;
export const DEFAULT_OUTPUT_KEY = XIN_ASSET_ID;
export const DEFAULT_SLIPPAGE = 0.99;

export const formatFiat = (priceUsd: string | undefined, inputAmount: number | undefined) => {
	if (!priceUsd || !inputAmount) return '0.00';
	return format({ n: bigMul(priceUsd, inputAmount), dp: 2 });
};
