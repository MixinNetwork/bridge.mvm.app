import { CodeClient, AssetClient } from '@mixin.dev/mixin-node-sdk';
import type { PaymentRequestResponse } from '@mixin.dev/mixin-node-sdk';
import type { Asset, CheckAddressFee } from '../types/asset';
import type { RegisteredUser, User } from '../types/user';
import ExternalClient from '@mixin.dev/mixin-node-sdk/src/client/external';
import { utils } from 'ethers';
import { WHITELIST_ASSET_ID, ETH_ASSET_ID, WHITELIST_ASSET } from '../constants/common';
import { bigMul, bigGte } from './big';
import { fetchMvmTokens } from './mvm/api';
import { getBalance } from './web3/common';

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

export const fetchAssets = async (user: User) => {
	const assetClient = AssetClient({ keystore: { ...user, ...user.key } });

	const [allAssets, ethBalance, tokens] = await Promise.all([
		Promise.all(
			WHITELIST_ASSET_ID.map(async (assetId): Promise<Asset> => assetClient.fetch(assetId))
		),
		getBalance({
			account: user.address,
			network: 'mvm'
		}),
		fetchMvmTokens(user.address)
	]);

	let assets: Asset[] = allAssets.filter((asset) => WHITELIST_ASSET_ID.includes(asset.asset_id));

	// balance and set contract
	assets.map((asset) => {
		if (asset.asset_id === ETH_ASSET_ID) {
			asset.balance = ethBalance;
			return;
		}

		asset.contract = WHITELIST_ASSET.find((a) => a.assetId === asset.asset_id)?.contract;

		const token = tokens.find(
			(token) => token.contractAddress.toLowerCase() === asset.contract?.toLowerCase()
		);
		if (!token) {
			asset.balance = '0';
			return;
		}
		asset.balance = utils.formatUnits(token?.balance, token?.decimals);
	});

	// chain
	const chainIds = [...new Set(assets.map(({ chain_id }) => chain_id))];
	const chains = await Promise.all(
		chainIds.map((chainId) => {
			const chain = allAssets.find((asset) => asset.asset_id === chainId);
			if (chain) return chain;

			return assetClient.fetch(chainId);
		})
	);
	assets.forEach((asset) => {
		if (asset.asset_id === asset.chain_id) return;

		const chain = chains.find((chain) => chain.asset_id === asset.chain_id);
		if (chain) {
			asset.chain_icon_url = chain.icon_url;
			asset.chain_name = chain.name;
			asset.chain_symbol = chain.symbol;
		}
	});

	assets = assets.sort((a, b) => {
		const aBalance = bigMul(a.balance, a.price_usd);
		const bBalance = bigMul(b.balance, b.price_usd);
		return bigGte(aBalance, bBalance) ? -1 : 1;
	});

	const eth = assets.find((asset) => asset.asset_id === ETH_ASSET_ID);
	if (eth) eth.name = 'Etheruem';
	return assets;
};

export const dependAssets = async (
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
