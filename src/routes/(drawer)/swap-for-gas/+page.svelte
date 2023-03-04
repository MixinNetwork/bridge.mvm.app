<script lang="ts">
	import Header from '$lib/components/base/header.svelte';
	import LL from '$i18n/i18n-svelte';
	import UserInfo from '$lib/components/base/user-info.svelte';
	import Apps from '$lib/components/base/apps.svelte';
	import { isLogged, user } from '$lib/stores/user';
	import Item from '$lib/components/swap-for-gas/item.svelte';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import DepositPending from '$lib/components/base/deposit-pending.svelte';
	import { connectWallet } from '$lib/stores/ether';
	import { assets } from '$lib/stores/model';
	import { ETH_ASSET_ID } from '$lib/constants/common';
	import { filterNumericInputEvent } from '$lib/helpers/utils';

	$: eth = $assets.find((asset) => asset.asset_id === ETH_ASSET_ID);

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	$: price = eth!.price_usd;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	$: iconUrl = eth!.icon_url;

	let selectCustom = false;
	let customAmount: number;

	const unselectCustom = () => (selectCustom = false);
</script>

<Header class=" bg-transparent">
	<div class="md:hidden">{$LL.swapForGas()}</div>
	<UserInfo class="hidden md:flex" />
	<Apps />
	<DepositPending />
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
			method="POST"
			target="_blank"
			use:enhance={({ data, cancel, action }) => {
				const asyncFn = async () => {
					if (!$isLogged) await connectWallet();
					$user && action.searchParams.append('address', $user.address);
					action.searchParams.append('callbackUrl', window.location.href);

					const quantity = data.get('quantity');
					if (quantity && typeof quantity === 'string') {
						if (quantity === 'custom') {
							action.searchParams.append('quantity', customAmount + '');
						} else {
							action.searchParams.append('quantity', quantity);
						}
					}

					window.open(action, '_blank');
				};

				asyncFn();

				cancel();
			}}
			class="mt-5 flex w-full flex-col items-center"
		>
			{#if $user}
				<input name="address" class="hidden" value={$user.address} type="checkbox" checked={true} />
			{/if}
			<input
				name="callbackUrl"
				class="hidden"
				value={(browser && window.location.href) || ''}
				type="checkbox"
				checked={true}
			/>
			<div
				class="scrollbar-hide flex w-full snap-x scroll-px-6 flex-row space-x-3 overflow-x-auto pb-10 pt-1 pr-6 first:child:pl-6"
			>
				<Item value="0.01" {price} selected={true} transactions={500} on:click={unselectCustom} />
				<Item value="0.05" {price} selected={false} transactions={2500} on:click={unselectCustom} />
				<Item value="0.1" {price} selected={false} transactions={5000} on:click={unselectCustom} />
				<Item value="custom" {price} selected={selectCustom} transactions={64}>
					<input
						type="number"
						on:input={(e) => filterNumericInputEvent(e, customAmount + '')}
						class="h-16 w-full rounded-lg bg-[#F5F7FA] p-1 text-lg font-semibold"
						placeholder={$LL.amount()}
						step="0.001"
						bind:value={customAmount}
						on:focus={() => (selectCustom = true)}
					/>
					<div class="mt-4 text-sm opacity-50">{$LL.swapForGasPage.customAmount()}</div>
				</Item>
			</div>

			<button class="rounded-full bg-brand-primary px-6 py-3 text-white">{$LL.swap()}</button>

			<div class=" mt-3 text-xs font-semibold opacity-20">{$LL.swapForGasPage.providedTip()}</div>
		</form>
	</div>
</div>
