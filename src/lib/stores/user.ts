import { persistentAtom } from '@nanostores/persistent';
import { derived } from 'svelte/store';
import { register } from '../services';
import type RegisteredUser from '../types/user';
import { account } from './ether';

const writableUser = persistentAtom<RegisteredUser | undefined>('USER', undefined, {
	encode: JSON.stringify,
	decode: (encoded) => {
		if (encoded === undefined) return undefined;
		return JSON.parse(encoded);
	}
});

export const registerAndSave = async (address: string) => writableUser.set(await register(address));

export const logout = () => writableUser.set(undefined);

export const user = derived(writableUser, ($user) => $user);
export const legalUser = derived([user, account], ([$user, $account]) => {
	if (!$user || !$account) return undefined;
	return $user.full_name.toLowerCase() === $account.toLowerCase();
});

export const shortAddress = derived(writableUser, ($writableUser) => {
	const account = $writableUser?.full_name;
	if (!account) return;

	return account.slice(0, 4) + '...' + account.slice(-4);
});
