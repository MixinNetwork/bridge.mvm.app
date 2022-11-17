import type { Writable } from '@square/svelte-store';
import { deepWritable } from './deep';
import Cookies from 'js-cookie';

export interface PersistentEncoder<Origin = unknown> {
	encode: (value: Origin) => string;
	decode: (encoded: string) => Origin;
}

export interface PersistentStore {
	getItem: (key: string) => string | null | undefined;
	setItem: (key: string, value: string) => void;
	removeItem: (key: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonPersistentEncoder: PersistentEncoder<any> = {
	decode: JSON.parse,
	encode: JSON.stringify
};

const localStoragePersistentStore: PersistentStore = {
	getItem: (key: string) => {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(key);
	},

	removeItem: (key: string) => {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(key);
	},

	setItem: (key: string, value: string): void => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(key, value);
	}
};

const cookiePersistentStore: PersistentStore = {
	getItem: (key: string) => {
		if (typeof window === 'undefined') return;
		return Cookies.get(key);
	},
	setItem: (key: string, value: string) => {
		if (typeof window === 'undefined') return;
		Cookies.set(key, value);
	},

	removeItem: (key: string) => {
		if (typeof window === 'undefined') return;
		Cookies.remove(key);
	}
};

export const persistentWritable = <T>(
	key: string,
	initial: T,
	option?: PersistentEncoder<T> & {
		store?: 'cookie' | 'localstorage';
	}
): Writable<T> => {
	const decode = (value: string | null | undefined): T => {
		if (!value) return initial;
		if (!option?.decode) return value as T;
		return option.decode(value);
	};

	const { getItem, setItem, removeItem } =
		option?.store === 'localstorage' ? localStoragePersistentStore : cookiePersistentStore;

	const raw = getItem(key);
	const $deepWritable = deepWritable<T>(decode(raw));

	$deepWritable.onSet = (value: T) => {
		if (!value) return removeItem(key);
		const raw = option?.encode ? option.encode(value) : (value as string);
		setItem(key, raw);
	};

	return $deepWritable;
};
