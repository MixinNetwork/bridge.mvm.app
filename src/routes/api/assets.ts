import { AssetClient, NetworkClient } from '@mixin.dev/mixin-node-sdk';
import type { RequestHandler } from '@sveltejs/kit';
import { ETH_ASSET_ID, WHITELIST_ASSET, WHITELIST_ASSET_ID } from '$lib/constants/common';
import { getBalance } from '$lib/helpers/web3/common';
import type { Asset } from '$lib/types/asset';
import { bigGte, bigMul } from '$lib/helpers/big';
import { getMvmTokens } from '../../lib/helpers/mvm/api';
import { utils } from 'ethers';

export const GET: RequestHandler<Record<string, string>, Asset[]> = async ({
	locals: { user, provider }
}) => {
	if (!user || !provider) return { status: 401 };

	const assetClient = AssetClient({ keystore: { ...user, ...user.key } });
	const networkClient = NetworkClient();

	const [topAssets, ethBalance, tokens] = await Promise.all([
		networkClient.topAssets(),
		getBalance({
			account: user.address,
			network: 'mvm'
		}),
		getMvmTokens(user.address)
	]);

	let assets: Asset[] = topAssets.filter((asset) => WHITELIST_ASSET_ID.includes(asset.asset_id));

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
			const chain = assets.find((asset) => asset.asset_id === chainId);
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

	return {
		status: 200,
		body: assets
	};
};
