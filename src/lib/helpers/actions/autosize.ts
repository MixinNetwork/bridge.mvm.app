import autosize from 'autosize';

export default Object.assign(
	(node: Element) => {
		autosize(node);

		return {
			destroy() {
				autosize.destroy(node);
			}
		};
	},
	{
		update: autosize.update
	}
);
