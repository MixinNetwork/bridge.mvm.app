import { derived, get } from '@square/svelte-store';
import { ethers } from 'ethers';
import { REGISTRY_ABI } from '../../constants/abis';
import { REGISTRY_ADDRESS } from '../../constants/common';
import { switchNetwork } from '../../helpers/web3/common';
import type { Network } from '../../types/network';
import { library } from '../ether';

const switchNetworkWithProvider = async (network: Network) => {
	const $library = get(library);
	if (!$library) throw new Error('No provider');
	return switchNetwork($library, network);
};

export const switchMVM = () => switchNetworkWithProvider('mvm');
export const switchMainnet = () => switchNetworkWithProvider('mainnet');

export const registryContract = derived(
	library,
	($library) => new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, $library)
);
