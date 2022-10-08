<script context="module" lang="ts">
	import clsx from 'clsx';
	import { onDestroy, type ComponentType, type SvelteComponentTyped } from 'svelte';
	import { fade } from 'svelte/transition';

	export type ToastItemComponent = ComponentType<SvelteComponentTyped<{ message: string }>>;
</script>

<script lang="ts">
	let component: ToastItemComponent;
	let timer: ReturnType<typeof setTimeout>;
	let message: string;
	let clazz: string | undefined = undefined;

	export { component, timer, message, clazz as class };

	onDestroy(() => {
		if (timer) clearTimeout(timer);
	});
</script>

<div
	transition:fade
	class={clsx('flex rounded-full bg-white mt-1 py-2 px-3 align-middle space-x-3', clazz)}
>
	<svelte:component this={component} {message} />
</div>
