<script lang="ts">
	import clsx from 'clsx';

	import { provider } from '../stores/provider';
	import { shortAddress } from '../stores/user';

	import MetaMask from '$lib/assets/logo/metamask.svg?component';
	import WalletConnect from '$lib/assets/logo/wallet-connect.svg?component';
	import Arrow from '$lib/assets/arrow.svg?component';
	import { totalBalanceUsd } from '../stores/model';
	import { formatCurrency } from '../helpers/big';

	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div
	class={clsx(
		'flex items-center space-x-3 md:py-2 md:px-4 md:rounded-full md:bg-white w-fit transition',
		clazz
	)}
>
	<div class="child:h-14 child:w-14 child:md:h-4 child:md:w-4">
		{#if $provider === 'injected'}
			<MetaMask />
		{:else if $provider === 'walletconnect'}
			<WalletConnect />
		{/if}
	</div>
	<div class="font-bold md:text-sm md:font-semibold">
		<div class="text-xl md:hidden">{formatCurrency($totalBalanceUsd || 0)}</div>
		<div class="inline-flex">
			<span class="sm:hidden md:block">Account&nbsp;</span>
			<span class="text-sm opacity-30 md:opacity-100">{$shortAddress}</span>
		</div>
	</div>
	<Arrow class="rotate-90 sm:hidden md:block" />
</div>
