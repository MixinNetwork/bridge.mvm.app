<script lang="ts">
	import Close from '$lib/assets/close.svg?component';
	import LL from '$i18n/i18n-svelte';
	import { logout } from '../../../stores/user';
	import { tailwind } from '../../../transition/tailwind';

	export let close = () => {
		//
	};
</script>

<div
	transition:tailwind|local={{
		from: 'opacity-0 md:scale-90',
		to: 'scale-100 opacity-100'
	}}
	class="min-w flex flex-col rounded-2xl bg-white"
>
	<button class="mt-6 mr-6 self-end" on:click={close}>
		<Close />
	</button>

	<div class="space-y-10 p-10">
		<div class="text-xl font-bold">{$LL.logout.description()}</div>
		<div class=" space-x-6 font-semibold child:h-12 child:w-28 child:rounded-full">
			<button class="bg-black bg-opacity-5" on:click={close}>{$LL.cancel()}</button>
			<button class="bg-brand-primary text-white" on:click={logout}>{$LL.yes()}</button>
		</div>
	</div>
</div>
