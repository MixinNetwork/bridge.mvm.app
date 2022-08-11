import type { Writable } from '@square/svelte-store';
import { deepWritable } from './deep';

export interface PersistentEncoder<Origin = unknown> {
	encode: (value: Origin) => string;
	decode: (encoded: string) => Origin;
}

const getItem = (key: string) => {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(key);
};

const removeItem = (key: string) => {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(key);
};

const setItem = (key: string, value: string): void => {
	if (typeof window === 'undefined') return;
	localStorage.setItem(key, value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonPersistentEncoder: PersistentEncoder<any> = {
	decode: JSON.parse,
	encode: JSON.stringify
};

export const persistentWritable = <T>(
	key: string,
	initial: T,
	option?: PersistentEncoder<T>
): Writable<T> => {
	const decode = (value: string | null): T => {
		if (!value) return initial;
		if (!option) return value as T;
		return option.decode(value);
	};

	const raw = getItem(key);
	const $deepWritable = deepWritable<T>(decode(raw));

	$deepWritable.onSet = (value: T) => {
		if (!value) return removeItem(key);
		const raw = option ? option.encode(value) : (value as string);
		setItem(key, raw);
	};

	return $deepWritable;
};
