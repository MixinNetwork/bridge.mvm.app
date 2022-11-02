<script lang="ts">
	import clsx from 'clsx';

	import Hamburger from '$lib/assets/drawer/hamburger.svg?component';
	import { scrollableParent } from '../../helpers/action';

	let clazz: string | undefined = undefined;

	export { clazz as class };

	let y: number | undefined;
	let height: number | undefined;
	const updateY = (event: CustomEvent<Element>) => {
		y = event.detail.scrollTop;
	};

	$: showBackground = y && height && y > height;
</script>

<div
	class={clsx(
		'w-full px-5 py-3 h-12 transition-all md:h-16 bg-white sticky top-0 z-50 text-lg font-semibold bg-opacity-100 md:bg-opacity-0',
		clazz,
		showBackground && '!bg-opacity-100',
		'[&>*:nth-child(1)]:float-left',
		'[&>*:nth-child(2)]:absolute-center',
		'[&>*:nth-child(n+3)]:float-right',
		'md:[&>*:nth-child(n+4)]:mr-3',
		'[&>*:nth-child(n+5)]:mr-3'
	)}
	bind:clientHeight={height}
	use:scrollableParent
	on:parentScroll={updateY}
>
	<label for="drawer-toggle" class="md:hidden">
		<svelte:component this={Hamburger} class="stroke-black" />
	</label>
	<slot />
</div>
