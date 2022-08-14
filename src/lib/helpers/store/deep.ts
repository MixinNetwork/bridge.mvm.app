import { get, type Readable, type StartStopNotifier, type Writable } from '@square/svelte-store';
import { isEqual } from 'lodash-es';
import { safeWritable } from './safe';

interface Wrapper<T> {
	onSet?: (newValue: T) => void;
}

export const deepWritable = <T>(
	value: T,
	start?: StartStopNotifier<T>
): Writable<T> & Wrapper<T> => {
	const $writable = safeWritable<T>(value, start);
	const set = $writable.set;

	const deepWritable = $writable as Writable<T> & Wrapper<T>;

	deepWritable.set = (newValue: T) => {
		const oldValue = get($writable);

		if (isEqual(oldValue, newValue)) return;
		deepWritable.onSet && deepWritable.onSet(newValue);
		set(newValue);
	};

	return deepWritable;
};

export const deepReadable = <T>(value: T, start?: StartStopNotifier<T>): Readable<T> => ({
	subscribe: deepWritable(value, start).subscribe
});
