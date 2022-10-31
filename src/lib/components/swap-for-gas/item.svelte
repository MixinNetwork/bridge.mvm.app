<script lang="ts">
	import { bigMul, format } from '../../helpers/big';
	import Checked from '$lib/assets/swap-for-gas-checked.svg?component';
	import LL from '$i18n/i18n-svelte';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	export let value: string;
	export let price: string;
	export let selected: boolean | undefined = undefined;
	export let transactions: number;

	const dispatcher = createEventDispatcher()

	let element: HTMLElement | undefined;
	$: parent = element?.parentElement && element?.parentElement;
	$: paddingLeft =
		browser && parent && Number(getComputedStyle(parent).scrollPaddingLeft.slice(0, -2));
	$: offset =
		element && parent && paddingLeft && element.offsetLeft - parent.offsetLeft - paddingLeft;
</script>

<div class="relative snap-start font-semibold" bind:this={element}>
	<input class="peer hidden" id={value} name="quantity" {value} type="radio" checked={selected} />
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<label
		for={value}
		class="box-border flex h-40 w-32 flex-col rounded-xl border-2 border-transparent bg-white p-2 shadow-md transition-all peer-checked:border-brand-primary peer-checked:bg-brand-primary peer-checked:bg-opacity-5"
		on:click={() => {
			parent && offset && parent.scrollTo({ left: offset, behavior: 'smooth' });
			dispatcher('click');
		}}
	>
		<slot>
			<div class="px-1 pt-3">
				<div class="text-lg opacity-80">{value} ETH</div>
				<div class=" mt-2 text-xs opacity-20">
					${format({
						n: bigMul(value, price),
						dp: 2,
						fixed: true
					})}
				</div>
				<div class="mt-4 text-sm opacity-50">{$LL.swapForGasPage.itemTip(transactions)}</div>
			</div>
		</slot>
	</label>
	<Checked class="absolute bottom-0 right-0 opacity-0 transition-all peer-checked:opacity-100" />
</div>
