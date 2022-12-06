<script lang="ts">
	import clsx from 'clsx';
	import { providerLogo } from '../../stores/provider';
	import { isLogged, shortAddress } from '../../stores/user';
	import Arrow from '$lib/assets/arrow.svg?component';
	import { totalBalanceUsd } from '../../stores/model';
	import { format } from '../../helpers/big';
	import LL from '$i18n/i18n-svelte';
	import LogoutButton from './logout-button.svelte';
	import { connectWallet } from '../../stores/ether';

	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class={clsx(
		'default group relative z-50 flex w-fit select-none items-center space-x-3 transition hover:pointer-events-none md:h-10 md:rounded-full md:bg-white md:py-2 md:px-4 md:hover:pointer-events-auto',
		clazz,
		{
			'cursor-default': $isLogged,
			'cursor-pointer': !$isLogged
		}
	)}
	on:click={() => {
		if ($isLogged) return;
		connectWallet();
	}}
>
	{#if $isLogged}
		<div class="flex h-16 w-16 items-center justify-center md:h-5 md:w-5">
			{#if $providerLogo}
				{@html $providerLogo}
			{/if}
		</div>
	{/if}

	<div class="font-bold md:text-sm md:font-semibold">
		{#if $isLogged}
			<div class="text-xl md:hidden">
				{format({ n: $totalBalanceUsd || 0, dp: 2, fixed: true })}
			</div>
			<div class="inline-flex">
				<span class="sm:hidden md:block">Account&nbsp;</span>
				<span class="text-sm opacity-30 md:opacity-100">{$shortAddress}</span>
			</div>
		{:else}
			<div class="sm:hidden md:block">
				{$LL.connectWallet()}
			</div>
		{/if}
	</div>

	{#if $isLogged}
		<Arrow class="rotate-90 sm:hidden md:block" />
	{/if}

	<div
		class={clsx(
			'default invisible absolute top-10 right-0 z-50 mt-3 w-96 flex-col rounded-2xl bg-white pb-5 opacity-0 shadow transition-all delay-100 group-hover:visible group-hover:opacity-100 md:flex',
			{
				'!invisible': !$isLogged
			}
		)}
	>
		<div class=" flex items-center space-x-3 p-6">
			<div class="flex h-14 w-14 items-center justify-center">
				{#if $providerLogo}
					{@html $providerLogo}
				{/if}
			</div>
			<div class=" font-semibold">
				<div>
					{$shortAddress}
				</div>
			</div>
		</div>
		<LogoutButton />
	</div>
</div>
