/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '*.svg?component' {
	const content: SvelteComponent;
	export default content;
}

declare module '*.svg?url' {
	const content: string;
	export default content;
}

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onparentScroll?: (event: CustomEvent<Element>) => void;
	}
}
