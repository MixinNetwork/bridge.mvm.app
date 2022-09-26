// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { User } from './lib/types/user';
import type { ProviderKey } from './lib/helpers/web3client/type';
import type { Locales } from '$i18n/i18n-types';

declare global {
	namespace App {
		interface Locals {
			user?: User;
			provider?: ProviderKey;
			lang: Locales;
		}

		// interface Platform {}

		// interface PrivateEnv {}

		// interface PublicEnv {}

		// interface Session {}

		// interface Stuff {}
	}
}
