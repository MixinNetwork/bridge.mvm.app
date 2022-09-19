<script context="module" lang="ts">
	import { get, writable } from '@square/svelte-store';

	type ToastType = 'success';

	interface ToastProps {
		message: string;
		type: string;
		timer: NodeJS.Timeout;
	}

	const map = new Map();
	const toastStore = writable<Map<number, ToastProps>>(map);

	export function showToast(type: ToastType, message: string, duration = 3000) {
		const index = Date.now();

		const timer = setTimeout(() => {
			toastStore.update((toasts) => {
				toasts.delete(index);
				return toasts;
			});
		}, duration);

		toastStore.update((toasts) => {
			toasts.set(index, {
				message,
				type,
				timer
			});
			return toasts;
		});
	}
</script>

<script lang="ts">
	import { SvelteComponentTyped } from 'svelte';
	import ToastItem from './toast-item.svelte';
	import Success from './success.svelte';

	type Component = typeof SvelteComponentTyped<Record<string, any>>;
	type ToastMap = {
		[key in ToastType]: Component;
	};

	const toastMap: ToastMap = {
		success: Success
	};

	$toastStore = get(toastStore);
	$: toastArray = [];

	$: if ($toastStore.size > 0) {
		toastArray = Array.from($toastStore.values());
	} else {
		toastArray = [];
	}
</script>

<div class="fixed left-1/2 top-2 z-50 flex w-48 -translate-x-1/2 justify-center">
	{#each toastArray as { message, type, timer }}
		<ToastItem toast-content={toastMap[type]} toast-timer={timer} {message} />
	{/each}
</div>
