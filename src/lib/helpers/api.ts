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

export const fetchAssets = async (
	fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>
): Promise<Asset[]> => {
	const response = await fetch('/api/assets');
	return await response.json();
};

export const fetchExchangeRates = ExternalClient().exchangeRates;
