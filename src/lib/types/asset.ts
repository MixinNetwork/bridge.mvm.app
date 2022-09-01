import type { AssetResponse } from '@mixin.dev/mixin-node-sdk';
import type { CheckAddressResponse } from '@mixin.dev/mixin-node-sdk/dist/client/types/network'

export interface Asset extends AssetResponse {
	contract?: string;
	chain_icon_url?: string;
	chain_name?: string;
}

export interface CheckAddressFee extends CheckAddressResponse {
	fee?: string
}
