import axios, { type AxiosResponse } from 'axios';
import { TransferClient, type TransferResponse } from '@mixin.dev/mixin-node-sdk';
import type { Order, PreOrderInfo, SwapParams } from '$lib/types/swap';
import type { RegisteredUser } from '../../types/user';
import { generateExtra } from '../sign';
import { MIXPAY_BOT_ID } from '../../constants/common';
import { format } from '../big';

export interface MixPayAsset {
	name: string;
	symbol: string;
	iconUrl: string;
	assetId: string;
	network: string;
	isAsset: boolean;
	chainAsset: {
		id: string;
		symbol: string;
		name: string;
		iconUrl: string;
	};
	minPaymentAmount?: string;
	maxPaymentAmount?: string;
}

interface MixPayBaseResponse {
	code: number;
	success: boolean;
	message: string;
	timestampMs: number;
}

interface MixPayEstimatedPaymentRequest {
	paymentAssetId: string;
	settlementAssetId: string;
	quoteAssetId: string;
	paymentAmount?: string;
	quoteAmount?: string;
}

export interface MixPayEstimatedPaymentResponse extends MixPayBaseResponse {
	data: {
		price: string; // paymentAmount/quoteAmount
		estimatedSettlementAmount: string;
		settlementAssetId: string;
		settlementAssetSymbol: string;
		paymentAssetId: string;
		paymentAssetSymbol: string;
		paymentAmount: string;
		quoteAssetSymbol: string;
		quoteAssetId: string;
		quoteAmount: string;
	};
}

export interface MixPayPaymentResponse extends MixPayBaseResponse {
	data: {
		traceId: string;
		status: `unpaid` | `pending` | `failed` | `success`;

		surplusAmount: string;
		surplusStatus: 'no' | 'pending' | 'sending' | 'success';
		quoteAmount: string;
		quoteAssetSymbol: string;
		paymentAmount: string;
		paymentAssetSymbol: string;
		payableAmount: string;
		payee: string;
		payeeMixinNumber: string;
		payeeAvatarUrl: string;

		txid: string;
		date: string;
		confirmations: number;
		failureCode: string;
		failureReason: string;
		returnTo: string;
	};
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';

const ins = axios.create({
	baseURL: 'https://api.mixpay.me/v1',
	timeout: 3000
});

ins.interceptors.response.use(
	async (res: AxiosResponse) => res.data,
	async (e) => e
);

export const fetchMixPayPaymentAssets = async () =>
	(await ins.get('/setting/payment_assets')).data as MixPayAsset[];
export const fetchMixPaySettlementAssets = async () =>
	(await ins.get('/setting/settlement_assets')).data as MixPayAsset[];

export const fetchMixPayPreOrder = async ({
	inputAsset,
	outputAsset,
	inputAmount,
	outputAmount
}: SwapParams): Promise<PreOrderInfo> => {
	const params: MixPayEstimatedPaymentRequest = {
		paymentAssetId: inputAsset,
		quoteAssetId: outputAsset,
		settlementAssetId: outputAsset
	};
	if (inputAmount) params.paymentAmount = inputAmount;
	if (outputAmount) params.quoteAmount = outputAmount;

	const response = await ins.get<unknown, MixPayEstimatedPaymentResponse>('/payments_estimated', {
		params
	});

	if (response.success) {
		const order = {
			funds: Number(response.data.paymentAmount),
			amount: Number(response.data.estimatedSettlementAmount),
			fill_asset_id: outputAsset,
			pay_asset_id: inputAsset,
			priceImpact: 0,
			routeAssets: [''],
			routeIds: [0],
			route_assets: [''],
			routes: ''
		};
		return {
			order,
			fee: '0',
			price: format({ n: order.amount / order.funds, dp: 8 }),
			minReceived: format({ n: order.amount })
		};
	}

	return {
		order: undefined,
		fee: '',
		price: '',
		minReceived: '',
		errorMessage: response.message
	};
};

const fetchMixPaySwapTraceId = async (
	user: RegisteredUser,
	opponent_id: string,
	memo: string,
	amount: string,
	paymentAssetId: string,
	timestamp: number
): Promise<string> => {
	const client = TransferClient({
		keystore: {
			...user,
			...user.key
		}
	});

	return await new Promise((resolve, reject) => {
		let count = 0;
		const timer = setInterval(async () => {
			count += 1;
			const snapshotArray = await client.snapshots({
				limit: 5,
				offset: '',
				asset: paymentAssetId,
				opponent: MIXPAY_BOT_ID,
				order: 'DESC'
				// todo fix type error
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any);
			const snapshot = snapshotArray.find((snapshot) => {
				if (snapshot.type !== 'transfer') return false;
				return (
					snapshot.opponent_id === opponent_id &&
					snapshot.memo === memo &&
					snapshot.asset_id === paymentAssetId &&
					new Date(snapshot.created_at).getTime() > timestamp &&
					snapshot.amount.startsWith('-') &&
					format({ n: snapshot.amount.slice(1) }) === format({ n: amount })
				);
			});

			if (snapshot) {
				clearInterval(timer);
				resolve((snapshot as TransferResponse).trace_id);
			}
			if (count === 20) {
				clearInterval(timer);
				reject('timeout');
			}
		}, 1000 * 3);
	});
};

export const fetchMixPayTxInfo = (user: RegisteredUser, order: Order) => {
	const memo = Buffer.from(`swap|${user.user_id}|${order.fill_asset_id}`).toString('base64');
	const extra = generateExtra(
		JSON.stringify({
			receivers: [MIXPAY_BOT_ID],
			threshold: 1,
			extra: memo
		})
	);

	return {
		extra,
		getFollowId: (t: number) =>
			fetchMixPaySwapTraceId(user, MIXPAY_BOT_ID, memo, String(order.funds), order.pay_asset_id, t)
	};
};

export const fetchMixPayOrder = async (trace_id: string): Promise<MixPayPaymentResponse> => {
	return await ins.get('/payments_result', {
		params: {
			traceId: trace_id
		}
	});
};
