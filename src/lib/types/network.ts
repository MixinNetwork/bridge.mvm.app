export interface Network {
	chainId: string;
	rpcUrls: string[];
	chainName: string;
	nativeCurrency: { name: string; decimals: number; symbol: string };
	blockExplorerUrls: string[];
	iconUrls?: string[];
}

export default Network;
