import { NetworkClient } from "@mixin.dev/mixin-node-sdk";
import type { Asset } from '../types/asset';
import type { RegisteredUser } from '../types/user';

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

export const fetchAssets = async (
	fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<Asset[]> => {
	const response = await fetch('/api/assets');
	return await response.json();
};
