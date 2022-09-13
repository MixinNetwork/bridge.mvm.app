import { derived, type Readable } from '@square/svelte-store';
import { isEqual } from 'lodash-es';

// dedupe updates so our store only notifies when changes happen
export function dedupe<T>(store: Readable<T>): Readable<T> {
	let previous: T;

	return derived(store, ($value, set) => {
		if (isEqual($value, previous)) return;
		previous = $value;
		set($value);
	});
}
