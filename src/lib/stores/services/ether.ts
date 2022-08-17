import { derived, get } from '@square/svelte-store';
import { ethers } from 'ethers';
import { REGISTRY_ABI } from '../../constants/abis';
import { REGISTRY_ADDRESS } from '../../constants/common';
import { switchNetwork } from '../../helpers/web3/common';
import type { Network } from '../../types/network';
import { provider, library } from '../ether';

const switchNetworkWithProvider = async (network: Network) => {
	const $provider = get(provider);
	if (!$provider) throw new Error('No provider');
	return switchNetwork($provider.provider, network);
};

export const switchMVM = () => switchNetworkWithProvider('mvm');
export const switchMainnet = () => switchNetworkWithProvider('mainnet');

export const registryContract = derived(
	library,
	($library) => new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, $library)
);
