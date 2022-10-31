<script lang="ts">
	import Header from '$lib/components/base/header.svelte';
	import { page } from '$app/stores';
	import LL from '$i18n/i18n-svelte';
	import Helper from '$lib/assets/helper.svg?component';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import Apps from '$lib/components/base/apps.svelte';
	import { user } from '$lib/stores/user';
	import Item from '$lib/components/swap-for-gas/item.svelte';
	import { enhance } from '$app/forms';

	let price: string = $page.data.price;
	let iconUrl: string = $page.data.iconUrl;

	let selectCustom = false;
	let customAmount: number;
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
	<div
		class="flex w-[335px] flex-col items-center justify-center rounded-2xl bg-white pt-14 pb-5 md:pt-8"
	>
		<div class=" mb-4 text-lg font-bold opacity-80 ">{$LL.swapForGas()}</div>
		<img loading="lazy" src={iconUrl} class="h-20 w-20" alt="eth" />
		<div class=" mt-8 text-sm font-semibold opacity-20">
			{$LL.swapForGasPage.tip()}
		</div>

		<form
			action="https://cryptogasstation.xyz/mvm"
			method="get"
			target="_blank"
			use:enhance={({ data, cancel, action }) => {
				action.searchParams.append('address', $user.address);
				const quantity = data.get('quantity');
				if (quantity && typeof quantity === 'string') {
					if (quantity === 'custom') {
						action.searchParams.append('quantity', customAmount + '');
					} else {
						action.searchParams.append('quantity', quantity);
					}
				}

				window.open(action, '_blank');
				cancel();
			}}
			class="mt-5 flex w-full flex-col items-center"
		>
			<input name="address" class="hidden" value={$user.address} type="checkbox" checked={true} />
			<div
				class="scrollbar-hide flex w-full snap-x scroll-px-6 flex-row space-x-3 overflow-x-auto pb-10 pt-1 pr-6 first:child:pl-6"
			>
				<Item value="0.01" {price} selected={true} transactions={500} />
				<Item value="0.05" {price} selected={false} transactions={2500} />
				<Item value="0.1" {price} selected={false} transactions={5000} />
				<Item value="custom" {price} selected={selectCustom} transactions={64}>
					<input
						type="number"
						class="h-16 w-full rounded-lg bg-[#F5F7FA] p-1 text-lg font-semibold"
						placeholder={$LL.amount()}
						step="0.001"
						bind:value={customAmount}
						on:focus={() => (selectCustom = true)}
						on:blur={() => (selectCustom = false)}
					/>
					<div class="mt-4 text-sm opacity-50">{$LL.swapForGasPage.customAmount()}</div>
				</Item>
			</div>

			<button class="rounded-full bg-brand-primary px-6 py-3 text-white">{$LL.swap()}</button>

			<div class=" mt-3 text-xs font-semibold opacity-20">{$LL.swapForGasPage.providedTip()}</div>
		</form>
	</div>
</div>
