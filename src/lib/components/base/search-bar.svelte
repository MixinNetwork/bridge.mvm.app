<script lang="ts">
	import clsx from 'clsx';
	import { focus } from 'focus-svelte';
	import Search from '$lib/assets/search.svg?component';
	import { fade } from 'svelte/transition';
	import LL from '$i18n/i18n-svelte';

	let clazz: string | undefined = undefined;
	let keyword: string;
	let cancelable = false;
	export { clazz as class, keyword, cancelable };
</script>

<div
	transition:fade|local
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
			use:focus={{ enabled: true, focusable: true, focusDelay: 0 }}
			id="search"
			type="search"
			class="w-full text-ellipsis bg-transparent placeholder-black placeholder-opacity-20"
			placeholder={$LL.searchBar.placeholder()}
			autocomplete="off"
			bind:value={keyword}
		/>
	</label>

	{#if cancelable}
		<button on:click>{$LL.cancel()}</button>
	{/if}
</div>
