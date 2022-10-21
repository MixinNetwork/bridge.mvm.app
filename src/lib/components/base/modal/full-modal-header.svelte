<script lang="ts">
	import clsx from 'clsx';
	import Back from '$lib/assets/back.svg?component';
	import Close from '$lib/assets/close.svg?component';

	let clazz: string | undefined = undefined;
	export { clazz as class };
</script>

<div class={clsx('mb-2 flex items-center justify-between py-3 px-5', clazz)}>
	<button class=" visible md:invisible" on:click>
		<Back />
	</button>

	<div class="text-lg font-bold">
		<div class="text-lg font-bold">
			<slot />
		</div>
	</div>
	<button class="invisible md:visible" on:click>
		<Close />
	</button>
</div>
