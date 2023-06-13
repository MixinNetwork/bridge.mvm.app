import { type AssetCommonResponse, CodeClient, NetworkClient } from '@mixin.dev/mixin-node-sdk';
import type { PaymentRequestResponse } from '@mixin.dev/mixin-node-sdk';
import type { Asset } from '../types/asset';
import type { RegisteredUser, User } from '../types/user';
import ExternalClient from '@mixin.dev/mixin-node-sdk/src/client/external';
import { utils } from 'ethers';
import { EOS_ASSET_ID, ETH_ASSET_ID, WHITELIST_ASSET_ID } from '../constants/common';
import { bigMul } from './big';
import { fetchMvmTokens } from './mvm/api';
import { getBalance } from './web3/common';
import { fetchAssetContract } from './web3/registry';
import { sortBy } from 'lodash-es';
import { fetchMixPayPreOrder, fetchMixPayOrder, type MixPayPaymentResponse } from './mixpay/api';
import { fetch4SwapOrder, type OrderResponse } from './4swap/api';
import type { SwapSource } from '../types/swap';
import { bigGte } from '$lib/helpers/big';

export const register = async (address: string): Promise<RegisteredUser> => {
	const response = await fetch('https://bridge.mvm.dev/users', {
		method: 'POST',
		body: JSON.stringify({ public_key: address })
	});

	const { user } = await response.json();
	return user;
};

export const fetchWithdrawalFee = async (asset_id: string, destination: string, tag: string) => {
	if (!destination) return undefined;

	const externalClient = ExternalClient();
	try {
		const asset = await externalClient.checkAddress({
			asset: asset_id,
			destination,
			tag
		});
		return asset.fee;
	} catch (e) {
		if (e && typeof e === 'object' && 'code' in e && e.code === 30102) {
			// e.description = 'Invalid address format.'
			return undefined;
		}

		if (asset_id === EOS_ASSET_ID) return '0.5';
		throw e;
	}
};

export const fetchAssets = async (user: User | undefined) => {
	const networkClient = NetworkClient();

	const [allAssets, addresses, ethBalance, tokens] = await Promise.all([
		(async () => {
			const topAssets: AssetCommonResponse[] = await networkClient.topAssets();
			const rest = WHITELIST_ASSET_ID.filter(
				(id) => !topAssets.find(({ asset_id }) => asset_id === id)
			);
			const restAssets = await Promise.all(rest.map((id) => networkClient.fetchAsset(id)));
			return topAssets.concat(restAssets);
		})(),
		Promise.all(
			WHITELIST_ASSET_ID.map(async (id) => ({
				id,
				address: await fetchAssetContract(id)
			}))
		),
		user
			? getBalance({
					account: user.address,
					network: 'mvm'
			  })
			: undefined,
		user ? fetchMvmTokens(user.address) : undefined
	]);

	const eth = allAssets.find((asset) => asset.asset_id === ETH_ASSET_ID);
	if (eth) eth.name = 'Etheruem';

	let assets = allAssets.filter(({ asset_id }) => WHITELIST_ASSET_ID.includes(asset_id));

	assets = assets.filter((asset) =>
		addresses.find(({ id, address }) => !!address && id === asset.asset_id)
	);

	// balance and set contract
	let whiteListAssets = assets.map((a) => {
		const asset = a as Asset;
		if (asset.asset_id === ETH_ASSET_ID && ethBalance) {
			asset.balance = ethBalance;
			return asset;
		}

		asset.contract = addresses.find((a) => a.id === asset.asset_id)?.address;

		const token = tokens?.find(
			(token) => token.contractAddress.toLowerCase() === asset.contract?.toLowerCase()
		);
		if (!token) {
			asset.balance = '0';
			return asset;
		}
		asset.balance = utils.formatUnits(token?.balance, token?.decimals);
		return asset;
	});

	whiteListAssets = whiteListAssets.filter(
		({ contract, asset_id }) => contract || asset_id === ETH_ASSET_ID
	);

	// chain
	const chainIds = [...new Set(whiteListAssets.map(({ chain_id }) => chain_id))];
	const chains = await Promise.all(
		chainIds.map((chainId) => {
			const chain = allAssets.find((asset) => asset.asset_id === chainId);
			if (chain) return chain;

			return networkClient.fetchAsset(chainId);
		})
	);
	whiteListAssets.forEach((asset) => {
		if (asset.asset_id === asset.chain_id) return;

		const chain = chains.find((chain) => chain.asset_id === asset.chain_id);
		if (chain) {
			asset.chain_icon_url = chain.icon_url;
			asset.chain_name = chain.name;
			asset.chain_symbol = chain.symbol;
		}
	});

	whiteListAssets = sortBy(
		whiteListAssets,
		({ balance, price_usd }) => +bigMul(balance, price_usd),
		'balance',
		({ price_usd }) => +price_usd
	).reverse();

	return whiteListAssets;
};

export const fetchFeeOnAsset = async (
	from: string,
	to: string,
	amount: string
): Promise<string> => {
	const overChargeAmount = Number(amount) * 1.05;
	if (!Number.isFinite(overChargeAmount)) return '0';

	const [response, mixPayPreOrder] = await Promise.all([
		fetch('https://api.4swap.org/api/orders/pre', {
			method: 'POST',
			body: JSON.stringify({
				pay_asset_id: from,
				fill_asset_id: to,
				amount: overChargeAmount.toString()
			})
		}),
		fetchMixPayPreOrder({
			inputAsset: from,
			outputAsset: to,
			outputAmount: overChargeAmount.toString()
		})
	]);
	const { data } = (await response.json()) || {};
	const fourSwapPreOrder = data ? Number(data.pay_amount) : undefined;

	let feeOnAsset: number;
	if (mixPayPreOrder.order && fourSwapPreOrder) {
		if (bigGte(fourSwapPreOrder, mixPayPreOrder.order.funds))
			feeOnAsset = mixPayPreOrder.order.funds;
		else feeOnAsset = fourSwapPreOrder;
	} else if (mixPayPreOrder.order) feeOnAsset = mixPayPreOrder.order.funds;
	else if (fourSwapPreOrder) feeOnAsset = fourSwapPreOrder;
	else throw new Error('Can not fetch fee on asset');

	if (feeOnAsset > 0.0001) return (feeOnAsset + 0.0001).toFixed(4);
	return feeOnAsset.toString();
};

export const fetchCode = async (code_id: string): Promise<PaymentRequestResponse> => {
	const client = CodeClient();
	const response = await client.fetch(code_id);
	return response as PaymentRequestResponse;
};

export const fetchExchangeRates = ExternalClient().exchangeRates;

export const checkOrder = async (
	source: SwapSource,
	order_id: string,
	user: RegisteredUser
): Promise<boolean> => {
	let counter = 0;
	const fetchOrderStatus = source === '4Swap' ? fetch4SwapOrder : fetchMixPayOrder;

	return new Promise((resolve, reject) => {
		const timer = setInterval(async () => {
			counter++;

			if (counter === 30) {
				clearInterval(timer);
				reject(false);
			}

			try {
				const res = await fetchOrderStatus(order_id, user);
				if (
					(source === '4Swap' && res && (res as OrderResponse).state === 'Done') ||
					(source === 'MixPay' && res && (res as MixPayPaymentResponse).data?.status === 'success')
				) {
					clearInterval(timer);
					resolve(true);
				}
			} catch (e) {
				return;
			}
		}, 5000);
	});
};
