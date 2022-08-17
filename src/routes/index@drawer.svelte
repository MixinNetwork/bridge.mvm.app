<script context="module" lang="ts">
	import clsx from 'clsx';
	import Brand from '$lib/components/brand.svelte';
	import Header from '$lib/components/header.svelte';
	import Helper from '$lib/assets/helper.svg?component';
	import UserInfo from '$lib/components/user-info.svelte';
	import Balance from '$lib/components/balance.svelte';
	import Send from '$lib/assets/send.svg?component';
	import Receive from '$lib/assets/receive.svg?component';
	import { assets } from '$lib/stores/model';
	import type { Load } from '@sveltejs/kit';
	import { user } from '$lib/stores/user';
	import type { User } from '$lib/types/user';
	import { provider } from '$lib/stores/provider';
	import type { Asset } from '$lib/types/asset';
	import type { ProviderKey } from '$lib/helpers/web3client/type';
	import AssetItem from '$lib/components/asset-item.svelte';

	export const load: Load = async ({ fetch, session: { user, provider } }) => {
		const response = await fetch('/api/assets');
		const assets = await response.json();

		return {
			status: response.status,
			props: {
				a: assets,
				u: user,
				p: provider
			}
		};
	};
</script>

<script lang="ts">
	export let a: Asset[];
	export let u: User;
	export let p: ProviderKey;

	$: a && assets.set(a);
	$: u && user.set(u);
	$: p && provider.set(p);
</script>

<Header>
	<Brand class="space-x-2 md:hidden" logoClass="w-6" MVMClass="text-lg" bridgeClass="hidden" />
	<a href="/" class="md:hidden">
		<Helper />
	</a>
	<UserInfo class="hidden md:flex" />
</Header>

<div
	class="flex flex-col items-center justify-center pt-4 md:items-start md:px-5 md:pt-10 lg:mt-10 lg:h-auto lg:flex-row lg:items-center lg:justify-between"
>
	<Balance />
	<div class="mt-6 w-full px-11 md:w-80 md:p-0">
		<div
			class={clsx(
				'grid h-12 w-full grid-cols-2 shadow-sm font-semibold child:space-x-2',
				'[&>svg]:child:inline-block',
				'child:bg-white first:child:rounded-l-xl last:child:rounded-r-xl',
				'[&>*:nth-child(n+2)]:relative',
				'[&>*:nth-child(n+2)]:before:absolute',
				'[&>*:nth-child(n+2)]:before:left-0',
				'[&>*:nth-child(n+2)]:before:h-6',
				'[&>*:nth-child(n+2)]:before:w-[2px]',
				'[&>*:nth-child(n+2)]:before:-translate-x-[1px]',
				'[&>*:nth-child(n+2)]:before:rounded-full',
				'[&>*:nth-child(n+2)]:before:bg-black',
				'[&>*:nth-child(n+2)]:before:opacity-20',
				' [&>*:nth-child(n+2)]:before:content-[""]'
			)}
		>
			<button>
				<svelte:component this={Send} />
				<span>Send</span>
			</button>
			<button>
				<svelte:component this={Receive} />
				<span>Receive</span>
			</button>
		</div>
	</div>
</div>

<div class="my-8 rounded-2xl bg-white last:child:rounded-b-2xl md:mx-5">
	<div class="px-5 py-4 text-lg font-semibold">Assets</div>

	{#each $assets ?? [] as asset (asset.asset_id)}
		<AssetItem {asset} />
	{/each}
</div>
