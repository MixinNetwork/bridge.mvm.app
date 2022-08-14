import type { GetSession, Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';
import type { User } from '$lib/types/user';

export const USER_KEY = 'USER';
export const PROVIDER_KEY = 'PROVIDER';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	try {
		const userRaw = cookies[USER_KEY];
		const provider: string = cookies[PROVIDER_KEY];
		if (userRaw && provider) {
			const user: User = JSON.parse(userRaw);

			event.locals.user = user;
			event.locals.provider = provider;
		}
	} catch (e) {
		console.log('hook error', e);
	}

	return await resolve(event);
};

export const getSession: GetSession = ({ locals }) => locals;
