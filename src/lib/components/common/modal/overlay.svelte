<script context="module" lang="ts">
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
</script>

<script lang="ts">
	export let onClose = () => {
		//
	};
	export let maskClosable = false;

	let self: HTMLElement | undefined;

	function overLayClicked(event: Event) {
		if (maskClosable && (event.target === self || event.target === self?.parentElement)) {
			onClose();
		}
	}
</script>

<div
	transition:fade={{ duration: 250, easing: quadOut }}
	class=" fixed inset-0 z-10 flex items-center justify-center overflow-auto bg-black bg-opacity-10"
	on:click={overLayClicked}
	bind:this={self}
>
	<slot />
</div>
