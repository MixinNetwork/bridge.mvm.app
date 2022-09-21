import BigNumber from 'bignumber.js';
import Hashids from 'hashids';
import { Uniswap } from '../swap/uniswap';
import { Curve, A } from '../swap/curve';
import type { Pair } from './api';

const HASH_SALT = 'uniswap routes';
const uniswap = new Uniswap();
const curve = new Curve(A);
const precision = 8;

export type SwapParams = {
	inputAsset: string;
	outputAsset: string;
	inputAmount?: string;
	outputAmount?: string;
};

export type RouteCtx = {
	routeAssets: string[];
	routeIds: number[];
	amount: number;
	funds: number;
	priceImpact: number;
};

export type RoutePair = Pair & {
	K: number;
	baseAmount: number;
	quoteAmount: number;
	fillPercent: number;
};

export type Order = RouteCtx & {
	route_assets: string[];
	routes: string;
	fill_asset_id: string;
	pay_asset_id: string;
};

const getPairByIds = (pairs: Pair[], id1: string, id2: string) => {
	// pair's base id is smaller than quote id
	const [base, quote] = id1 < id2 ? [id1, id2] : [id2, id1];

	return pairs.find(({ base_asset_id, quote_asset_id }) => {
		return base === base_asset_id && quote === quote_asset_id;
	});
};

const getOppositeAsset = (pair: RoutePair, input: string) => {
	return input === pair.base_asset_id ? pair.quote_asset_id : pair.base_asset_id;
};

const swap = (pair: RoutePair, inputAsset: string, inputAmount: number) => {
	let dy = 0;
	let priceImpact = 0;
	const dx = +inputAmount * pair.fillPercent;

	let x = pair.baseAmount;
	let y = pair.quoteAmount;

	const inputBaseAsset = inputAsset === pair.base_asset_id;

	if (!inputBaseAsset) {
		[x, y] = [y, x];
	}

	if (pair.swap_method === 'curve') {
		dy = curve.swap(x, y, dx);
		dy = new BigNumber(dy).decimalPlaces(precision, BigNumber.ROUND_DOWN).toNumber();
		priceImpact = curve.getPriceImpact(inputAmount, dy);
	} else {
		dy = uniswap.swap(x, y, dx);
		dy = new BigNumber(dy).decimalPlaces(precision, BigNumber.ROUND_DOWN).toNumber();
		priceImpact = uniswap.getPriceImpact(x, y, inputAmount, dy);
	}

	if (dy <= 0) return;

	return {
		funds: inputAmount,
		amount: dy,
		priceImpact
	};
};

const swapReverse = (pair: RoutePair, inputAsset: string, outputAmount: number) => {
	let dx = 0;
	let priceImpact = 0;

	const dy = outputAmount;

	let x = pair.baseAmount;
	let y = pair.quoteAmount;

	const inputBaseAsset = inputAsset === pair.base_asset_id;

	if (!inputBaseAsset) {
		[x, y] = [y, x];
	}

	if (dy > y) return;

	if (pair.swap_method === 'curve') {
		dx = curve.swapReverse(x, y, dy);
		dx = new BigNumber(dx / pair.fillPercent)
			.decimalPlaces(precision, BigNumber.ROUND_CEIL)
			.toNumber();
		priceImpact = curve.getPriceImpact(dx, outputAmount);
	} else {
		dx = uniswap.swapReverse(x, y, dy);
		dx = new BigNumber(dx / pair.fillPercent)
			.decimalPlaces(precision, BigNumber.ROUND_CEIL)
			.toNumber();
		priceImpact = uniswap.getPriceImpact(x, y, dx, outputAmount);
	}

	if (dx <= 0) return;

	return {
		funds: dx,
		amount: outputAmount,
		priceImpact
	};
};

export class PairRoutes {
	pairs: RoutePair[] = [];

	routes: Map<string, string[]> = new Map();

	constructor(pairs: Pair[]) {
		this.pairs = pairs.map((p) => {
			const baseAmount = Number(p.base_amount);
			const quoteAmount = Number(p.quote_amount);
			const fillPercent = new BigNumber(1).minus(p.fee_percent).toNumber();
			const isCurve = p.swap_method === 'curve';

			let d = 0;

			if (isCurve) {
				d = curve.getD([baseAmount * 10e8, quoteAmount * 10e8]);
			}

			return {
				...p,
				baseAmount,
				quoteAmount,
				fillPercent,
				K: baseAmount * quoteAmount,
				D: d
			};
		});

		for (const pair of this.pairs) {
			this.setAssetRoute(pair.base_asset_id, pair);
			this.setAssetRoute(pair.quote_asset_id, pair);
		}
	}

	getPairByRouteId(id: number) {
		return this.pairs.find((p) => p.route_id === id);
	}

	getFee(order: { funds?: number; route_assets: string[] }) {
		const { funds = 0, route_assets = [] } = order;
		// calc fee and fee text
		let receivePercent = 1;

		route_assets.forEach((asset, index) => {
			const pair = getPairByIds(this.pairs, asset, route_assets?.[index + 1]);

			receivePercent *= 1 - (pair?.fee_percent ?? 0);
		});

		return +funds - receivePercent * +funds;
	}

