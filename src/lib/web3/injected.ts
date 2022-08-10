import type { ethers } from 'ethers';

type Provider = ethers.providers.ExternalProvider;

declare global {
	interface Window {
		ethereum?: Provider;
		web3?: { currentProvider: Provider };
		celo?: Provider;
	}
}

const ConnectToInjected = async () => {
	const provider = window.ethereum || window.web3?.currentProvider || window.celo;

	if (!provider) throw new Error('No Web3 Provider found');

	if (window.ethereum) {
		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			await provider.request({ method: 'eth_requestAccounts' });
		} catch (error) {
			throw new Error('User Rejected');
		}
	}
	return provider;
};

export default ConnectToInjected;
