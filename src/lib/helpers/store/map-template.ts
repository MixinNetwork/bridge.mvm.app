import type { Stores } from '@square/svelte-store';

export const mapTemplate = <
	Key extends string | number | symbol = string,
	Store extends Stores = never
>(
	build: (key: Key) => Store
) => {
	const cache = {} as Record<Key, Store>;
	const template = (key: Key) => {
		if (!cache[key]) cache[key] = build(key);
		return cache[key];
	};

	return template;
};
