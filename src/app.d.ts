// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { User } from './lib/types/user';
import type { ProviderKey } from './lib/helpers/web3client/type';

declare global {
	namespace App {
		interface Locals {
			user?: User;
			provider?: string;
		}

		// interface Platform {}

		// interface PrivateEnv {}

		// interface PublicEnv {}

		interface Session {
			user?: User;
			provider?: ProviderKey;
		}

		// interface Stuff {}
	}
}
