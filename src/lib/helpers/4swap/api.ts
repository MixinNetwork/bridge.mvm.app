import { v4 } from "uuid";
import { signAuthenticationToken } from "@mixin.dev/mixin-node-sdk";
import type { RegisteredUser } from "../../types/user";

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

export const fetchOrder = async (order_id: string, user: RegisteredUser) => {
	const trace_id = v4();
	const token = signAuthenticationToken(
		'GET',
		`/me`,
		'',
		trace_id,
		{
			...user,
			...user.key
		}
	);

	const response = await fetch(`https://api.4swap.org/api/orders/${order_id}`, {
		method: 'GET',
		headers: {
			ContentType: 'application/json',
			Authorization: `Bearer ${token}`,
			'X-Request-Id': trace_id
		}
	});
	const { data } = await response.json();
	return data;
}

export const checkOrder = async (order_id: string, user: RegisteredUser) => {
	const timer = setInterval(async () => {
		const res = await fetchOrder(order_id, user);

		if (res && res.state === 'done') {
			clearInterval(timer);

		}
	}, 2000)
}
