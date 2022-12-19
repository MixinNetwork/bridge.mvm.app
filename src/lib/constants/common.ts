import { toHex } from '../helpers/utils';
import type { NetworkParam } from '../types/network';

declare const __version__: string;

export const version = __version__;

export const WITHDRAW_BOT_ID = '131a0774-59a1-4e3d-9af2-e1b43aa37936';
export const MIXPAY_BOT_ID = '3539c3ce-52c0-4b0b-9573-c035ecb98d48';

export const USER_KEY = 'USER';
export const LANG = 'lang';
export const PROVIDER_KEY = 'PROVIDER';
export const PROVIDER_LOGO = 'PROVIDER_LOGO';

export const XIN_ASSET_ID = 'c94ac88f-4671-3976-b60a-09064f1811e8';

export const TRX_ASSET_ID = '25dabac5-056a-48ff-b9f9-f67395dc407c';
export const ETH_ASSET_ID = '43d61dcd-e413-450d-80b8-101d5e903357';
export const BTC_ASSET_ID = 'c6d0c728-2624-429b-8e0d-d9d19b6592fa';
export const EOS_ASSET_ID = '6cfe566e-4aad-470b-8c9a-2fd35b49c68d';
export const MOB_ASSET_ID = 'eea900a8-b327-488c-8d8d-1428702fe240';
export const BOX_ASSET_ID = 'f5ef6b5d-cc5a-3d90-b2c0-a2fd386e7a3c';
export const DOGE_ASSET_ID = '6770a1e5-6086-44d5-b60f-545f9d9e8ffd';
export const BNB_1_ASSET_ID = '17f78d7c-ed96-40ff-980c-5dc62fecbc85';
export const BNB_2_ASSET_ID = '1949e683-6a08-49e2-b087-d6b72398588f';
export const MATIC_ASSET_ID = 'b7938396-3f94-4e0a-9179-d3440718156f';

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

export const WHITELIST_ASSET_4SWAP = [XIN_ASSET_ID, EOS_ASSET_ID, MOB_ASSET_ID, BOX_ASSET_ID];

