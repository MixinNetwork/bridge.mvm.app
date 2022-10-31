import axios, { type AxiosResponse } from 'axios';
import { TransferClient, type TransferResponse } from '@mixin.dev/mixin-node-sdk';
import type { Order, SwapParams } from '../4swap/route';
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

export interface MixPayPaymentResult extends MixPayBaseResponse {
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
	async (res: AxiosResponse) => {
		return res.data;
	},
	async (e) => {
		return e.response.data;
	}
);

export const fetchMixPayPaymentAssets = async () => {
	const response = await fetch('https://api.mixpay.me/v1/setting/payment_assets');
	const { data } = await response.json();
	if (!data) throw new Error('No data found');
	return data as MixPayAsset[];
};
export const fetchMixPaySettlementAssets = async () => {
	const response = await fetch('https://api.mixpay.me/v1/setting/settlement_assets');
	const { data } = await response.json();
	if (!data) throw new Error('No data found');
	return data as MixPayAsset[];
};

export const fetchMixPayEstimatedPayment = async ({
	inputAsset,
	outputAsset,
	inputAmount,
	outputAmount
}: SwapParams): Promise<MixPayEstimatedPaymentResponse> => {
	const params: MixPayEstimatedPaymentRequest = {
		paymentAssetId: inputAsset,
		quoteAssetId: inputAsset,
		settlementAssetId: outputAsset
	};
	if (inputAmount) params.paymentAmount = inputAmount;
	if (outputAmount) params.quoteAmount = outputAmount;
	return await ins.get('/payments_estimated', { params });
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
			});
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

export const fetchMixPayOrder = async (trace_id: string): Promise<MixPayPaymentResult> => {
	return await ins.get('/payments_result', {
		params: {
			traceId: trace_id
		}
	});
};
