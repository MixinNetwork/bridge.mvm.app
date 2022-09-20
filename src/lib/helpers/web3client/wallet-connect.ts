import WalletConnectProvider from '@walletconnect/web3-provider';

const ConnectToWalletConnect = async () => {
	const provider = new WalletConnectProvider({
		bridge: 'https://bridge.walletconnect.org',
		qrcode: true,
		infuraId: import.meta.env.VITE_INFURA_ID,
		rpc: undefined,
		chainId: 1,
		qrcodeModalOptions: undefined
	});

	await provider.disconnect();
	await provider.enable();
	return provider;
};

export default ConnectToWalletConnect;
