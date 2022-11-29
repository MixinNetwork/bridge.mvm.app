import autosize from 'autosize';

export default (node: Element) => {
	autosize(node);

	return {
		destroy() {
			autosize.destroy(node);
		}
	};
};
