import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';
import type { User } from '$lib/types/user';
import { PROVIDER_KEY, USER_KEY } from '$lib/constants/common';
import type { ProviderKey } from '$lib/helpers/web3client/type';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	try {
		const userRaw = cookies[USER_KEY];
		const provider = cookies[PROVIDER_KEY] as ProviderKey | undefined;
		if (userRaw && provider) {
			const user: User = JSON.parse(userRaw);

			event.locals.user = user;
			event.locals.provider = provider;
		}
	} catch (e) {
		console.log('hook error', e);
	}
	return resolve(event);
};
