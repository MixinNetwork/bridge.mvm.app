<script>
	import Back from '$lib/assets/back.svg?component';
	import Close from '$lib/assets/close.svg?component';
</script>

<div
	class="z-10 flex h-screen w-screen flex-col items-stretch bg-brand-background pb-6 md:h-auto md:min-h-[558px] md:w-[375px] md:rounded-lg"
>
	<div class=" mb-2 flex items-center justify-between py-3 px-5">
		<button class=" visible md:invisible" on:click>
			<Back />
		</button>

		<div class="text-lg font-bold">
			<div class="text-lg font-bold">
				<slot name="title" />
			</div>
		</div>
		<button class="invisible md:visible" on:click>
			<Close />
		</button>
	</div>
	<slot />
</div>
