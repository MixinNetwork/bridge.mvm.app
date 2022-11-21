import { XIN_ASSET_ID, ETH_ASSET_ID } from '../../constants/common';

export const toSwapUrl = (assetId: string) =>
	XIN_ASSET_ID === assetId
		? `swap/?input=${assetId}&output=${ETH_ASSET_ID}`
		: `swap/?input=${assetId}&output=${XIN_ASSET_ID}`;
