<script lang="ts">
	import clsx from 'clsx';
	import { fade } from 'svelte/transition';
	import { onDestroy, SvelteComponentTyped } from 'svelte';
	import { omit } from "lodash-es";

	type Component = $$Generic<typeof SvelteComponentTyped<Record<string, any>>>;

	type $$Props = {
		'toast-content': Component;
		'toast-class'?: string;
		'toast-timer': NodeJS.Timeout;
	};

	$: p = $$props as $$Props;

	$: component = p['toast-content'];
	$: clazz = p['toast-class'];
	$: timer = p['toast-timer'];
	$: props = omit(p, ['toast-class', 'toast-content', 'toast-timer']);

	onDestroy(() => {
		if (timer) clearTimeout(timer);
	});
</script>

<div
	transition:fade
	class={clsx(
		'flex w-44 rounded-full bg-white py-2 px-2 align-middle',
		clazz
	)}
>
	<svelte:component this={component} {...props} />
</div>
