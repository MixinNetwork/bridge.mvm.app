import {
	BNB_1_ASSET_ID,
	BNB_2_ASSET_ID,
	DOGE_ASSET_ID,
	EOS_ASSET_ID,
	ETH_ASSET_ID,
	MATIC_ASSET_ID,
	MOB_ASSET_ID,
	TRX_ASSET_ID
} from '../constants/common';

const cryptoRegExps: {
	[key: string]: RegExp | undefined;
} = {
	[ETH_ASSET_ID]: /^0x[a-fA-F0-9]{40}$/,
	[MOB_ASSET_ID]: /^[1-9A-HJ-NP-Za-km-z]+$/,
	[EOS_ASSET_ID]: /^[.1-5a-z]{1,12}$/,
	[DOGE_ASSET_ID]: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/,
	[TRX_ASSET_ID]: /^T[a-zA-Z1-9]{33}$/,
	[MATIC_ASSET_ID]: /^0x[a-fA-F0-9]{40}$/,
	[BNB_1_ASSET_ID]: /^bnb[a-z0-9]{39}$/,
	[BNB_2_ASSET_ID]: /^0x[a-fA-F0-9]{40}$/
};

export const isValidAddress = (address: string, assetId: string) => {
	const regExp = cryptoRegExps[assetId];
	if (!regExp) return true;
	return !!address.match(regExp);
};
