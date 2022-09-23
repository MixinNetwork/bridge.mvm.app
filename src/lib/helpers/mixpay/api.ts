import axios, { type AxiosResponse } from 'axios';
import type { Order, SwapParams } from "../4swap/route";
import {generateExtra} from "../sign";

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
  }
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';

const ins = axios.create({
  baseURL: 'https://api.mixpay.me/v1',
  timeout: 3000,
});

ins.interceptors.response.use(async (res: AxiosResponse) => {
  return res.data;
}, async (e: any) => {
  return e.response.data;
});

export const fetchMixPayEstimatedPayment = async ({ inputAsset, outputAsset, inputAmount, outputAmount }: SwapParams): Promise<MixPayEstimatedPaymentResponse> => {
  const params: MixPayEstimatedPaymentRequest = {
    paymentAssetId: inputAsset,
    settlementAssetId: outputAsset,
    quoteAssetId: outputAsset,
  };
  if (inputAmount) params.paymentAmount = inputAmount;
  if (outputAmount) params.quoteAmount = outputAmount;
  return await ins.get('/payments_estimated', { params });
}

export const fetchMixPayPayment = async (
  user_id: string,
  trace_id: string,
  inputAsset: string,
  outputAsset: string,
  inputAmount: string
): Promise<MixPayPaymentResponse> => {
  return await ins.post('https://api.mixpay.me/v1/payments', {
      payeeId: user_id,
      traceId: trace_id,
      paymentAssetId: inputAsset,
      settlementAssetId: outputAsset,
      quoteAssetId: outputAsset,
      paymentAmount: inputAmount,
      isChain: true,
    })
}

export const fetchMixPayTxInfo = async (
  user_id: string,
  trace_id: string,
  order: Order,
) => {
  const response = await fetchMixPayPayment(
    user_id,
    trace_id,
    order.pay_asset_id,
    order.fill_asset_id,
    String(order.funds)
  );

  const extra = generateExtra(
    JSON.stringify({
      // receivers: [response.data.recipient],
      // threshold: 1,
      destination: response.data.destination,
      tag: response.data.tag,
      extra: response.data.memo
    })
  );
  return {
    extra,
    follow_id: response.data.traceId
  }
}
