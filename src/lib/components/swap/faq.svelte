<script lang="ts">
	import clsx from 'clsx';
	import LL from '$i18n/i18n-svelte';
	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div class={clsx('mt-4 rounded-lg bg-white px-5 pt-3 pb-10 lg:w-60', clazz)}>
	<p class=" mb-6 text-xl font-bold">{$LL.swapPage.faq.description1()}</p>
	<div class=" space-y-6 text-sm font-medium text-black text-opacity-50">
		<p>
			{$LL.swapPage.faq.description2()}
		</p>
		<div>
			<p class="text-base font-semibold text-black">{$LL.swapPage.faq.description3()}</p>
			<p>
				{$LL.swapPage.faq.description4()}<a href="https://4swap.org/" class="text-brand-primary"
					>https://4swap.org/</a
				>{$LL.swapPage.faq.description5()}
			</p>
		</div>

		<div>
			<p class="text-base font-semibold text-black">{$LL.swapPage.faq.description6()}</p>
			<p>
				{$LL.swapPage.faq.description7()}<a href="https://mixpay.me/" class="text-brand-primary"
					>https://mixpay.me/</a
				>{$LL.swapPage.faq.description8()}
			</p>
		</div>
	</div>
</div>
