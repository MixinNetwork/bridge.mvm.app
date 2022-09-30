import { CodeClient, AssetClient } from '@mixin.dev/mixin-node-sdk';
import type { PaymentRequestResponse } from '@mixin.dev/mixin-node-sdk';
import type { Asset } from '../types/asset';
import type { RegisteredUser, User } from '../types/user';
import ExternalClient from '@mixin.dev/mixin-node-sdk/src/client/external';
import { utils } from 'ethers';
import { WHITELIST_ASSET_ID, ETH_ASSET_ID, EOS_ASSET_ID } from '../constants/common';
import { bigMul, format } from './big';
import { fetchMvmTokens } from './mvm/api';
import { getBalance } from './web3/common';
import { fetchAssetContract } from './web3/registry';
import { sortBy } from 'lodash-es';
import type { PairRoutes, SwapParams } from './4swap/route';
import {
	fetchMixPayEstimatedPayment,
	fetchMixPayOrder,
	type MixPayPaymentResult
} from './mixpay/api';
import { fetch4SwapOrder, type OrderResponse } from './4swap/api';

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
		if (asset_id === EOS_ASSET_ID) return '0.5';
		return '';
	}
};

export const fetchAssets = async (user: User) => {
	const assetClient = AssetClient({
		keystore: { ...user, ...user.key },
		requestConfig: { timeout: 1000 * 60 }
	});

	const [allAssets, addresses, ethBalance, tokens] = await Promise.all([
		Promise.all(
			WHITELIST_ASSET_ID.map(async (assetId): Promise<Asset> => assetClient.fetch(assetId))
		),
		Promise.all(
			WHITELIST_ASSET_ID.map(async (id) => ({
				id,
				address: await fetchAssetContract(id)
			}))
		),
		getBalance({
			account: user.address,
			network: 'mvm'
		}),
		fetchMvmTokens(user.address)
	]);

	let assets: Asset[] = allAssets;

	assets = assets.filter((asset) =>
		addresses.find(({ id, address }) => !!address && id === asset.asset_id)
	);

	// balance and set contract
	assets.map((asset) => {
		if (asset.asset_id === ETH_ASSET_ID) {
			asset.balance = ethBalance;
			return;
		}

		asset.contract = addresses.find((a) => a.id === asset.asset_id)?.address;

		const token = tokens.find(
			(token) => token.contractAddress.toLowerCase() === asset.contract?.toLowerCase()
		);
		if (!token) {
			asset.balance = '0';
			return;
		}
		asset.balance = utils.formatUnits(token?.balance, token?.decimals);
	});

	assets = assets.filter(({ contract, asset_id }) => contract || asset_id === ETH_ASSET_ID);

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

	assets = sortBy(
		assets,
		({ balance, price_usd }) => +bigMul(balance, price_usd),
		'balance',
		({ change_usd }) => -Math.abs(+change_usd)
	).reverse();

	const eth = assets.find((asset) => asset.asset_id === ETH_ASSET_ID);
	if (eth) eth.name = 'Etheruem';
	return assets;
};

export const fetchFeeOnAsset = async (
	from: string,
	to: string,
	amount: string
): Promise<string> => {
	const overChargeAmount = (Number(amount) * 1.05).toString();
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

export const fetchSwapPreOrderInfo = async (
	site: string,
	pairRoutes: PairRoutes,
	slippage: number,
	{ inputAsset, outputAsset, inputAmount, outputAmount }: SwapParams
) => {
	try {
		if (site === 'MixPay') {
			const response = await fetchMixPayEstimatedPayment({
				inputAsset,
				outputAsset,
				inputAmount,
				outputAmount
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

			site = '4swap';
		}

		if (site === '4swap') {
			const order = pairRoutes.getPreOrder({
				inputAsset,
				outputAsset,
				inputAmount,
				outputAmount
			});

			return {
				order,
				fee: format({ n: pairRoutes.getFee(order), dp: 8 }),
				price: format({ n: +order.amount / +order.funds, dp: 8 }),
				minReceived: format({ n: +order.amount * +slippage })
			};
		}

		return undefined;
	} catch (e) {
		return undefined;
	}
};

export const checkOrder = async (
	site: '4swap' | 'MixPay',
	order_id: string,
	user: RegisteredUser
): Promise<boolean> => {
	let counter = 0;
	const fetchOrderStatus = site === '4swap' ? fetch4SwapOrder : fetchMixPayOrder;

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
					(site === '4swap' && res && (res as OrderResponse).state === 'Done') ||
					(site === 'MixPay' && res && (res as MixPayPaymentResult).data.status === 'success')
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
