import qs from 'qs';
import type {RegisteredUser} from "../../types/user";
import type {SwapParams} from "../4swap/route";

const BASE_URI = 'https://api.mixpay.me/v1';

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

export const fetchEstimatedPayment = async ({ inputAsset, outputAsset, inputAmount, outputAmount }: SwapParams) => {
  const params: EstimatedPaymentRequest = {
    paymentAssetId: inputAsset,
    settlementAssetId: outputAsset,
    quoteAssetId: outputAsset,
  };
  if (inputAmount) params.paymentAmount = inputAmount;
  if (outputAmount) params.quoteAmount = outputAmount;

  return await fetch(BASE_URI + '/payments_estimated?' + qs.stringify(params), {
    method: 'GET',
  });
}

export const generatePayment = async (
  user: RegisteredUser,
  inputAsset: string,
  outputAsset: string,
  inputAmount: string
) => {
  const response = await fetch('https://api.mixpay.me/v1/payments', {
    method: 'POST',
    body: JSON.stringify({
      payeeId: user.user_id,

    })
  });

}
