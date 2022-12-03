import { tick } from 'svelte';

export const findScrollable = (element: HTMLElement): HTMLElement | undefined => {
	if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
		return element;
	}

	if (element.parentElement) {
		return findScrollable(element.parentElement);
	}

	return undefined;
};

export default (node: HTMLElement) => {
	let scrollable: HTMLElement | null | undefined = undefined;

	const listener = () => {
		if (!scrollable) return;
		node.dispatchEvent(new CustomEvent('parentScroll', { detail: scrollable }));
	};

	tick().then(() => {
		scrollable = node.parentElement && findScrollable(node.parentElement);

		if (scrollable) {
			scrollable.addEventListener('scroll', listener);
		}
	});

	return {
		destroy: () => {
			scrollable?.removeEventListener('scroll', listener);
		}
	};
};
