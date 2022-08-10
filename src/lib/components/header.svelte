<script lang="ts">
	import clsx from 'clsx';

	import Hamburger from '$lib/assets/drawer/hamburger.svg?component';

	let clazz: string | undefined = undefined;

	export { clazz as class };
</script>

<div
	class={clsx(
		'w-full px-5 py-3 h-12 relative transition-all md:h-16',
		clazz,
		'[&>*:nth-child(1)]:float-left',
		'[&>*:nth-child(2)]:absolute-center',
		'[&>*:nth-child(n+3)]:float-right'
	)}
>
	<label for="drawer-toggle" class="md:hidden">
		<svelte:component this={Hamburger} class="stroke-black" />
	</label>
	<slot />
</div>
