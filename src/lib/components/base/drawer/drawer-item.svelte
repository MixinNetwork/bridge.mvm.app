<script lang="ts">
	import type { ComponentType } from 'svelte';

	import { page } from '$app/stores';
	import clsx from 'clsx';

	import Arrow from '$lib/assets/arrow.svg?component';
	import External from '$lib/assets/external.svg?component';

	export let logo: ComponentType;
	export let title: string;
	/* eslint-disable no-undef */
	export let href: svelte.JSX.HTMLAttributes<HTMLAnchorElement>['href'];
	export let target: svelte.JSX.HTMLAttributes<HTMLAnchorElement>['target'] = null;
	export let rel: svelte.JSX.HTMLAttributes<HTMLAnchorElement>['rel'] = null;
	/* eslint-disable no-undef */
</script>

{#key $page.url.pathname === href}
	<div class="py-2 px-5">
		<a
			class={clsx(
				'inline-flex h-11 w-full items-center space-x-4 rounded-xl px-3 py-2 transition hover:bg-brand-primary hover:bg-opacity-5',
				{
					'bg-brand-primary bg-opacity-10': $page.url.pathname === href
				}
			)}
			{target}
			{href}
			{rel}
		>
			<svelte:component
				this={logo}
				width="24"
				height="24"
				class={clsx({
					'fill-brand-primary': $page.url.pathname === href,
					'fill-black': !($page.url.pathname === href)
				})}
			/>
			<span class="ml-2 flex grow flex-row items-center space-x-1 font-semibold">
				<div>
					{title}
				</div>
				{#if target === '_blank'}
					<External class=" stroke-black" />
				{/if}
			</span>
			<Arrow class="md:hidden" />
		</a>
	</div>
{/key}
