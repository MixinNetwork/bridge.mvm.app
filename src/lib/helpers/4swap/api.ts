import { v4 } from 'uuid';
import { signAuthenticationToken } from '@mixin.dev/mixin-node-sdk';
import type { RegisteredUser } from '../../types/user';
import type { Order } from '$lib/types/swap';
import { fetchCode } from '../api';
import { generateExtra } from '../sign';

export interface GetPairParams {
	base: string;
	quote: string;
}

export interface GetPairsParams {
	brokerId?: string;
}

export type PairSwapMethod = '' | 'curve';

export interface Pair {
	base_amount: string;
	base_asset_id: string;
	base_value: string;
	fee_24h: string;
	fee_percent: number;
	liquidity: string;
	quote_amount: string;
	quote_asset_id: string;
	quote_value: string;
	volume_24h: string;
	share?: string;
	liquidity_asset_id?: string;
	shares: Shares;
	route_id: number;
	transaction_count_24h?: string;
	swap_method?: PairSwapMethod;
}

export interface Shares {
	base_asset_id: string;
	quote_asset_id: string;
	base_amount: string;
	quote_amount: string;
	add_base_amount: string;
	add_quote_amount: string;
	remove_base_amount: string;
	remove_quote_amount: string;
	liquidity: string;
	percent: string;
}

export interface PairsInfo {
	fee_24h: string;
	volume_24h: string;
	pair_count: number;
	transaction_count_24h: number;
	ts: number;
}

export interface PairsRes {
	pairs: Pair[];
	whitelists: string[];
	fee_24h: string;
	pair_count: number;
	transaction_count_24h: number;
	volume_24h: string;
	ts: number;
}

interface Transaction {
	id: string;
	created_at: string;
	user_id: string;
	type: 'Swap';
	base_asset_id: string;
	quote_asset_id: string;
	base_amount: string;
	quote_amount: string;
	fee_asset_id: string;
	fee_amount: string;
	pay_asset_id: string;
	filled_asset_id: string;
	funds: string;
	amount: string;
}

export interface OrderResponse {
	id: string;
	created_at: string;
	user_id: string;
	state: 'Trading' | 'Rejected' | 'Done';
	pay_asset_id: string;
	fill_asset_id: string;
	pay_amount: string;
	fill_amount: string;
	min_amount: string;
	routes: string;
	route_assets: string[];
	transactions: Transaction;
}

interface ActionRequest {
	action: string;
	amount: number;
	asset_id: string;
	broker_id: string;
}

export interface ActionResponse {
	action: string;
	code: string;
	code_url: string;
	follow_id: string;
}

export const fetchPairs = async () => {
	const response = await fetch('https://api.4swap.org/api/pairs');
	const { data } = await response.json();
	if (!data) throw new Error('No data found');
	return data.pairs as Pair[];
};

export const createAction = async (params: ActionRequest) => {
	const response = await fetch('https://api.4swap.org/api/actions/v2', {
		method: 'POST',
		body: JSON.stringify(params),
		headers: {
			ContentType: 'application/json'
		}
	});
	const { data } = await response.json();
	if (!data) throw new Error('No data found');
	return data as ActionResponse;
};

export const fetch4SwapOrder = async (order_id: string, user: RegisteredUser) => {
	const trace_id = v4();
	const token = signAuthenticationToken('GET', `/me`, '', trace_id, {
		...user,
		...user.key
	});

	const response = await fetch(`https://api.4swap.org/api/orders/${order_id}`, {
		method: 'GET',
		headers: {
			ContentType: 'application/json',
			Authorization: `Bearer ${token}`,
			'X-Request-Id': trace_id
		}
	});
	if (response.status === 404) throw new Error('wait...');

	const { data } = await response.json();
	return data as OrderResponse;
};

export const fetch4SwapTxInfo = async (user: RegisteredUser, order: Order, minReceived: string) => {
	const swapAction = `3,${user.user_id},${v4()},${order.fill_asset_id},${
		order.routes
	},${minReceived}`;

	const actionResp = await createAction({
		action: swapAction,
		amount: order.funds,
		asset_id: order.pay_asset_id,
		broker_id: ''
	});

	const codeResp = await fetchCode(actionResp.code);
	const extra = generateExtra(
		JSON.stringify({
			receivers: codeResp.receivers,
			threshold: codeResp.threshold,
			extra: codeResp.memo
		})
	);

	return {
		extra,
		getFollowId: () => Promise.resolve(actionResp.follow_id)
	};
};
