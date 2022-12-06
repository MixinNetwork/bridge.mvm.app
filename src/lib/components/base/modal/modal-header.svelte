<script lang="ts">
	import clsx from 'clsx';
	import Close from '$lib/assets/close.svg?component';

	let close = () => {
		//
	};
	let clazz: string | undefined = undefined;
	export { clazz as class, close };
</script>

<div class={clsx('mb-5 flex items-center space-x-2 font-bold text-black text-opacity-80', clazz)}>
	<slot />

	<div class="flex grow justify-end ">
		<button on:click={close}>
			<Close />
		</button>
	</div>
</div>
