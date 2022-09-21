import axios, { type AxiosResponse } from 'axios';
import type { RegisteredUser } from "../../types/user";
import type { SwapParams } from "../4swap/route";

interface EstimatedPaymentRequest {
  paymentAssetId: string;
  settlementAssetId: string;
  quoteAssetId: string;
  paymentAmount?: string;
  quoteAmount?: string;
}

export interface EstimatedPaymentResponse {
  code: number;
  success: boolean;
  message: string;
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
  timestampMs: number;
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

export const fetchEstimatedPayment = async ({ inputAsset, outputAsset, inputAmount, outputAmount }: SwapParams): Promise<EstimatedPaymentResponse> => {
  const params: EstimatedPaymentRequest = {
    paymentAssetId: inputAsset,
    settlementAssetId: outputAsset,
    quoteAssetId: outputAsset,
  };
  if (inputAmount) params.paymentAmount = inputAmount;
  if (outputAmount) params.quoteAmount = outputAmount;

  return await ins.get('/payments_estimated', { params });
}

export const generatePayment = async (
  user: RegisteredUser,
  inputAsset: string,
  outputAsset: string,
  inputAmount: string
) => {
  const response = await ins.post('https://api.mixpay.me/v1/payments', {
      payeeId: user.user_id,

    })
}
