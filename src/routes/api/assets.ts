import { AssetClient } from '@mixin.dev/mixin-node-sdk';
import type { RequestHandler } from '@sveltejs/kit';
import { ETH_ASSET_ID, WHITELIST } from '$lib/constants/common';
import { getBalance, getERC20Balance } from '$lib/helpers/web3/common';
import { fetchAssetContract } from '$lib/helpers/web3/registry';
import type { Asset } from '$lib/types/asset';
import { bigGte, bigMul } from '$lib/helpers/big';

export const GET: RequestHandler<Record<string, string>, Asset[]> = async ({
	locals: { user, provider }
}) => {
	if (!user || !provider) return { status: 401 };

	const assetClient = AssetClient({ keystore: { ...user, ...user.key } });

	const promises = WHITELIST.map(async (assetId): Promise<Asset> => {
		const isEth = assetId === ETH_ASSET_ID;
		const [asset, contract] = await Promise.all([
			assetClient.fetch(assetId),
			isEth ? Promise.resolve(undefined) : fetchAssetContract(assetId)
		]);

		const balance =
			!isEth && contract
				? await getERC20Balance({
						account: user.address,
						contractAddress: contract,
						network: 'mvm'
				  })
				: await getBalance({
						account: user.address,
						network: 'mvm'
				  });

		return Object.assign(asset, { contract, balance });
	});

	let assets = await Promise.all(promises);

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
