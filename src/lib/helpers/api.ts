import { CodeClient } from '@mixin.dev/mixin-node-sdk';
import ExternalClient from '@mixin.dev/mixin-node-sdk/src/client/external';
import type { PaymentRequestResponse } from '@mixin.dev/mixin-node-sdk';
import type { Asset, CheckAddressFee } from '../types/asset';
import type { RegisteredUser } from '../types/user';

export const register = async (address: string): Promise<RegisteredUser> => {
	const response = await fetch('https://bridge.mvm.dev/users', {
		method: 'POST',
		body: JSON.stringify({ public_key: address })
	});

	const { user } = await response.json();
	return user;
};

export const fetchWithdrawalFee = async (asset_id: string, destination: string) => {
	if (!destination) return '';

	const externalClient = ExternalClient();
	const asset = (await externalClient.checkAddress({
		asset: asset_id,
		destination
	})) as CheckAddressFee;

	return asset.fee;
};

export const fetchAssets = async (
	fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<Asset[]> => {
	const response = await fetch('/api/assets');
	return await response.json();
};

export const fetchFeeOnAsset = async (
	from: string,
	to: string,
	amount: string
): Promise<string> => {
	const overChargeAmount = (Number(amount) * 1.01).toString();
	if (Number.isNaN(overChargeAmount)) return '0';

	const response = await fetch('https://api.4swap.org/api/orders/pre', {
		method: 'POST',
		body: JSON.stringify({
			pay_asset_id: from,
			fill_asset_id: to,
			amount: overChargeAmount
		})
	});
	const { data } = await response.json();

	if (data) {
		const payAmount = Number(data.pay_amount);
		if (payAmount > 0.0001) return (payAmount + 0.0001).toFixed(4);
		return payAmount.toString();
	}

	return '';
};

export const fetchCode = async (code_id: string): Promise<PaymentRequestResponse> => {
	const client = CodeClient();
	const response = await client.fetch(code_id);
	return response as PaymentRequestResponse;
};

export const fetchExchangeRates = ExternalClient().exchangeRates;
