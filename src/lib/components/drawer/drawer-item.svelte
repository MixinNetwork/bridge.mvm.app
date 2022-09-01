<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { page } from '$app/stores';
	import clsx from 'clsx';

	import Arrow from '$lib/assets/arrow.svg?component';

	export let logo: SvelteComponent;
	export let title: string;
	export let href: string;
	export let target: string | undefined = undefined;

	$: selected = $page.url.pathname === href;
</script>

<div class="py-2 px-5">
	<a
		sveltekit:prefetch
		class={clsx(
			'inline-flex h-11 w-full items-center space-x-4 rounded-xl px-3 py-2 transition hover:bg-brand-primary hover:bg-opacity-5',
			{
				'bg-brand-primary bg-opacity-10': selected
			}
		)}
		{target}
		{href}
	>
		<svelte:component
			this={logo}
			width="24"
			height="24"
			class={clsx({
				'fill-brand-primary': selected,
				'fill-black': !selected
			})}
		/>
		<span class="ml-2 grow font-semibold">{title}</span>
		<svelte:component this={Arrow} class="md:hidden" />
	</a>
</div>
