<script lang="ts">
	import clsx from 'clsx';
	import { formatCurrency, toRounding } from '../helpers/big';

	import { totalBalanceBtc, totalBalanceUsd } from '../stores/model';

	$: ready = $totalBalanceUsd && $totalBalanceBtc;
</script>

<div
	class={clsx(
		'flex h-24 flex-col items-center justify-center md:items-start transition opacity-0 mt-5',
		{
			'opacity-100': ready
		}
	)}
>
	<div>
		<span class=" align-top font-semibold opacity-30">$</span>
		<span class=" text-3xl font-bold md:text-[40px]">{formatCurrency($totalBalanceUsd ?? 0)} </span>
	</div>
	<div class="text-sm font-semibold opacity-30 md:text-base">
		{toRounding($totalBalanceBtc ?? 0, 8)} BTC
	</div>
</div>
