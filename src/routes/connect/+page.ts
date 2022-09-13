import walletConnect from '$lib/assets/logo/wallet-connect.svg';
import metamask from '$lib/assets/logo/metamask.svg';
import type { ProviderKey } from '$lib/helpers/web3client/type';

interface IProvider {
	key: ProviderKey;
	title: string;
	desc: string;
	icon: string;
}

export const providers: IProvider[] = [
	{
		key: 'injected',
		title: 'Metamask',
		desc: 'Connect using browser wallet',
		icon: metamask
	},
	{
		key: 'walletconnect',
		title: 'WalletConnect',
		desc: 'Connect using WalletConnect',
		icon: walletConnect
	}
];
