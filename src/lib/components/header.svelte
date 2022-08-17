<script lang="ts">
	import clsx from 'clsx';

	import Hamburger from '$lib/assets/drawer/hamburger.svg?component';
	import { onDestroy } from 'svelte';

	let clazz: string | undefined = undefined;

	export { clazz as class };

	let element: HTMLElement | undefined;
	let y: number | undefined;
	let height: number | undefined;

	const findScrollable = (element: HTMLElement): HTMLElement | undefined => {
		if (element.scrollHeight > element.clientHeight) {
			return element;
		}

		if (element.parentElement) {
			return findScrollable(element.parentElement);
		}

		return undefined;
	};

	const listener = () => {
		y = scrollable?.scrollTop;
	};

	$: scrollable = element?.parentElement && findScrollable(element.parentElement);
	$: if (scrollable) {
		y = scrollable?.scrollTop;
		scrollable.addEventListener('scroll', listener);
		onDestroy(() => {
			scrollable?.removeEventListener('scroll', listener);
		});
	}
	$: showBackground = y && height && y > height;
</script>

<div
	class={clsx(
		'w-full px-5 py-3 h-12 transition-all md:h-16 bg-white bg-opacity-0 sticky top-0 z-50 text-lg font-semibold',
		clazz,
		showBackground && 'bg-opacity-80',
		'[&>*:nth-child(1)]:float-left',
		'[&>*:nth-child(2)]:absolute-center',
		'[&>*:nth-child(n+3)]:float-right'
	)}
	bind:clientHeight={height}
	bind:this={element}
>
	<label for="drawer-toggle" class="md:hidden">
		<svelte:component this={Hamburger} class="stroke-black" />
	</label>
	<slot />
</div>
