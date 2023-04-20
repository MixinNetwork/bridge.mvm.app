<script lang="ts">
	import clsx from 'clsx';

	import Hamburger from '$lib/assets/drawer/hamburger.svg?component';
	import scrollableParent from '../../helpers/actions/scrollable-parent';

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
		'sticky top-0 z-50 h-12 w-full bg-white bg-opacity-100 px-5 py-3 text-lg font-semibold transition-all md:h-16 md:bg-opacity-0',
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
	<label for="drawer-toggle" class="expand-4 cursor-pointer md:hidden">
		<svelte:component this={Hamburger} class="stroke-black" />
	</label>
	<slot />
</div>
