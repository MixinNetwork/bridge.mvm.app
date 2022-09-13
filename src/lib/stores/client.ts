import { derived } from '@square/svelte-store';
import { user } from './user';
import { AssetClient } from '@mixin.dev/mixin-node-sdk';

export const assetClient = derived(user, ($user) => {
	if (!$user) return;
	return AssetClient({
		keystore: {
			...$user,
			...$user.key
		}
	});
});
