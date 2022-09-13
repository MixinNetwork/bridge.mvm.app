<script lang="ts">
	import clsx from 'clsx';
	import { format } from '../../helpers/big';
	import { totalBalanceBtc, totalBalanceUsd } from '../../stores/model';
</script>

<div class={clsx('flex flex-col items-center justify-center md:items-start transition')}>
	<div>
		<span class="align-top font-semibold opacity-30">$</span>
		<span class="text-3xl font-bold md:text-[40px]"
			>{format({ n: $totalBalanceUsd ?? 0, dp: 2, fixed: true })}
		</span>
	</div>
	<div>
		<span class="text-sm font-semibold opacity-30 md:pl-[1ch] md:text-base">
			{format({ n: $totalBalanceBtc ?? 0, dp: 8 })} BTC
		</span>
	</div>
</div>
