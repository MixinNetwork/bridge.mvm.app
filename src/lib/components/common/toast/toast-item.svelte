<script context="module" lang="ts">
	export type BaseProps = {
		'toast-class'?: string;
	};
</script>

<script lang="ts">
	import clsx from 'clsx';
	import { fade } from 'svelte/transition';
	import { SvelteComponentTyped } from 'svelte';
	import { omit } from 'lodash-es';

	type Component = $$Generic<typeof SvelteComponentTyped<Record<string, any>>>;
	type Props = Component extends typeof SvelteComponentTyped<infer T extends Record<string, any>>
		? T
		: never;

	type $$Props = {
		'toast-content': Component;
	} & BaseProps &
		Props;

	$: p = $$props as $$Props;

	$: component = p['toast-content'];
	$: clazz = p['toast-class'];
	$: props = omit(p, ['toast-class', 'toast-content']);
</script>

<div
	transition:fade
	class={clsx(
		'fixed top-2 left-1/2 -translate-x-1/2 flex w-44 rounded-full bg-white py-2 px-2 align-middle',
		clazz
	)}
>
	<svelte:component this={component} {...props} />
</div>
