import { persistentAtom } from '@nanostores/persistent';

export const lastUrl = persistentAtom<string | undefined>('LAST_URL', undefined);
