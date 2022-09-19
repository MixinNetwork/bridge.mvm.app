<script lang="ts">
	import clsx from 'clsx';
	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div class={clsx('mt-4 rounded-lg bg-white pt-3 pb-10 px-5 lg:w-60', clazz)}>
	<p class=" mb-6 text-xl font-bold">How does it work?</p>
	<div class=" space-y-6 text-sm font-medium text-black text-opacity-50">
		<p>
			MVM Bridge provides a cross-chain convert service through 4swap and MixPay, which delivers
			lower fees, faster transaction speed, and better trading liquidity.
		</p>
		<div>
			<p class="text-base font-semibold text-black">4swap</p>
			<p>
				A decentralized protocol for automated liquidity provision offers over 140 pairs with a TVL
				of over $100M. Please visit <a href="https://4swap.org/" class="text-brand-primary"
					>https://4swap.org/</a
				> for additional information.
			</p>
		</div>

		<div>
			<p class="text-base font-semibold text-black">MixPay</p>
			<p>
				A decentralized Web3 payment protocol connects the most liquid exchanges, such as Binance,
				Huobi, and Gate, to convert almost any cryptocurrency. For more info, please visit
				<a href="https://mixpay.me/" class="text-brand-primary">https://mixpay.me/</a>.
			</p>
		</div>
	</div>
</div>
