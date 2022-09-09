<script context="module" lang="ts">
	import clsx from 'clsx';
	import { focus } from 'focus-svelte';
	import { fade } from 'svelte/transition';
	import { tailwind } from '../../../transition/tailwind';
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
	fade;
</script>

<div class={clsx('fixed inset-0 z-20 flex items-center justify-center overflow-auto', clazz)}>
	<div
		transition:tailwind={{
			to: '!opacity-100'
		}}
		class="absolute inset-0 bg-brand-overlayBg opacity-0"
		on:click={overLayClicked}
		bind:this={self}
	/>

	<div
		use:focus={true}
		class="flex h-full w-full items-center justify-center overflow-hidden child:z-30"
		bind:this={wrapper}
	>
		<slot />
	</div>
</div>
