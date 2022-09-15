const _findScrollable = (element: HTMLElement): HTMLElement | undefined => {
	if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
		return element;
	}

	if (element.parentElement) {
		return _findScrollable(element.parentElement);
	}

	return undefined;
};

export const scrollableParent = (node: HTMLElement) => {
	const scrollable = node.parentElement && _findScrollable(node.parentElement);

	const listener = () => {
		if (!scrollable) return;
		node.dispatchEvent(new CustomEvent('parentScroll', { detail: scrollable }));
	};

	if (scrollable) {
		scrollable.addEventListener('scroll', listener);
	}
	return {
		destroy: () => {
			scrollable?.removeEventListener('scroll', listener);
		}
	};
};
