<script lang="ts">
	import clsx from 'clsx';
	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div class={clsx('mt-4 rounded-lg bg-white pt-3 pb-10 px-5 lg:w-60', clazz)}>
	<p class=" mb-6 text-xl font-bold">How does it work?</p>
	<div class=" space-y-6 text-sm font-medium text-black text-opacity-50">
		<p>
			MVM Bridge provides a cross-chain Convert service through 4swap and MixPay, which delivers
			lower fees, faster transaction speed, and better trading liquidity.
		</p>
		<div>
			<p class="text-base font-semibold text-black">4swap</p>
			<p>
				A decentralized protocol for automated liquidity provision offers over 140 pairs with a TVL
				of over $100M. Please visit https://4swap.org for additional information.
			</p>
		</div>

		<div>
			<p class="text-base font-semibold text-black">MixinPay</p>
			<p>
				A decentralized Web3 payment protocol connects the most liquid exchanges, such as Binance,
				Huobi, and Gate, to convert almost any cryptocurrency. For more info, please visit
				https://mixpay.me.
			</p>
		</div>
	</div>
</div>
