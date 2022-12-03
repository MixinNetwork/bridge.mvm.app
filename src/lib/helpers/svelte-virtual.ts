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

import { writable, derived } from '@square/svelte-store';

const createVirtualizerBase = <TScrollElement, TItemElement extends Element, UpdateOptions>(
	options: VirtualizerOptions<TScrollElement, TItemElement>
) => {
	const virtualizer = new Virtualizer(options);

	const virtualizerWritable = writable({ virtualizer }, () => virtualizer._didMount);
	const virtualizerReadable = derived(virtualizerWritable, ({ virtualizer }) => virtualizer);

	const originalOptions = options;

	const setOptions = (options: UpdateOptions) => {
		const newOptions = { ...originalOptions, ...options };
		virtualizer.setOptions({
			...newOptions,
			onChange: (instance: Virtualizer<TScrollElement, TItemElement>) => {
				virtualizerWritable.set({ virtualizer: instance });
				newOptions.onChange?.(instance);
			}
		});
		virtualizer._willUpdate();
	};

	setOptions(options as UpdateOptions);

	return {
		subscribe: virtualizerReadable.subscribe,
		setOptions
	};
};

export type CreateVirtualizerOptions<TScrollElement, TItemElement extends Element> = PartialKeys<
	VirtualizerOptions<TScrollElement, TItemElement>,
	'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;

export const createVirtualizer = <TScrollElement, TItemElement extends Element>(
	options: CreateVirtualizerOptions<TScrollElement, TItemElement>
) =>
	createVirtualizerBase<
		TScrollElement,
		TItemElement,
		CreateVirtualizerOptions<TScrollElement, TItemElement>
	>({
		observeElementRect: observeElementRect,
		observeElementOffset: observeElementOffset,
		scrollToFn: elementScroll,
		...options
	});

export type CreateWindowVirtualizerOptions<TItemElement extends Element> = PartialKeys<
	VirtualizerOptions<Window, TItemElement>,
	'getScrollElement' | 'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;

export const createWindowVirtualizer = <TItemElement extends Element>(
	options: CreateWindowVirtualizerOptions<TItemElement>
) =>
	createVirtualizerBase<Window, TItemElement, CreateWindowVirtualizerOptions<TItemElement>>({
		getScrollElement: () => (typeof window !== 'undefined' ? window : null),
		observeElementRect: observeWindowRect,
		observeElementOffset: observeWindowOffset,
		scrollToFn: windowScroll,
		...options
	});
