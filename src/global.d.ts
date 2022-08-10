declare module '*.svg?component' {
	const content: SvelteComponent;
	export default content;
}

declare module '*.svg?url' {
	const content: string;
	export default content;
}
