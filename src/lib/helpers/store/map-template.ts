import type { Stores } from '@square/svelte-store';
import { isEqual } from 'lodash-es';

export const mapTemplate = <Key, Store extends Stores = never>(build: (key: Key) => Store) => {
	const cache = new Map<Key, Store>();
	const template = (key: Key) => {
		const k = [...cache.keys()].find((k) => isEqual(k, key));
		if (!k) cache.set(key, build(key));
		const store = cache.get(k || key);
		if (!store) throw new Error('Store not found');
		return store;
	};

	return template;
};
