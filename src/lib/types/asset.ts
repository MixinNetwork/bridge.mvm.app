import type { AssetCommonResponse } from '@mixin.dev/mixin-node-sdk';

export interface Asset extends AssetCommonResponse {
	balance: string;
	contract?: string;
	chain_icon_url?: string;
	chain_name?: string;
	chain_symbol?: string;
}
