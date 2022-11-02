import type { RouteCtx } from '$lib/helpers/4swap/route';

export type SwapSource = 'MixPay' | '4Swap' | 'NoPair';

export type SwapParams = {
	inputAsset: string;
	outputAsset: string;
	inputAmount?: string;
	outputAmount?: string;
};

export type Order = RouteCtx & {
	route_assets: string[];
	routes: string;
	fill_asset_id: string;
	pay_asset_id: string;
};

export interface PreOrderInfo {
	order: Order;
	fee: string;
	price: string;
	minReceived: string;
	errorMessage?: string;
}
