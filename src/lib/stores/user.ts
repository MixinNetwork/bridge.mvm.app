import { page } from '$app/stores';
import { derived } from '@square/svelte-store';
import { register } from '../helpers/api';
import { jsonPersistentEncoder, persistentWritable } from '../helpers/store/persistent';
import type { User } from '../types/user';
import { account } from './ether';
import { clearLastProvider } from './provider';
import { USER_KEY } from '$lib/constants/common';
import { dedupe } from '../helpers/store/dedupe';

const persistentUser = persistentWritable<User | undefined>(
	USER_KEY,
	undefined,
	jsonPersistentEncoder
);

export const user = dedupe(
	derived([persistentUser, page], ([$user, $page]) => $user || $page.data.user)
);

export const registerAndSave = async (address: string) => {
	const u = await register(address);
	return persistentUser.set({
		...u,
		address
	});
};

export const logout = () => {
	persistentUser.set(undefined);
	clearLastProvider();
};

export const legalUser = derived([persistentUser, account], ([$user, $account]) => {
	return $user && $user.address === $account;
});

export const address = derived(user, ($user) => $user?.address);

export const shortAddress = derived(address, ($address) => {
	if (!$address) return;
	return $address.slice(0, 4) + '...' + $address.slice(-4);
});
