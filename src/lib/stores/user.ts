import { session } from '$app/stores';
import { derived, get } from '@square/svelte-store';
import { USER_KEY } from '../../hooks';
import { register } from '../helpers/api';
import { jsonPersistentEncoder, persistentWritable } from '../helpers/store/persistent';
import type { User } from '../types/user';
import { account } from './ether';
import { clearLastProvider } from './provider';

const persistentUser = persistentWritable<User | undefined>(
	USER_KEY,
	undefined,
	jsonPersistentEncoder
);

export const user = derived(persistentUser, ($user) => $user || get(session).user);

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
