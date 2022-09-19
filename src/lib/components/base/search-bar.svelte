<script lang="ts">
	import clsx from 'clsx';
	import { focus } from 'focus-svelte';
	import Search from '$lib/assets/search.svg?component';
	import { fade } from 'svelte/transition';

	let clazz: string | undefined = undefined;
	let keyword: string;
	let cancelable = false;
	export { clazz as class, keyword, cancelable };
</script>

<div
	transition:fade
	class={clsx(
		'flex items-center justify-center space-x-4 px-5 pt-4 pb-2 text-base font-semibold',
		clazz
	)}
>
	<label
		for="search"
		class="flex grow items-center space-x-3 rounded-xl bg-black bg-opacity-5 px-3 py-2"
	>
		<Search />
		<input
			use:focus={{ enabled: true }}
			id="search"
			type="text"
			class="w-full bg-transparent placeholder-black placeholder-opacity-20"
			placeholder="Name, Symbol or Address"
			bind:value={keyword}
		/>
	</label>

	{#if cancelable}
		<button on:click>Cancel</button>
	{/if}
</div>
