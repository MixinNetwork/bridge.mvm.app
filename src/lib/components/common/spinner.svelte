<script lang="ts">
	import clsx from 'clsx';

	let size: number | undefined = undefined;
	let clazz: string | undefined = undefined;

	export { size, clazz as class };
</script>

<svg
	width={size ?? 24}
	height={size ?? 24}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={clsx('animate-spin', clazz)}
>
	<path
		d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
