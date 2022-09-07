import toHex from '../helpers/utils';
import type { NetworkParam } from '../types/network';

export const ETH_ASSET_ID = '43d61dcd-e413-450d-80b8-101d5e903357';
export const TRX_ASSET_ID = '25dabac5-056a-48ff-b9f9-f67395dc407c';

export const EOS_ASSET_ID = '6cfe566e-4aad-470b-8c9a-2fd35b49c68d';

export const REGISTRY_PID = 'bd67087276ce3263b9333aa337e212a4';
export const REGISTRY_ADDRESS = '0x3c84B6C98FBeB813e05a7A7813F0442883450B1F';
export const BRIDGE_ADDRESS = '0x0915EaE769D68128EEd9711A0bc4097831BE57F3';
export const STORAGE_ADDRESS = '0xef241988D19892fE4efF4935256087F4fdc5ecAa';

export const MVM_RPC_URI = 'https://geth.mvm.dev/';

export const INFURA_ID = import.meta.env.VITE_INFURA_ID;
export const RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;
export const ETHER_SCAN_URL = 'https://etherscan.io/';

export const MVM_RPC_URL = 'https://geth.mvm.dev/';
export const MVM_SCAN_URL = 'https://scan.mvm.dev/';

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MAINNET_CHAIN_ID = 1;
export const MVM_CHAIN_ID = 73927;

export const MAINNET_CHAIN_HEX_ID = toHex(MAINNET_CHAIN_ID);
export const MVM_CHAIN_HEX_ID = toHex(MVM_CHAIN_ID);

export const WHITELIST_ASSET = [
	{
		assetId: '43d61dcd-e413-450d-80b8-101d5e903357',
		contract: undefined,
		chainSymbol: undefined,
		symbol: 'ETH'
	},
	{
		assetId: 'b91e18ff-a9ae-3dc7-8679-e935d9a4b34b',
		contract: '0xaC2ac36102f96f1FdEd2724F1d54b9FCa6bBf1Ee',
		chainSymbol: 'TRX',
		symbol: 'USDT'
	},
	{
		assetId: '6cfe566e-4aad-470b-8c9a-2fd35b49c68d',
		contract: '0xE968257b324264858c0704fcd260D6673D7fE5cF',
		chainSymbol: undefined,
		symbol: 'EOS'
	},
	{
		assetId: 'c94ac88f-4671-3976-b60a-09064f1811e8',
		contract: '0x034A771797a1C8694Bc33E1AA89f51d1f828e5A4',
		chainSymbol: 'ETH',
		symbol: 'XIN'
	},
	{
		assetId: 'f5ef6b5d-cc5a-3d90-b2c0-a2fd386e7a3c',
		contract: '0xBcbC18B37250aC7E9F983141046D56c0aB032d00',
		chainSymbol: 'ETH',
		symbol: 'BOX'
	},
	{
		assetId: '31d2ea9c-95eb-3355-b65b-ba096853bc18',
		contract: '0xa8090F6f19295321968B2f3BcDB44d20bB15742e',
		chainSymbol: 'ETH',
		symbol: 'pUSD'
	},
	{
		assetId: '25dabac5-056a-48ff-b9f9-f67395dc407c',
		contract: '0xc39cB12df2Ab413d4f3D1a2212a09bBF98fF650e',
		chainSymbol: undefined,
		symbol: 'TRX'
	},
	{
		assetId: 'eea900a8-b327-488c-8d8d-1428702fe240',
		contract: '0xE3cb8a2b08A760d4FC04d9C1f609d1c82fB75f60',
		chainSymbol: undefined,
		symbol: 'MOB'
	},
	{
		assetId: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
		contract: '0x59e0f2E9254dB4D662eF36a02118eC5DBd9f8dfb',
		chainSymbol: 'ETH',
		symbol: 'USDT'
	},
	{
		assetId: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
		contract: '0x0e42Ae5649B3a67842AF0F3fC21d09d9b850A694',
		chainSymbol: undefined,
		symbol: 'BTC'
	}
];

export const WHITELIST_ASSET_ID = WHITELIST_ASSET.map((item) => item.assetId);

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
		chainName: 'Mixin Virtual Machine',
		nativeCurrency: { name: 'Ethereum', decimals: 18, symbol: 'ETH' },
		blockExplorerUrls: [MVM_SCAN_URL]
	}
};

export const TRANSACTION_GAS = 0.0000035;

export const average_block_time = {};
