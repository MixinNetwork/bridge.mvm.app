import { persistentAtom } from '@nanostores/persistent';
import { derived } from 'svelte/store';
import type RegisteredUser from '../types/user';
import { account } from './ether';

const writableUser = persistentAtom<RegisteredUser | undefined>('USER', undefined, {
	encode: JSON.stringify,
	decode: (encoded) => {
		if (encoded === undefined) return undefined;
		return JSON.parse(encoded);
	}
});

export const register = async (address: string) => {
	const response = await fetch('https://bridge.mvm.dev/users', {
		method: 'POST',
		body: JSON.stringify({ public_key: address })
	});

	const { user } = await response.json();
	writableUser.set(user);
};

export const logout = () => {
	writableUser.set(undefined);
};

export const user = derived(writableUser, ($user) => $user);
export const legalUser = derived([user, account], ([$user, $account]) => {
	if (!$user || !$account) return undefined;
	return $user.full_name.toLowerCase() === $account.toLowerCase();
});
