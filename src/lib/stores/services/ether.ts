import { get } from '@square/svelte-store';
import { switchNetwork } from '../../helpers/web3/common';
import type { Network } from '../../types/network';
import { provider } from '../ether';

const switchNetworkWithProvider = async (network: Network) => {
	const $provider = get(provider);
	if (!$provider) throw new Error('No provider');
	return switchNetwork($provider.provider, network);
};

export const switchMVM = () => switchNetworkWithProvider('mvm');
export const switchMainnet = () => switchNetworkWithProvider('mainnet');
