<script context="module" lang="ts">
	import clsx from 'clsx';
	import { focus } from 'focus-svelte';
</script>

<script lang="ts">
	let clazz: string | undefined = undefined;
	let onClose = () => {
		//
	};
	let maskClosable = false;

	export { onClose, maskClosable, clazz as class };

	let self: HTMLElement | undefined;
	let wrapper: HTMLElement | undefined;

	function overLayClicked(event: Event) {
		if (
			maskClosable &&
			(event.target === self || event.target === wrapper || event.target === self?.parentElement)
		) {
			onClose();
		}
	}
</script>

<div
	class={clsx(
		'fixed inset-0 z-20 flex items-center justify-center overflow-auto bg-black bg-opacity-10',
		clazz
	)}
	on:click={overLayClicked}
	bind:this={self}
>
	<div
		use:focus={true}
		class="flex h-full w-full items-center justify-center overflow-hidden"
		bind:this={wrapper}
	>
		<slot />
	</div>
</div>
