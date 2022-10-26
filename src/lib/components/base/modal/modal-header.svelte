<script lang="ts">
	import clsx from 'clsx';
	import Close from '$lib/assets/close.svg?component';

	let close = () => {
		//
	};
	let clazz: string | undefined = undefined;
	export { clazz as class, close };
</script>

<div class={clsx('flex items-center space-x-2 text-black text-opacity-80 font-bold', clazz)}>
	<slot />

	<div class="flex grow justify-end ">
		<button on:click={close}>
			<Close />
		</button>
	</div>
</div>
