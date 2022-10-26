<script context="module" lang="ts">
	import { derived } from '@square/svelte-store';
	import ToastItem, { type ToastItemComponent } from './toast-item.svelte';
	import Success from './success.svelte';
	import Common from './common.svelte';
	import { v4 } from 'uuid';
	import { deepWritable } from '../../../helpers/store/deep';

	const toasts = {
		success: Success,
		common: Common
	};

	export type ToastType = keyof typeof toasts;
	interface ToastProps {
		id: string;
		message: string;
		type: string;
		timer: ReturnType<typeof setTimeout>;
		component: ToastItemComponent;
	}

	const toastMapStore = deepWritable<Map<string, ToastProps>>(new Map());
	const toastsStore = derived(toastMapStore, ($toastMapStore) =>
		Array.from($toastMapStore.values() ?? [])
	);

	export function showToast(type: ToastType, message: string, duration = 3000) {
		const index = v4();

		const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
			toastMapStore.update((toasts) => {
				toasts.delete(index);
				return toasts;
			});
		}, duration);

		const component = toasts[type];

		toastMapStore.update((toasts) => {
			toasts.set(index, {
				id: index,
				message,
				type,
				timer,
				component
			});
			return toasts;
		});
	}
</script>

<div
	class="fixed left-1/2 top-2 z-50 flex w-full -translate-x-1/2 flex-col items-center justify-center space-y-2"
>
	{#each $toastsStore as { id, timer, component, message } (id)}
		<ToastItem {component} {timer} {message} />
	{/each}
</div>
