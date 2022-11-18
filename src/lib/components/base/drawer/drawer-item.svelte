<script lang="ts">
	import type { ComponentType } from 'svelte';

	import { page } from '$app/stores';
	import clsx from 'clsx';

	import Arrow from '$lib/assets/arrow.svg?component';
	import External from '$lib/assets/external.svg?component';

	let logo: ComponentType;
	let title: string;
	let clazz: string | undefined = undefined;
	/* eslint-disable no-undef */
	let href: svelte.JSX.HTMLAttributes<HTMLAnchorElement>['href'] = undefined;
	let target: svelte.JSX.HTMLAttributes<HTMLAnchorElement>['target'] = null;
	let rel: svelte.JSX.HTMLAttributes<HTMLAnchorElement>['rel'] = null;
	/* eslint-disable no-undef */

	export { logo, title, clazz as class, href, target, rel };
</script>

{#key $page.url.pathname === href}
	<div class={clsx('py-2 px-5', clazz)}>
		<a
			class={clsx(
				'inline-flex h-11 w-full items-center space-x-4 rounded-xl px-3 py-2 transition hover:bg-brand-primary cursor-pointer hover:bg-opacity-5',
				{
					'bg-brand-primary bg-opacity-10': $page.url.pathname === href
				}
			)}
			{target}
			{href}
			{rel}
			on:click
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
