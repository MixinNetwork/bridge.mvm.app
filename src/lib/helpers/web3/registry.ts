import { ethers } from 'ethers';
import { REGISTRY_ABI } from '../../constants/abis';
import { REGISTRY_ADDRESS } from '../../constants/common';
import { mvmProvider } from './common';

export const registryContract = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, mvmProvider);

export const fetchAssetContract = (assetId: string): string => {
	const id = assetId.replaceAll('-', '');
	return registryContract.contracts(`0x${id}`);
};

export const fetchUsersContract = (userIds: string[], threshold = 1) => {
	const bufLen = Buffer.alloc(2);
	bufLen.writeUInt16BE(userIds.length);
	const bufThreshold = Buffer.alloc(2);
	bufThreshold.writeUInt16BE(threshold);
	const ids = userIds.join('').replaceAll('-', '');
	const identity = `0x${bufLen.toString('hex')}${ids}${bufThreshold.toString('hex')}`;
	return registryContract.contracts(ethers.utils.keccak256(identity));
};

export const fetchUserContract = (userId: string) => fetchUsersContract([userId]);
