import { AssetClient, NetworkClient } from '@mixin.dev/mixin-node-sdk';
import type { Asset } from '../types/asset';
import type { RegisteredUser, User } from '../types/user';
import ExternalClient from '@mixin.dev/mixin-node-sdk/src/client/external';
import { utils } from 'ethers';
import { WHITELIST_ASSET_ID, ETH_ASSET_ID, WHITELIST_ASSET } from '../constants/common';
import { bigMul, bigGte } from './big';
import { getMvmTokens } from './mvm/api';
import { getBalance } from './web3/common';

export const register = async (address: string): Promise<RegisteredUser> => {
	const response = await fetch('https://bridge.mvm.dev/users', {
		method: 'POST',
		body: JSON.stringify({ public_key: address })
	});

	const { user } = await response.json();
	return user;
};

export const fetchWithdrawalFee = async (asset_id: string) => {
	const networkClient = NetworkClient();
	const asset = await networkClient.fetchAsset(asset_id);
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
		getMvmTokens(user.address)
	]);

	let assets: Asset[] = allAssets.filter((asset) => WHITELIST_ASSET_ID.includes(asset.asset_id));

	// balance and set contract
	assets.map((asset) => {
		if (asset.asset_id === ETH_ASSET_ID) {
			asset.balance = ethBalance;
			return;
		}

		asset.contract = WHITELIST_ASSET.find((a) => a.assetId === asset.asset_id)?.contract;

		const token = tokens.find((token) => token.contractAddress === asset.contract);
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

export const fetchExchangeRates = ExternalClient().exchangeRates;
