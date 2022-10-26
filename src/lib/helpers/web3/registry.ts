import { ethers } from 'ethers';
import { REGISTRY_ABI } from '../../constants/abis';
import { REGISTRY_ADDRESS } from '../../constants/common';
import type { Asset } from '../../types/asset';
import { mvmProvider } from './common';

export const ReadableRegistryContract = new ethers.Contract(
	REGISTRY_ADDRESS,
	REGISTRY_ABI,
	mvmProvider
);

export const fetchAssetContract = async (assetId: string): Promise<string | undefined> => {
	const id = assetId.replaceAll('-', '');
	const address = await ReadableRegistryContract.contracts(`0x${id}`);
	if (address === '0x0000000000000000000000000000000000000000') return undefined;
	return address;
};

export const fetchUsersContract = (userIds: string[], threshold = 1) => {
	const bufLen = Buffer.alloc(2);
	bufLen.writeUInt16BE(userIds.length);
	const bufThreshold = Buffer.alloc(2);
	bufThreshold.writeUInt16BE(threshold);
	const ids = userIds.join('').replaceAll('-', '');
	const identity = `0x${bufLen.toString('hex')}${ids}${bufThreshold.toString('hex')}`;
	return ReadableRegistryContract.contracts(ethers.utils.keccak256(identity));
};

export const fetchUserContract = (userId: string) => fetchUsersContract([userId]);

export const watchAsset = async (provider: ethers.providers.Web3Provider, asset: Asset) => {
	const address = asset.contract || (await fetchAssetContract(asset.asset_id));

	if (!address) throw new Error('Asset contract not found');

	await provider.provider.request?.({
		method: 'wallet_watchAsset',
		params: {
			options: {
				address,
				decimals: 8,
				image: asset.icon_url,
				symbol: asset.symbol
			},
			type: 'ERC20'
		} as never
	});
};
