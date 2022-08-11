import type { NetworkParam } from '../types/network';

export const ETH_ASSET_ID = '43d61dcd-e413-450d-80b8-101d5e903357';

export const REGISTRY_ADDRESS = '0x3c84B6C98FBeB813e05a7A7813F0442883450B1F';
export const BRIDGE_ADDRESS = '0x12266b2BbdEAb152f8A0CF83c3997Bc8dbAD0be0';

export const MVM_RPC_URI = 'https://geth.mvm.dev/';

export const INFURA_ID = import.meta.env.VITE_INFURA_ID;
export const RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;
export const ETHER_SCAN_URL = 'https://etherscan.io/';

export const MVM_RPC_URL = 'https://geth.mvm.dev/';
export const MVM_SCAN_URL = 'https://scan.mvm.dev/';

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MAINNET_CHAIN_ID = 1;
export const MVM_CHAIN_ID = 73927;

export const MAINNET_CHAIN_HEX_ID = '0x1';
export const MVM_CHAIN_HEX_ID = '0x120C7';

export const WHITELIST = [
	'c6d0c728-2624-429b-8e0d-d9d19b6592fa', // btc
	'4d8c508b-91c5-375b-92b0-ee702ed2dac5', // usdt
	'eea900a8-b327-488c-8d8d-1428702fe240', // mob
	'43d61dcd-e413-450d-80b8-101d5e903357', // eth
	'25dabac5-056a-48ff-b9f9-f67395dc407c', // trx
	'31d2ea9c-95eb-3355-b65b-ba096853bc18', // pusd
	'f5ef6b5d-cc5a-3d90-b2c0-a2fd386e7a3c', // box
	'c94ac88f-4671-3976-b60a-09064f1811e8', // xin
	'965e5c6e-434c-3fa9-b780-c50f43cd955c' // cnb
];

export const networkParams: Record<string, NetworkParam> = {
	[MAINNET_CHAIN_HEX_ID]: {
		chainId: MAINNET_CHAIN_HEX_ID,
		rpcUrls: [RPC_URL],
		chainName: 'Ethereum Mainnet',
		nativeCurrency: { name: 'Ethereum', decimals: 18, symbol: 'ETH' },
		blockExplorerUrls: [ETHER_SCAN_URL]
	},
	[MVM_CHAIN_HEX_ID]: {
		chainId: MVM_CHAIN_HEX_ID,
		rpcUrls: [MVM_RPC_URL],
		chainName: 'MVM Mainnet',
		nativeCurrency: { name: 'Ethereum', decimals: 18, symbol: 'ETH' },
		blockExplorerUrls: [MVM_SCAN_URL]
	}
};
