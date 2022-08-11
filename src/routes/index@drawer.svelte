<script>
	import clsx from 'clsx';
	import Brand from '$lib/components/brand.svelte';
	import Header from '$lib/components/header.svelte';
	import Helper from '$lib/assets/helper.svg?component';
	import UserInfo from '$lib/components/user-info.svelte';
	import Balance from '$lib/components/balance.svelte';
	import Send from '$lib/assets/send.svg?component';
	import Receive from '$lib/assets/receive.svg?component';
	import { whiteAssetBalances } from '$lib/stores/model';
	import { bigMul, formatCurrency, toRounding } from '../lib/helpers/big';
</script>

<Header>
	<Brand class="space-x-2 md:hidden" logoClass="w-6" MVMClass="text-lg" bridgeClass="hidden" />
	<a href="/" class="md:hidden">
		<svelte:component this={Helper} />
	</a>
	<UserInfo class="sm:hidden md:flex" />
</Header>

<div
	class="flex h-44 flex-col items-center justify-center md:mx-5 md:items-start lg:mt-10 lg:h-auto lg:flex-row lg:items-center lg:justify-between"
>
	<Balance />
	<div class="w-full px-11 md:w-80 md:p-0">
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

<div class="mt-8 rounded-t-2xl bg-white md:mx-5">
	<div class="px-5 py-4 text-lg font-semibold">Assets</div>

	{#each $whiteAssetBalances ?? [] as { asset_id, icon_url, name, symbol, balance, price_usd } (asset_id)}
		<div class="flex items-center space-x-3 p-5">
			<img src={icon_url} width="40" height="40" alt={name} />
			<div>
				<div class=" font-bold">{name}</div>
				<div class=" text-sm font-semibold opacity-30">{symbol}</div>
			</div>
			<div class="flex grow flex-col items-end">
				<div class="font-bold">{toRounding(balance, 8)}</div>
				<div class=" text-sm font-semibold opacity-30">
					${formatCurrency(bigMul(balance, price_usd))}
				</div>
			</div>
		</div>
	{/each}
</div>
