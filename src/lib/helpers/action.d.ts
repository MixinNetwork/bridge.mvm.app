/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onparentScroll?: (event: CustomEvent<Element>) => void;
	}
}
