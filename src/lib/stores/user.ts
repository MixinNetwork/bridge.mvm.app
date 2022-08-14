import { derived } from '@square/svelte-store';
import { USER_KEY } from '../../hooks';
import { register } from '../helpers/api';
import { jsonPersistentEncoder, persistentWritable } from '../helpers/store/persistent';
import type { User } from '../types/user';
import { account } from './ether';
import { clearLastProvider } from './provider';

export const user = persistentWritable<User | undefined>(
	USER_KEY,
	undefined,
	jsonPersistentEncoder
);

export const registerAndSave = async (address: string) => {
	const u = await register(address);
	return user.set({
		...u,
		address
	});
};

export const logout = () => {
	user.set(undefined);
	clearLastProvider();
};

export const legalUser = derived([user, account], ([$user, $account]) => {
	return $user && $user.address === $account;
});
export const shortAddress = derived(user, ($user) => {
	const account = $user?.address;
	if (!account) return;

	return account.slice(0, 4) + '...' + account.slice(-4);
});
