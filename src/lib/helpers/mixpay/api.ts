import axios, { type AxiosResponse } from 'axios';
import type { Order, SwapParams } from '../4swap/route';
import type { RegisteredUser } from '../../types/user';
import { generateExtra } from '../sign';

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

interface MixPayPaymentResponse extends MixPayBaseResponse {
	data: {
		isChain: boolean;
		expire: number;
		seconds: number;

		traceId: string;
		memo: string;
		recipient: string;
		destination: string;
		tag: string;

		quoteAmount: string;
		paymentAmount: string;
		estimatedSettlementAmount: string;
		settlementAssetId: string;
		settlementAssetSymbol: string;
		paymentAssetId: string;
		paymentAssetSymbol: string;
		quoteAssetSymbol: string;
		quoteAssetId: string;
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
	async (e: any) => {
		return e.response.data;
	}
);

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

export const fetchMixPayPayment = async (
	user_id: string,
	trace_id: string,
	inputAsset: string,
	outputAsset: string,
	inputAmount: string
): Promise<MixPayPaymentResponse> => {
	return await ins.post('/payments', {
		payeeId: user_id,
		traceId: trace_id,
		paymentAssetId: inputAsset,
		quoteAssetId: inputAsset,
		settlementAssetId: outputAsset,
		paymentAmount: inputAmount,
		isChain: false
	});
};

export const fetchMixPayTxInfo = async (user: RegisteredUser, trace_id: string, order: Order) => {
	const response = await fetchMixPayPayment(
		user.user_id,
		trace_id,
		order.pay_asset_id,
		order.fill_asset_id,
		String(order.funds)
	);

	const extra = generateExtra(
		JSON.stringify({
			receivers: [response.data.recipient],
			threshold: 1,
			extra: response.data.memo
		})
	);

	return {
		extra,
		follow_id: response.data.traceId
	};
};

export const fetchMixPayOrder = async (trace_id: string): Promise<MixPayPaymentResult> => {
	return await ins.get('/payments_result', {
		params: {
			traceId: trace_id
		}
	});
};
