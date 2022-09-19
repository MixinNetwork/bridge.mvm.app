<script lang="ts">
	import { get } from '@square/svelte-store';
	import { Portal } from '@yeungkc/svelte-portal';
	import ToastItem from './toast-item.svelte';
	import { toastStore } from './store.ts';

	$toastStore = get(toastStore);
</script>

{#each $toastStore as { component, message }}
	<Portal this={ToastItem} toast-content={component} {message} />
{/each}
