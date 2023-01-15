import {
	elementScroll,
	observeElementOffset,
	observeElementRect,
	observeWindowOffset,
	observeWindowRect,
	Virtualizer,
	windowScroll,
	type PartialKeys,
	type VirtualizerOptions
} from '@tanstack/virtual-core';

import { writable, derived, type Writable } from '@square/svelte-store';

const createVirtualizerBase = <
	TScrollElement extends Window | Element,
	TItemElement extends Element
>(
	options: VirtualizerOptions<TScrollElement, TItemElement>
) => {
	let originalOnChange = options.onChange;

	const virtualizer = new Virtualizer(options);
	const originalSetOptions = virtualizer.setOptions;

	// eslint-disable-next-line prefer-const
	let virtualizerWritable: Writable<Virtualizer<TScrollElement, TItemElement>>;

	const setOptions = (options: Partial<VirtualizerOptions<TScrollElement, TItemElement>>) => {
		originalOnChange = options.onChange || originalOnChange;
		originalSetOptions({
			...virtualizer.options,
			...options,
			onChange: (instance: Virtualizer<TScrollElement, TItemElement>) => {
				virtualizerWritable.set(instance);
				originalOnChange?.(instance);
			}
		});
		virtualizer._willUpdate();
	};

	virtualizerWritable = writable(virtualizer, () => {
		setOptions(options);
		return virtualizer._didMount();
	});

	return derived(virtualizerWritable, (instance) => Object.assign(instance, { setOptions }));
};

export const createVirtualizer = <TScrollElement extends Element, TItemElement extends Element>(
	options: PartialKeys<
		VirtualizerOptions<TScrollElement, TItemElement>,
		'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
	>
) =>
	createVirtualizerBase<TScrollElement, TItemElement>({
		observeElementRect: observeElementRect,
		observeElementOffset: observeElementOffset,
		scrollToFn: elementScroll,
		...options
	});

export const createWindowVirtualizer = <TItemElement extends Element>(
	options: PartialKeys<
		VirtualizerOptions<Window, TItemElement>,
		'getScrollElement' | 'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
	>
) =>
	createVirtualizerBase<Window, TItemElement>({
		getScrollElement: () => (typeof window !== 'undefined' ? window : null),
		observeElementRect: observeWindowRect,
		observeElementOffset: observeWindowOffset,
		scrollToFn: windowScroll,
		...options
	});