export const WHITELIST_ASSET = [
	{
		id: BTC_ASSET_ID,
		symbol: 'BTC',
		chain: 'BTC'
	},
	{ id: ETH_ASSET_ID, symbol: 'ETH', chain: 'ETH' },
	{ id: TRX_ASSET_ID, symbol: 'TRX', chain: 'TRX' },
	{ id: EOS_ASSET_ID, symbol: 'EOS', chain: 'EOS' },
	{ id: BOX_ASSET_ID, symbol: 'BOX', chain: 'ETH' },
	{ id: XIN_ASSET_ID, symbol: 'XIN', chain: 'ETH' },
	{ id: MOB_ASSET_ID, symbol: 'MOB', chain: 'MOB' },
	{ id: BNB_1_ASSET_ID, symbol: 'BNB', chain: 'BNB' },
	{ id: BNB_2_ASSET_ID, symbol: 'BNB', chain: 'BNB' },
	{ id: MATIC_ASSET_ID, symbol: 'MATIC', chain: 'MATIC' },
	{ id: '05c5ac01-31f9-4a69-aa8a-ab796de1d041', symbol: 'XMR', chain: 'XMR' },
	{ id: '3e3152d4-6eee-36b3-9685-e8ba54db4a22', symbol: 'JPYC', chain: 'ETH' },
	{
		id: '9b180ab6-6abe-3dc0-a13f-04169eb34bfa',
		symbol: 'USDC',
		chain: 'ETH'
	},
	{
		id: '31d2ea9c-95eb-3355-b65b-ba096853bc18',
		symbol: 'pUSD',
		chain: 'ETH'
	},
	{
		id: 'a31e847e-ca87-3162-b4d1-322bc552e831',
		symbol: 'UNI',
		chain: 'ETH'
	},
	{
		id: 'dcde18b9-f015-326f-b8b1-5b820a060e44',
		symbol: 'SHIB',
		chain: 'ETH'
	},
	{
		id: '2566bf58-c4de-3479-8c55-c137bb7fe2ae',
		symbol: 'ONE',
		chain: 'ETH'
	},
	{
		id: 'f6f1c01c-8489-3346-b127-dc0dc09b9ce7',
		symbol: 'LINK',
		chain: 'ETH'
	},
	{
		id: '9ed81392-757f-3d57-8304-5fd6f81ff357',
		symbol: 'TRX',
		chain: 'ETH'
	},
	{
		id: '8549b4ad-917c-3461-a646-481adc5d7f7f',
		symbol: 'DAI',
		chain: 'ETH'
	},
	{
		id: '83c8bfca-78ee-3845-9e6c-e3d69e7b381c',
		symbol: 'WBTC',
		chain: 'ETH'
	},
	{
		id: 'b80af5fd-85b8-3f00-b7c2-68d2c9f1137a',
		symbol: 'AAVE',
		chain: 'ETH'
	},
	// {
	// 	id: '88b29aef-6059-3351-abbd-0ecfcc574280',
	// 	symbol: 'GRT',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: '4a47d208-ce92-3f24-8a10-541fa17b7620',
	// 	symbol: 'CRV',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: '0cc20afd-d872-326e-b5c7-aa78558cd6af',
	// 	symbol: 'COMP',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: '4488ed2a-bfad-3036-9401-0ee9593aa5ff',
	// 	symbol: 'SUSHI',
	// 	chain: 'ETH'
	// },
	{
		id: '965e5c6e-434c-3fa9-b780-c50f43cd955c',
		symbol: 'CNB',
		chain: 'ETH'
	},
	// {
	// 	id: 'b5289c48-ec3a-3cdb-b2c4-0913d1812cd5',
	// 	symbol: 'mAED',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: '0ff3f325-4f34-334d-b6c0-a3bd8850fc06',
	// 	symbol: 'JPYC',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: 'f1d987df-1835-3f03-aefd-5e3e4132d11e',
	// 	symbol: 'HT',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: '0119f16d-f44c-3c12-9d59-044f5303c028',
	// 	symbol: 'YFI',
	// 	chain: 'ETH'
	// },
	{
		id: '2f5bef0e-d41a-3cf3-b6fa-b8dd0d8a3327',
		symbol: 'EURT',
		chain: 'ETH'
	},
	// {
	// 	id: 'aa189c4c-99ca-39eb-8d96-71a8f6f7218a',
	// 	symbol: 'AKITA',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: '16fefe30-e19d-3229-a432-5d0fdb0abd4f',
	// 	symbol: 'CVC',
	// 	chain: 'ETH'
	// },
	{
		id: 'c3dc19ae-d087-3279-ac51-dc655940256a',
		symbol: 'MANA',
		chain: 'ETH'
	},
	{
		id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
		symbol: 'USDT',
		chain: 'ETH'
	},
	{
		id: 'b91e18ff-a9ae-3dc7-8679-e935d9a4b34b',
		symbol: 'USDT',
		chain: 'TRX'
	},
	{
		id: '5dac5e28-ad13-31ea-869f-41770dfcee09',
		symbol: 'USDT',
		chain: 'EOS'
	},
	// {
	// 	id: 'bb4c9a0c-245b-3bd2-a3f4-a5eb73c90c00',
	// 	symbol: 'RLY',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: '44adc71b-0c37-3b42-aa19-fe2d59dae5fd',
	// 	symbol: 'EPC',
	// 	chain: 'ETH'
	// },
	// {
	// 	id: '75e0414b-b190-3783-995a-e6064d30c55d',
	// 	symbol: 'TYC',
	// 	chain: 'ETH'
	// },
	{
		id: '14693c1a-d835-3572-b9b4-e0cbb62099e5',
		symbol: 'PINK',
		chain: 'EOS'
	},
	{
		id: '659c407a-0489-30bf-9e6f-84ef25c971c9',
		symbol: 'eUSD',
		chain: 'MOB'
	},
	{
		id: '6770a1e5-6086-44d5-b60f-545f9d9e8ffd',
		symbol: 'DOGE',
		chain: 'ETH'
	},
	{
		id: 'cfcd55cd-9f76-3941-81d6-9e7616cc1b83',
		symbol: 'BUSD',
		chain: 'BNB'
	},
	{
		id: '218bc6f4-7927-3f8e-8568-3a3725b74361',
		symbol: 'USDT',
		chain: 'MATIC'
	},
	{
		id: '7cf6f5a4-2b4a-30a1-a7f3-8718b6b5b56e',
		symbol: 'WETH',
		chain: 'MATIC'
	},
	{
		id: '94213408-4ee7-3150-a9c4-9c5cce421c78',
		symbol: 'USDT',
		chain: 'BNB'
	}
];

export const WHITELIST_ASSET_ID = WHITELIST_ASSET.map((asset) => asset.id);

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
