import type { AssetResponse } from '@mixin.dev/mixin-node-sdk';

export interface Asset extends AssetResponse {
	contract?: string;
	chain_icon_url?: string;
	chain_name?: string;
}