	getPreOrder({ inputAsset, outputAsset, inputAmount, outputAmount }: SwapParams) {
		let bestRoute: RouteCtx | null = null;
		let funds = inputAmount;
		let amount = outputAmount;

		if (inputAmount) {
			if (+inputAmount <= 0) return;

			bestRoute = this.getRoutes(inputAsset, outputAsset, +inputAmount);
			amount = new BigNumber(bestRoute?.amount ?? 0)
				.decimalPlaces(precision, BigNumber.ROUND_DOWN)
				.toString();
		} else if (outputAmount) {
			if (+outputAmount <= 0) return;

			bestRoute = this.getRoutesReverse(inputAsset, outputAsset, +outputAmount);
			funds = new BigNumber(bestRoute?.funds ?? 0)
				.decimalPlaces(precision, BigNumber.ROUND_CEIL)
				.toString();
		} else throw 'swap.error.need-input-or-output';

		if (!bestRoute) throw 'swap.error.no-pair-route-found';
		if (!amount || !funds) throw 'swap.error.swap-amount-not-support';
		if (+amount <= 0 || +funds <= 0) throw 'swap.error.swap-amount-not-support';

		return {
			...bestRoute,
			amount: +amount,
			funds: +funds,
			route_assets: bestRoute.routeAssets,
			routes: new Hashids(HASH_SALT).encode(bestRoute.routeIds),
			fill_asset_id: outputAsset,
			pay_asset_id: inputAsset
		};
	}

	private setAssetRoute(asset: string, pair: RoutePair) {
		const routes = this.routes.get(asset) || [];
		const opposit = getOppositeAsset(pair, asset);

		if (!routes.includes(opposit)) {
			this.routes.set(asset, [...routes, opposit]);
		}
	}

	private getPair(base: string, quote: string) {
		return this.pairs.find((p) => {
			const pair1 = p.base_asset_id === base && p.quote_asset_id === quote;
			const pair2 = p.base_asset_id === quote && p.quote_asset_id === base;
			return pair1 || pair2;
		});
	}

	private getRoutes(inputAsset: string, outputAsset: string, inputAmount: number) {
		const deep = 4;
		const queue: { key: string; ctx: RouteCtx }[] = [];

		let bestRoute: RouteCtx | null = null;

		queue.push({
			key: inputAsset,
			ctx: {
				routeAssets: [inputAsset],
				routeIds: [],
				amount: 0,
				funds: 0,
				priceImpact: 0
			}
		});

		while (queue.length > 0) {
			const current = queue.pop();
			if (!current) continue;
			const stepInputAmount = current.ctx.amount || inputAmount;
			const neibors = this.routes.get(current.key) || [];

			for (const neibor of neibors) {
				if (current.ctx.routeIds.length === deep - 1 && neibor !== outputAsset) {
					continue;
				}

				const pair = this.getPair(current.key, neibor);

				if (!pair) continue;
				if (current.ctx.routeIds.includes(pair.route_id)) continue;

				const transaction = swap(pair, current.key, +stepInputAmount);

				if (!transaction) continue;

				const newCtx: RouteCtx = {
					routeAssets: [...current.ctx.routeAssets, neibor],
					routeIds: [...current.ctx.routeIds, pair.route_id],
					amount: transaction.amount,
					funds: transaction.funds,
					priceImpact: (1 + current.ctx.priceImpact) * (1 + transaction.priceImpact) - 1
				};

				if (neibor === outputAsset) {
					if (!bestRoute || Number(bestRoute.amount) < Number(newCtx.amount)) {
						bestRoute = newCtx;
					}

					continue;
				}

				if (newCtx.routeIds.length < deep) {
					queue.push({ key: neibor, ctx: newCtx });
				}
			}
		}

		return bestRoute;
	}

	private getRoutesReverse(inputAsset: string, outputAsset: string, outputAmount: number) {
		const deep = 4;
		const queue: { key: string; ctx: RouteCtx }[] = [];
		let bestRoute: RouteCtx | null = null;

		queue.push({
			key: outputAsset,
			ctx: {
				routeAssets: [outputAsset],
				routeIds: [],
				amount: 0,
				funds: 0,
				priceImpact: 0
			}
		});

		while (queue.length > 0) {
			const current = queue.pop();
			if (!current) continue;
			const stepOutputAmount = current.ctx.funds || outputAmount;
			const neibors = this.routes.get(current.key) || [];

			for (const neibor of neibors) {
				if (current.ctx.routeIds.length === deep - 1 && neibor !== inputAsset) {
					continue;
				}

				const pair = this.getPair(current.key, neibor);

				if (!pair) continue;
				if (current.ctx.routeIds.includes(pair.route_id)) continue;

				const transaction = swapReverse(pair, neibor, stepOutputAmount);

				if (!transaction) continue;

				const newCtx: RouteCtx = {
					routeAssets: [neibor, ...current.ctx.routeAssets],
					routeIds: [pair.route_id, ...current.ctx.routeIds],
					amount: transaction.amount,
					funds: transaction.funds,
					priceImpact: (1 + current.ctx.priceImpact) * (1 + transaction.priceImpact) - 1
				};

				if (neibor === inputAsset) {
					if (!bestRoute || Number(bestRoute.funds) > Number(newCtx.funds)) {
						bestRoute = newCtx;
					}

					continue;
				}

				if (
					newCtx.routeAssets.length < deep ||
					(newCtx.routeAssets.length === deep && neibor === inputAsset)
				) {
					queue.push({ key: neibor, ctx: newCtx });
				}
			}
		}

		return bestRoute;
	}
}
