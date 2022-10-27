import { get } from '@square/svelte-store';
import type { SwapSource } from "$lib/types/swap";
import type { Asset } from '$lib/types/asset';
import type { MixPayAsset } from "$lib/helpers/mixpay/api";
import { pairs } from '$lib/stores/model';
import { WHITELIST_ASSET_4SWAP } from "$lib/constants/common";

export const chooseSwapSource = (
  inputAsset: Asset,
  outputAsset: Asset,
  MixPayPaymentAssets: MixPayAsset[],
  MixPaySettlementAssets: MixPayAsset[],
): SwapSource => {
    const $pairs = get(pairs);

    if (
        (WHITELIST_ASSET_4SWAP.includes(inputAsset.asset_id) || WHITELIST_ASSET_4SWAP.includes(outputAsset.asset_id))
        && (
            $pairs.some((pair) => pair.base_asset_id === outputAsset.asset_id && pair.quote_asset_id === inputAsset.asset_id)
            || $pairs.some((pair) => pair.base_asset_id === inputAsset.asset_id && pair.quote_asset_id === outputAsset.asset_id)
        )
    ) return '4Swap';

    if (
      MixPayPaymentAssets.some((asset) => asset.assetId === inputAsset.asset_id )
      && MixPaySettlementAssets.some((asset) => asset.assetId === outputAsset.asset_id)
    ) return 'MixPay';

    if (
      $pairs.some((pair) => pair.base_asset_id === outputAsset.asset_id && pair.quote_asset_id === inputAsset.asset_id)
      || $pairs.some((pair) => pair.base_asset_id === inputAsset.asset_id && pair.quote_asset_id === outputAsset.asset_id)
    ) return '4Swap';

    return 'NoPair';
};
