<script lang="ts">
	import clsx from 'clsx';
	import { fade } from 'svelte/transition';
	import { onDestroy, SvelteComponentTyped } from 'svelte';

	type Component = $$Generic<typeof SvelteComponentTyped<Record<string, any>>>;

	let component: Component;
	let timer: ReturnType<typeof setTimeout>;
	let message: string;
	let clazz: string | undefined = undefined;

	export {
		component, timer, message, clazz as class
	}

	onDestroy(() => {
		if (timer) clearTimeout(timer);
	});
</script>

<div transition:fade class={clsx('flex w-44 rounded-full bg-white py-2 px-2 align-middle', clazz)}>
	<svelte:component this={component} message={message} />
</div>
