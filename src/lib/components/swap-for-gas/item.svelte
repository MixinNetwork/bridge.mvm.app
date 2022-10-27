<script lang="ts">
	import { bigMul, format } from '../../helpers/big';
	import Checked from '$lib/assets/swap-for-gas-checked.svg?component';
	import LL from '$i18n/i18n-svelte';

	export let amount: string;
	export let price: string;
	export let selected: boolean | undefined = undefined;
	export let transactions: number;
</script>

<div class="relative font-semibold ">
	<input
		class="peer hidden"
		id={amount}
		name="amount"
		value={amount}
		type="radio"
		checked={selected}
	/>
	<label
		for={amount}
		class="box-border flex h-40 w-32 flex-col rounded-xl border-2 border-transparent bg-white px-3 pt-5 shadow-md transition-all peer-checked:border-brand-primary peer-checked:bg-brand-primary peer-checked:bg-opacity-5"
	>
		<div class=" text-lg opacity-80">{amount} ETH</div>
		<div class=" mt-2 text-xs opacity-20">
			${format({
				n: bigMul(amount, price),
				dp: 2,
				fixed: true
			})}
		</div>
		<div class="mt-4 text-sm opacity-50">{$LL.swapForGasPage.itemTip(transactions)}</div>
	</label>
	<Checked class="absolute bottom-0 right-0 opacity-0 transition-all peer-checked:opacity-100" />
</div>
