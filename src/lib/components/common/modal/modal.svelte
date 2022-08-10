<script lang="ts">
	import clsx from 'clsx';
	import { fade } from 'svelte/transition';
	import { focus } from 'focus-svelte';

	let isOpen: boolean;
	let clazz: string | undefined = undefined;
	let containerClass: string | undefined = undefined;

	export { isOpen, clazz as class, containerClass as containerClass };
</script>

{#if isOpen}
	<div
		class={clsx(
			'fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-auto bg-black bg-opacity-10 ',
			clazz
		)}
		transition:fade
	>
		<div class={clsx(containerClass)} use:focus={isOpen}>
			<slot />
		</div>
	</div>
{/if}
