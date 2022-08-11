import {
	get,
	writable,
	type Readable,
	type StartStopNotifier,
	type Writable
} from '@square/svelte-store';
import { isEqual } from 'lodash-es';

interface Wrapper<T> {
	onSet?: (newValue: T) => void;
}

export const deepWritable = <T>(
	value: T,
	start?: StartStopNotifier<T>
): Writable<T> & Wrapper<T> => {
	const $writable = writable<T>(value, start);
	const set = $writable.set;

	const wrapper: Partial<Pick<Writable<T>, 'set'>> & Wrapper<T> = {};

	const deepWritable = Object.assign($writable, wrapper);
	deepWritable.set = (newValue: T) => {
		const oldValue = get($writable);

		if (isEqual(oldValue, newValue)) return;
		deepWritable.onSet && deepWritable.onSet(newValue);
		set(newValue);
	};

	return deepWritable;
};

export const deepReadable = <T>(value: T, start?: StartStopNotifier<T>): Readable<T> => ({
	subscribe: writable(value, start).subscribe
});
