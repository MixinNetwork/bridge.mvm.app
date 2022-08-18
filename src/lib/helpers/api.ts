import { MixinApi } from "@mixin.dev/mixin-node-sdk";
import type { Asset } from '../types/asset';
import type { RegisteredUser, User } from '../types/user';

export const register = async (address: string): Promise<RegisteredUser> => {
	const response = await fetch('https://bridge.mvm.dev/users', {
		method: 'POST',
		body: JSON.stringify({ public_key: address })
	});

	const { user } = await response.json();
	return user;
};

export const fetchAssets = async (
	fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<Asset[]> => {
	const response = await fetch('/api/assets');
	return await response.json();
};

export const getDepositAddress = async (user: User, assetId: string) => {
	const keystore = {
		user_id: user.user_id,
		private_key: user.key.private_key,
		session_id: user.session_id,
	};
	const mixinClient = MixinApi({keystore});
	const { destination } = await mixinClient.asset.fetch(assetId);
	return destination;
};
