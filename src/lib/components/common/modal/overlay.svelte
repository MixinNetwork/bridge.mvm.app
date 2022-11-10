<script context="module" lang="ts">
	export type BaseProps = {
		'overlay-class'?: string;
		'overlay-on-click'?: () => void;
		'overlay-on-escape'?: () => void;
	};
</script>

<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import type { SvelteComponentTyped } from 'svelte';
	import clsx from 'clsx';
	import { focus } from 'focus-svelte';
	import { tailwind } from '../../../transition/tailwind';
	import { browser } from '$app/environment';
	import { omit } from 'lodash-es';

	type Component = $$Generic<typeof SvelteComponentTyped<Record<string, any>>>;
	type Props = Component extends typeof SvelteComponentTyped<infer T extends Record<string, any>>
		? T
		: never;

	type $$Props = {
		'overlay-content': Component;
	} & BaseProps &
		Props;

	$: p = $$props as $$Props;

	$: clazz = p['overlay-class'];
	$: onClick = p['overlay-on-click'];
	$: onEscape = p['overlay-on-escape'];
	$: component = p['overlay-content'];

	$: props = omit(p, ['overlay-class', 'overlay-on-click', 'overlay-on-escape', 'overlay-content']);

	let element: Element;
	const keyDown = (evt: KeyboardEvent) => {
		if (!browser) return;
		if (evt.code !== 'Escape') return;
		if (element === document.activeElement || element.contains(document.activeElement))
			onEscape?.();
	};
</script>

<svelte:window on:keydown={keyDown} />

<div
	class={clsx('fixed inset-0 z-20 flex items-center justify-center overflow-auto', clazz)}
	bind:this={element}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		transition:tailwind|local={{
			from: 'opacity-0',
			to: '!opacity-100'
		}}
		class="default absolute inset-0 cursor-default bg-brand-overlayBg"
		on:click|self={onClick}
	/>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		use:focus={{ focusable: true, enabled: true }}
		class="flex h-full w-full cursor-default items-center justify-center overflow-hidden text-start opacity-100 child:z-30"
		on:click|self={onClick}
	>
		<svelte:component this={component} {...props} />
	</div>
</div>
