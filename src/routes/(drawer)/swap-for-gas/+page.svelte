<script lang="ts">
	import Header from '$lib/components/base/header.svelte';
	import { page } from '$app/stores';
	import LL from '$i18n/i18n-svelte';
	import Helper from '$lib/assets/helper.svg?component';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import Apps from '$lib/components/base/apps.svelte';
	import { user } from '$lib/stores/user';
	import Item from '$lib/components/swap-for-gas/item.svelte';

	let price: string = $page.data.price;
	let iconUrl: string = $page.data.iconUrl;
</script>

<Header class=" bg-transparent">
	<div class="md:hidden">{$LL.swapForGas()}</div>
	<a href="/" class="md:hidden">
		<Helper />
	</a>
	<UserInfo class="hidden md:flex" />
	<Apps />
</Header>

<div class="mt-5 flex items-center justify-center">
	<div class="flex w-[335px] flex-col items-center justify-center rounded-2xl bg-white pt-14 pb-5">
		<img loading="lazy" src={iconUrl} class=" h-20 w-20" alt="eth" />
		<div class=" mt-8 text-sm font-semibold opacity-20">
			ETH is used to pay for transaction fees
		</div>

		<form
			action="https://cryptogasstation.xyz/mvm"
			method="get"
			target="_blank"
			class="mt-5 flex w-full flex-col items-center"
		>
			<input name="address" class="hidden" value={$user.address} type="checkbox" checked={true} />
			<div class="flex w-full flex-row space-x-3 overflow-x-scroll px-6 pb-10">
				<Item amount="0.02" {price} selected={true} />
				<Item amount="0.05" {price} selected={false} />
				<Item amount="0.1" {price} selected={false} />
			</div>

			<button class="rounded-full bg-brand-primary px-6 py-3 text-white">{$LL.swap()}</button>

			<div class=" mt-3 text-xs font-semibold opacity-20">本服务由 Crypto Gas Station 提供</div>
		</form>
	</div>
</div>
