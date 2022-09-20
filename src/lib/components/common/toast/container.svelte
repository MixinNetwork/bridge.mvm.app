<script context="module" lang="ts">
	import { get, writable } from '@square/svelte-store';

	type ToastType = 'success';

	interface ToastProps {
		index: number;
		message: string;
		type: string;
		timer: ReturnType<typeof setTimeout>;
	}

	const toastStore = writable<Map<number, ToastProps>>(new Map());

	export function showToast(type: ToastType, message: string, duration = 3000) {
		const index = Date.now();

		const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
			toastStore.update((toasts) => {
				toasts.delete(index);
				return toasts;
			});
		}, duration);

		toastStore.update((toasts) => {
			toasts.set(index, {
				index,
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

	$: toastArray = Array.from($toastStore.values() ?? []);
</script>

<div class="fixed left-1/2 top-2 z-50 flex -translate-x-1/2 flex-col justify-center">
	{#each toastArray as item (item.index)}
		<ToastItem component={toastMap[item.type]} timer={item.timer} message={item.message} />
	{/each}
</div>
